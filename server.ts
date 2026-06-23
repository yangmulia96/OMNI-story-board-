import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper to parse base64 data URL or fetch HTTP URL
async function getGeminiImagePart(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    const matches = imageUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image string");
    }
    return {
      inlineData: {
        mimeType: matches[1],
        data: matches[2],
      },
    };
  } else if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
    }
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return {
      inlineData: {
        mimeType: contentType,
        data: base64,
      },
    };
  }
  throw new Error("Unknown image data format");
}

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generate Image API (Optional Reference)
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "9:16", userApiKey } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = (userApiKey && userApiKey.trim() !== "") ? userApiKey.trim() : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: "API Key not configured. Please add your Gemini API Key in the Settings or Secrets dashboard.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any || "1:1",
        },
      },
    });

    let base64Bytes = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Bytes = part.inlineData.data;
          break;
        }
      }
    }

    if (base64Bytes) {
      const dataUrl = `data:image/jpeg;base64,${base64Bytes}`;
      return res.json({ imageUrl: dataUrl });
    } else {
      return res.status(500).json({ error: "Failed to generate image: No image data returned from model." });
    }
  } catch (error: any) {
    console.error("Error in generate-image:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while generating the image.",
    });
  }
});

// Generate Storyboard API
app.post("/api/generate-storyboard", async (req, res) => {
  try {
    const {
      productName,
      productImage,
      characterImage,
      userApiKey,
      additionalInstructions,
      videoDuration = 10,
      voWordCount = "24-25 words",
      modelName = "gemini-2.5-flash",
    } = req.body;

    if (!productName || productName.trim() === "") {
      return res.status(400).json({ error: "Product name is required" });
    }

    // Whitelist acceptable models to prevent unauthorized model injection
    const allowedModels = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-pro-preview"];
    const targetModel = allowedModels.includes(modelName) ? modelName : "gemini-2.5-flash";

    // Determine API Key: prefer user key if provided, fallback to server environment key
    const apiKey = (userApiKey && userApiKey.trim() !== "") ? userApiKey.trim() : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: "API Key not configured. Please add your Gemini API Key in the Settings or Secrets dashboard.",
      });
    }

    // Initialize Gemini SDK with User-Agent for analytics
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Structure contents with base64 image parts if provided
    const parts: any[] = [];

    // System/User Prompt defining the storyboard conditions
    let textPrompt = `You are an elite, highly-coordinated team of experts working together:
1. **Senior Prompt Engineer**: You design highly optimized, detailed visual inputs for Omni Flash and Imagen 3. You select specific hardware setups (e.g. "shot on iPhone 15 Pro, 4k vertical UGC", "realistic skin pores"), avoid bad syntax, choose beautiful lighting, and make realistic visual prompts.
2. **Senior Marketer**: You structure high-conversions. You design a magnetic visual hook in 0-2s, clearly establish the product benefit/USP in 2-7s, and wrap it with a powerful Call-To-Action (CTA) at 7-10s.
3. **Senior Copywriter**: You write natural, punchy, persuasive "hard-selling" (hard selling) Voice Over (VO) scripts in modern localized Indonesian. The copy sounds natural, organic, lacks typical robotic cliches, and meets the exact word limit requested.
4. **Senior Director**: You direct high-end camera angles, dolly zooms, tracking orbits, physical subject poses, and composition framing to create an outstanding aesthetic flow.

Produce a top-tier creative storyboard based on these guidelines:
- Target Duration: ${videoDuration} seconds.
- Subject/Product: ${productName}

Specific Constraints for Omni Flash:
1. Voice Over: Generously creative, highly persuasive "hard-selling" script in standard natural Indonesian language. It must contain EXACTLY ${voWordCount} words, have no subtitles or text overlay, and mention the product name "${productName}" and its key benefits.
2. Scene Transitions & Camera Movements: Creative high-end cinematic/UGC descriptions with dolly, tracking, orbit, or slow pans.
3. Visual Tone & Directives: The prompt parameters and all generated scenes must explicitly embody realistic UGC quality. You MUST incorporate keywords like: "shot on iPhone 15 Pro", "4k vertical UGC video", "natural daylight", "handheld camera jitter", "real fabric texture", "realistic skin pores", and "imperfect lens flare" directly in both the global camera style and chronological scene descriptions to achieve a highly authentic, ultra-realistic look.
`;

    if (characterImage && productImage) {
      textPrompt += `
4. Combined Mode (Personal Branding + Product): Both a face/character reference and a product reference are uploaded. Generate scenes where the model (using the face reference image with identity lock) is actively wearing and showcasing the product reference. The scenes must explicitly contain "Use the uploaded face reference with identity lock. The subject has exactly the same face as the reference image." and detail how they are wearing or showcasing the product.`;
    } else if (characterImage) {
      textPrompt += `
4. Face Identity Reference (Personal Branding Focus): There is an uploaded face/character reference image. The scenes should focus on personal branding. Your scene descriptions MUST explicitly contain "Use the uploaded face reference with identity lock. The subject has exactly the same face as the reference image." to trigger correct character locking/reference.`;
    } else if (productImage) {
      textPrompt += `
4. Product-Only Mode (No Model Face): There is ONLY a product reference photo uploaded (no character/face photo is uploaded). The storyboard MUST be 100% focused on the product itself. Design scenes showing close-ups of the product, detailed textures, fabric, colors, or hands-on interactions. Avoid showing any model's face (use headless angles, back shots, or close-ups focused entirely on the items/clothes/objects) so that the product remains the absolute focus.`;
    }

    if (productImage && !characterImage) {
      textPrompt += `
5. Product Styling: Scene descriptions must describe the details, fabric, colors and silhouette resembling the uploaded product reference, without displaying facial features.`;
    } else if (productImage) {
      textPrompt += `
5. Product Styling: Scene descriptions must describe the details, fabric, colors and silhouette resembling the uploaded product reference.`;
    }

    if (additionalInstructions && additionalInstructions.trim() !== "") {
      textPrompt += `\n\nAdditional Concept or Guidance specified by user: "${additionalInstructions}"`;
    }

    textPrompt += `\n\nPlease output the raw JSON conforming to the requested schema. Generate exactly 5 scenes dividing the 10 seconds (e.g. 0-2s, 2-4s, 4-7s, 7-9s, 9-10s) covering full angles and close-up lifestyle shots.`;

    parts.push({ text: textPrompt });

    // Attach character image if provided
    if (characterImage) {
      try {
        const part = await getGeminiImagePart(characterImage);
        parts.push(part);
      } catch (err) {
        console.error("Failed to parse/fetch character image:", err);
      }
    }

    // Attach product image if provided
    if (productImage) {
      try {
        const part = await getGeminiImagePart(productImage);
        parts.push(part);
      } catch (err) {
        console.error("Failed to parse/fetch product image:", err);
      }
    }

    // Call Gemini with strict JSON Mode response Schema
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            camera_style: {
              type: Type.STRING,
              description: "Premium commercial visual style, camera setup, realistic color presets, lifestyle advertisement environment aesthetics.",
            },
            movement: {
              type: Type.STRING,
              description: "Primary camera tracking movements across the entire video (e.g. tracking, dolly, elegant body turns).",
            },
            lighting: {
              type: Type.STRING,
              description: "Professional lighting environment setup (e.g. bright neutral daylight, studio softboxes, warm key light).",
            },
            background: {
              type: Type.STRING,
              description: "Description of the scene background setting design (e.g. modern minimalist loft, lush warm garden).",
            },
            voice_over: {
              type: Type.STRING,
              description: "The 24-25 word hard-selling narration in Indonesian language. Ensure it is persuasive, clean, and mentions the product.",
            },
            scenes: {
              type: Type.ARRAY,
              description: "Chronological 5-scene list spanning the full 10 seconds of video duration.",
              items: {
                type: Type.OBJECT,
                properties: {
                  time: {
                    type: Type.STRING,
                    description: "Duration range (e.g., 0-2s, 2-4s, etc.).",
                  },
                  shot: {
                    type: Type.STRING,
                    description: "Framing shot style (e.g., Medium full-body shot, close-up details).",
                  },
                  description: {
                    type: Type.STRING,
                    description: "Rich description detailing the subject, action, fabric, product adjustments, plus matching character and product reference lock references if applicable.",
                  },
                  camera_motion: {
                    type: Type.STRING,
                    description: "Specific camera motion for this scene shot.",
                  },
                  image_prompt: {
                    type: Type.STRING,
                    description: "Extremely detailed, professional, high-fidelity prompt for text-to-image generators (e.g. Imagen 3, Midjourney, Flux) that acts as the starting reference frame for the scene. Must describe subject, detailed lighting, clothes, composition, and UGC shot quality clearly. No camera motion terms.",
                  },
                },
                required: ["time", "shot", "description", "camera_motion", "image_prompt"],
              },
            },
            negative_prompt: {
              type: Type.STRING,
              description: "Comprehensive negative prompt string to ensure optimal rendering, excluding text overlays, deformation, low quality etc.",
            },
          },
          required: [
            "camera_style",
            "movement",
            "lighting",
            "background",
            "voice_over",
            "scenes",
            "negative_prompt",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "No output generated from Gemini model" });
    }

    try {
      const parsedJson = JSON.parse(text);
      return res.json(parsedJson);
    } catch (parseError) {
      console.error("Failed to parse output as JSON:", text);
      return res.status(500).json({
        error: "Failed to parse model response as structured JSON",
        rawOutput: text,
      });
    }
  } catch (error: any) {
    console.error("Error in generate-storyboard:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while generating the storyboard.",
    });
  }
});

// Configure Vite or production static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupServer();
