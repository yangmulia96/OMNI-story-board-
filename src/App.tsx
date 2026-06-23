import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Camera,
  User,
  ShoppingBag,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  Trash2,
  Upload,
  Info,
  Layers,
  Flame,
  Clock,
  History,
  Eye,
  Settings,
  HelpCircle
} from "lucide-react";
import { StoryboardResponse, HistoryItem, StoryboardScene } from "./types";

// High-fidelity pre-loaded sample storyboard
const SAMPLE_STORYBOARD: StoryboardResponse = {
  camera_style: "Premium fashion commercial, shot on iPhone 15 Pro, 4k vertical UGC video, natural daylight, handheld camera jitter, realistic skin pores, imperfect lens flare, luxury lifestyle advertisement, cinematic look, shallow depth of field, hyper realistic.",
  movement: "Slow dolly, tracking shot, hand-held camera jitter, elegant body turns, natural fabric movement, professional fashion showcase.",
  lighting: "Bright neutral daylight, soft natural sun flare, crisp white balance, realistic shadows, vivid true colors, premium studio quality.",
  background: "Modern minimalist indoor loft with neutral tones and subtle lifestyle elements, clean and luxurious atmosphere.",
  voice_over: "Baggy jeans hitam retro ini wajib punya! Highwaist, loose fit, unisex dan super nyaman. Stok terbatas, langsung checkout sebelum kehabisan!",
  scenes: [
    {
      time: "0-2s",
      shot: "Medium full-body shot",
      description: "Use the uploaded face reference with identity lock. The subject has exactly the same face as the reference image, shot on iPhone 15 Pro, 4k vertical UGC video, showcasing realistic skin pores and handheld camera jitter. Wearing the exact UNISEX Baggy Jeans Wanita Highwaist Loose Jeans Hitam Retro. The subject confidently walks toward the camera with real fabric texture in natural daylight.",
      camera_motion: "Slow forward tracking shot with realistic handheld jitter",
      image_prompt: "Premium UGC advertisement photo, shot on iPhone 15 Pro, vertical 9:16 layout. A beautiful Indonesian model walking confidently towards the camera inside a sunny minimalist loft, wearing black high-waisted baggy denim jeans. Realistic skin pores, handheld camera style, bright natural daylight, volumetric dust motes, clear denim material texture."
    },
    {
      time: "2-4s",
      shot: "Close-up detail shot",
      description: "Focus on the black retro denim texture showing real fabric texture under imperfect lens flare and natural daylight. The subject casually places both hands inside the pockets showing natural folds and high-fidelity clothing details.",
      camera_motion: "Smooth cinematic handheld pan",
      image_prompt: "UGC close-up commercial photography showing black denim fabric texture of loose retro jeans. The hands are casually placed in the front pockets. Bright neutral daylight, imperfect lens flare, incredibly crisp textile fibers, natural folds, professional clothing showcase."
    },
    {
      time: "4-7s",
      shot: "Lifestyle fashion shot",
      description: "The subject turns naturally to showcase front, side, and back views of the jeans. Shot on iPhone 15 Pro, capturing realistic skin pores and high fabric detail under natural daylight.",
      camera_motion: "Slow orbit movement with slight handheld shake",
      image_prompt: "Professional UGC street style photoshoot, vertical 9:16. An Indonesian model turning around to show off the back and sides of her loose retro black baggy jeans. Shot on iPhone 15 Pro, vibrant high contrast sunlight, neutral clean studio loft background, beautiful lighting."
    },
    {
      time: "7-9s",
      shot: "Dynamic pose shot",
      description: "The subject takes several relaxed steps, lightly adjusts the waistband and pockets, then looks confidently at the camera. Beautiful natural daylight casting realistic shadows on physical fabric.",
      camera_motion: "Low-angle tracking shot, handheld movement",
      image_prompt: "UGC style lookbook capture, low-angle shot, vertical layout. An Indonesian model smiling slightly, stepping forward while adjusting her baggy retro black jeans waistband. Natural sunlight casting elegant soft shadows, high fabric details."
    },
    {
      time: "9-10s",
      shot: "Hero fashion shot",
      description: "The subject stops and strikes a stylish pose with one hand in the pocket. Beautiful imperfect lens flare and high-contrast sunlight highlights the silhouette and premium black retro denim. Hyper realistic UGC fashion campaign quality.",
      camera_motion: "Slow push-in",
      image_prompt: "High-end fashion commercial campaign photo, 4k vertical, shot on iPhone 15 Pro. An Indonesian model in a stylish confident pose with one hand in her baggy denim waist pocket, rich lens flare, warm organic sunlight, luxury minimalist background."
    }
  ],
  negative_prompt: "Text overlay, subtitles, watermark, logo addition, face changes, identity drift, beautification, different hairstyle, wrong jeans color, skinny jeans, tight fit, deformation, unrealistic anatomy, duplicate limbs, unstable motion, low quality, blurry image, cartoon style, exaggerated poses, incorrect clothing details."
};

// Preset lists for rapid testing and high-quality generation
const AD_PRESETS = [
  {
    name: "90s Retro Denim Iklan",
    product: "Baggy Jeans Hitam Retro",
    guidance: "Premium black denim retro highwaist, 90s classic aesthetic, natural lighting, high contrast shadows.",
    charUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
    prodUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600"
  },
  {
    name: "Luxury Minimalist Activewear",
    product: "Veloce Airflow Workout Set",
    guidance: "Aerodynamic active sportwear fit, premium studio softboxes, energetic body stretches, athletic identity.",
    charUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600",
    prodUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600"
  },
  {
    name: "Sophisticated Jewelry",
    product: "Aurora Sterling Silver Ring",
    guidance: "Luxury macro shots, bright pristine focus reflections, elegant hand gestures, ambient warm key light.",
    charUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    prodUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600"
  },
  {
    name: "Urban Oversized Streetwear",
    product: "Cyberpunk Techwear Jacket",
    guidance: "Tokyo rainy night neon street atmosphere, dynamic lights, glossy texture details, premium cyber-fashion campaign.",
    charUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600",
    prodUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600"
  }
];

// Preloaded professional storyboards to provide instant high-fidelity feedback upon clicking presets
const PRESET_STORYBOARDS: Record<string, StoryboardResponse> = {
  "90s Retro Denim Iklan": {
    camera_style: "Premium fashion commercial, shot on iPhone 15 Pro, 4k vertical UGC video, natural daylight, retro aesthetic, realistic skin textures, high contrast shadow play.",
    movement: "Handheld camera jitter, slow panning, elegant body turns, showcasing denim fabric folds.",
    lighting: "Warm golden-hour sunlight, dramatic shadows, realistic physical fabric contrast.",
    background: "Retro cityscape block with brick walls and warm vintage streetlights.",
    voice_over: "Baggy jeans hitam retro ini beneran game-changer! Bahan denim tebal premium, fit-nya pas banget di pinggang tapi tetep loose. Buruan checkout!",
    scenes: [
      {
        time: "0-2s",
        shot: "Medium full-body shot",
        description: "The subject confidently steps onto a brick paved street. Wearing premium high-waisted black baggy jeans. Shot on iPhone 15 Pro, natural vertical framing with beautiful warm highlights.",
        camera_motion: "Slow dolly forward",
        image_prompt: "UGC style fashion campaign photo, 4k, vertical 9:16 layout, shot on iPhone 15 Pro. An Indonesian model wearing premium black retro baggy jeans standing on a vintage brick-walled city street under warm golden sunlight. Absolute clothing details."
      },
      {
        time: "2-4s",
        shot: "Close-up detail shot",
        description: "Detailed zoom on the black denim texture, showcasing solid metal zippers, pockets, and premium vintage wash with rich fabric grains.",
        camera_motion: "Slow handheld pan across texture",
        image_prompt: "Macro close-up shot of raw black denim jeans pocket and seams, premium detailed quality, visible stitching under warm studio light, premium textile fibers."
      },
      {
        time: "4-7s",
        shot: "Dolly back shot",
        description: "The subject turns around to show the loose silhouette from the side and back angles. High fabric fidelity, realistic shadows.",
        camera_motion: "Slow circular orbit around subject",
        image_prompt: "UGC portrait, full body shot pointing at back pocket and loose silhouette of premium custom retro black baggy jeans, clean street style background."
      },
      {
        time: "7-9s",
        shot: "Low-angle medium shot",
        description: "Stylized walk showcasing movement and flow of the baggy denim. The fabric swings naturally with each step. Imperfect lens flare.",
        camera_motion: "Low angle tracking pan",
        image_prompt: "Low angle action shot of model walking down street wearing retro black loose jeans, high physical fabric motion, realistic dust and wind movement, warm focus."
      },
      {
        time: "9-10s",
        shot: "Hero exit shot",
        description: "The subject looks at the camera with a subtle, confident expression, holding a retro leather jacket over one shoulder.",
        camera_motion: "Slow push-in into a freeze-frame visual",
        image_prompt: "UGC style vertical portrait 9:16, Indonesian model wearing retro black baggy jeans looking at camera, holding leather jacket over shoulder, warm cinematic lens flares."
      }
    ],
    negative_prompt: "blur, low resolution, subtitles, graphic text overlay, watermarks, bad proportions, synthetic textures, unnatural body folds."
  },
  "Luxury Minimalist Activewear": {
    camera_style: "Chic luxury sportswear look, high-framerate 4k vertical, smooth camera tracking, clean studio aesthetics.",
    movement: "Fluid sweeps, low-latency gimble tracking, dynamic physical extensions.",
    lighting: "Soft ambient fill light with crisp white key lights highlighting muscle curves and fiber weave.",
    background: "Ultra-modern architectural gym studio with concrete walls, floor-to-ceiling glass paneling.",
    voice_over: "Workout set paling lembut dan anti-gerah! Veloce Airflow pas banget ngikutin lekukan tubuh tanpa rasa sesak. Olahraga jadi makin pede!",
    scenes: [
      {
        time: "0-2s",
        shot: "Medium full-body shot",
        description: "Model wearing the Veloce activewear set doing a light stretch near a concrete pillar. Highlight the sleek fit and seamless mesh design.",
        camera_motion: "Smooth low lateral sweep",
        image_prompt: "Premium luxury athleisure photo, 4k vertical 9:16. An athletic model wearing a matching charcoal-grey seamless workout set, stretching in a minimalist modern concrete gymnasium."
      },
      {
        time: "2-4s",
        shot: "Macro back-view shot",
        description: "Close-up highlighting sweat-wicking airflow patterns and high-performance stitching along the shoulder blades.",
        camera_motion: "Slow vertical tilt up",
        image_prompt: "Macro close-up of high-tech sweat-wicking athletic fabric, charcoal grey tight weave texture under bright professional studio softbox lights."
      },
      {
        time: "4-7s",
        shot: "High-angle action shot",
        description: "Model confidently walking forward with a yoga mat under one arm, looking energized and focused.",
        camera_motion: "Slow backing pedestal shot",
        image_prompt: "Vertical commercial print photo of fit athletic model walking confidently with a premium matching yoga mat under her arms, modern gym architecture background."
      },
      {
        time: "7-9s",
        shot: "Close-up product tilt",
        description: "Detailed visual of the waistband, showing zero slippage and flexible, thick compression band material.",
        camera_motion: "Stabilized handheld centering pan",
        image_prompt: "Macro close-up detail of high-elastic compression waistband on charcoal workout tights, showing seamless stitches, clean active lock, top-tier clothing quality."
      },
      {
        time: "9-10s",
        shot: "Hero active pose",
        description: "Final strong posture, model looks into camera with a bright, welcoming smile. High-end lifestyle vibe.",
        camera_motion: "Push-in to midshot, subtle fade transition",
        image_prompt: "Minimalist fitness portrait, 4k 9:16 vertical. Athletic female smiling looking at camera, wearing premium design sportswear, high fashion chic mood."
      }
    ],
    negative_prompt: "low quality, subtitles, text graphics, logos, loose seams, wrinkles, deformed frame, drawings, illustrations."
  },
  "Sophisticated Jewelry": {
    camera_style: "Hyper-macro cinematic jewelry campaign, professional focus racking, ultra-high fidelity, specular reflections.",
    movement: "Micro rotation stage, precision dolly slider, hyper-slow motion adjustments.",
    lighting: "Intense dark-field illumination with spot mirrors, pristine diamond and silver sparkle sparkles.",
    background: "Vantablack velvet backdrop with dramatic dark specular gradients.",
    voice_over: "Kemewahan abadi Aurora Sterling Silver Ring. Dibuat presisi tinggi untuk kilau sempurna di setiap gerakan jari manis Anda.",
    scenes: [
      {
        time: "0-2s",
        shot: "Hyper macro showcase",
        description: "The pristine Aurora Sterling Silver Ring spinning slowly on a black reflective stand. Specular highlights shimmer under precision spotlights.",
        camera_motion: "Super slow push in",
        image_prompt: "Hyper-detailed macro commercial photoshoot of a shiny silver ring inlaid with flawless diamonds, resting on dark fluid glass reflections. Dark luxury mood."
      },
      {
        time: "2-4s",
        shot: "Close-up hand shot",
        description: "A model's elegant fingers gently slide the ring onto their finger, highlighting how beautifully it hugs the hand skin. Natural studio soft lighting.",
        camera_motion: "Soft focus slide down",
        image_prompt: "Close-up of elegant fingers with clean well-manicured skin, wearing a brilliant sparkling silver ring, luxurious backdrop, editorial jewelry fashion."
      },
      {
        time: "4-7s",
        shot: "Dual lighting transition",
        description: "The hand raises slightly to catch different angles of ambient light, casting sharp flares and brilliant gemstone reflections.",
        camera_motion: "Precise orbit pan",
        image_prompt: "Cinematic close-up of custom silver jewelry ring catching crisp light spotlights, glistening diamond reflections, dark minimalist studio."
      },
      {
        time: "7-9s",
        shot: "Macro engraving focus",
        description: "Deep zoom on the inner ring band detailing the custom authentic sterling silver stamp and subtle filigree pattern.",
        camera_motion: "Extremely slow tilt",
        image_prompt: "Extreme macro photography of authentic sterling silver inner band engraving, intricate filigree, precision craftsmanship model."
      },
      {
        time: "9-10s",
        shot: "Hero lifestyle shot",
        description: "The hand rests on a silk fabric lapel of a tailored charcoal blazer, showcasing the ring in a sophisticated lifestyle setting.",
        camera_motion: "Slow pull-back to classic vertical layout",
        image_prompt: "Minimalist corporate luxury 9:16 portrait. Hand wearing sparkling silver ring resting elegantly on a textured grey luxury blazer lapel, high end fashion editorial look."
      }
    ],
    negative_prompt: "blurry, yellowish tint, bad quality, cheap alloy, watermarks, dirty nails, deformed hands, low spec."
  },
  "Urban Oversized Streetwear": {
    camera_style: "Raw urban cyberpunk fashion, cinematic nocturnal vibes, moody neon cast, commercial vertical layout.",
    movement: "Low-angle kinetic camera tracking, quick handheld whip pans, authentic jitter.",
    lighting: "Vibrant neon purple and blue backlights, wet-streets mirror reflections, high contrast moody key light.",
    background: "Rainy side alley of a Tokyo neon city district, wet asphalt, cyber-punk textures.",
    voice_over: "Cyberpunk Techwear Jacket ini tahan air, angin, dan cuaca ekstrem! Desain modular futuristik khusus kamu yang berani beda.",
    scenes: [
      {
        time: "0-2s",
        shot: "Low angle full-body shot",
        description: "Model stands under a flickering neon sign. Wearing the cyberpunk techwear jacket with straps dangling naturally. Raindrops visible on fabric.",
        camera_motion: "Low-angle upward dolly sweep",
        image_prompt: "Urban techwear commercial campaign, 4k vertical. Model in a premium black cyberpunk jacket with tactical straps, standing on a wet street at night with glowing purple and cyan neon signs."
      },
      {
        time: "2-4s",
        shot: "Macro fabric moisture-proof test",
        description: "Extreme zoom on water droplets bead-rolling off the hydrophobic synthetic nylon texture of the jacket sleeves.",
        camera_motion: "Slow sliding micro pan",
        image_prompt: "Extreme macro of water droplets beading and easily sliding off waterproof dark techwear nylon fabric under dark rainy neon reflections."
      },
      {
        time: "4-7s",
        shot: "Action hood-pull shot",
        description: "Model smoothly pulls up the tactical oversized rain hood. Neon highlights contouring the side of their face.",
        camera_motion: "Quick handheld rotation",
        image_prompt: "Moody close-up vertical portrait of a model pulling up a matte-black tactical deep hood, neon magenta reflections highlighting face edges, cyber mood."
      },
      {
        time: "7-9s",
        shot: "Functional strap close-up",
        description: "Focus on the heavy-duty magnetic buckle and reinforced strap attachments along the pocket seam. High contrast neon gloss.",
        camera_motion: "Slow macro slide tilt",
        image_prompt: "Extreme macro close-up of anodized black metal tactical magnetic buckle and thick nylon utility strap loops, high futuristic styling."
      },
      {
        time: "9-10s",
        shot: "Hero attitude pose",
        description: "Model turns slightly away, looking back over the shoulder directly into the camera. Cyberpunk aesthetic in full display.",
        camera_motion: "Cinematic smash zoom back",
        image_prompt: "Nocturnal cyberpunk streetwear editorial full-shot. Model looking back over shoulder with military techwear, glowing rainy Tokyo alleyway background."
      }
    ],
    negative_prompt: "bright daylight, warm sun, clean office, bad anatomy, blur, text watermarks, cartoons, illustrations."
  }
};

export default function App() {
  // Application states
  const [productName, setProductName] = useState("Baggy Jeans Hitam Retro");
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [additionalInstructions, setAdditionalInstructions] = useState(
    "Konsepnya dipakai oleh karakter yang wajahnya sama dengan foto referensi. Video generator menggunakan omni flash dengan durasi 10 detik. Lengkap dengan voice over (24-25 kata) yang hard selling tanpa text overlay."
  );
  
  // Custom API key options (optional to enter directly in UI)
  const [userApiKey, setUserApiKey] = useState(() => {
    try {
      return localStorage.getItem("omniflash_user_api_key") || "";
    } catch (e) {
      return "";
    }
  });
  const [showApiKey, setShowApiKey] = useState(false);

  // Save user API Key to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("omniflash_user_api_key", userApiKey);
    } catch (e) {
      console.error("Failed to save API key to localStorage", e);
    }
  }, [userApiKey]);

  // Settings configs
  const [videoDuration, setVideoDuration] = useState("10");
  const [voWordCount, setVoWordCount] = useState("24-25 words");
  const [modelName, setModelName] = useState("gemini-2.5-flash");

  // Active Preset Tracker
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);

  // Optical Scene Frame Image Generator States
  const [generatingImages, setGeneratingImages] = useState<Record<number, boolean>>({});
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, string>>({});

  const generateSceneImage = async (prompt: string, idx: number) => {
    setGeneratingImages(prev => ({ ...prev, [idx]: true }));
    setImageErrors(prev => ({ ...prev, [idx]: "" }));
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          aspectRatio: "9:16", // vertical commercial format
          userApiKey,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menghasilkan gambar dari API.");
      }

      const data = await res.json();
      setGeneratedImages(prev => ({ ...prev, [idx]: data.imageUrl }));
    } catch (err: any) {
      console.error(err);
      setImageErrors(prev => ({ ...prev, [idx]: err.message || "Gagal membuat gambar." }));
    } finally {
      setGeneratingImages(prev => ({ ...prev, [idx]: false }));
    }
  };

  // Output response states
  const [storyboard, setStoryboard] = useState<StoryboardResponse>(SAMPLE_STORYBOARD);
  const [activeTab, setActiveTab] = useState<"visual" | "json" | "voice_over">("visual");
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedSceneIndex, setCopiedSceneIndex] = useState<number | null>(null);

  const handleCopyText = (text: string, idx: number) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedSceneIndex(idx);
          setTimeout(() => setCopiedSceneIndex(null), 2000);
        });
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopiedSceneIndex(idx);
        setTimeout(() => setCopiedSceneIndex(null), 2005);
      }
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  // Storage / History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("omniflash_storyboard_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load storyboard history from localStorage", e);
    }
  }, []);

  // Save item to history
  const saveToHistory = (newStoryboard: StoryboardResponse, prodName: string, pathCharFilename?: string, pathProdFilename?: string) => {
    try {
      const newItem: HistoryItem = {
        id: "hist_" + Date.now(),
        createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        productName: prodName,
        productImageName: pathProdFilename,
        characterImageName: pathCharFilename,
        promptText: additionalInstructions,
        data: newStoryboard
      };
      const updatedHistory = [newItem, ...history].slice(0, 50); // Keep max 50 items
      setHistory(updatedHistory);
      localStorage.setItem("omniflash_storyboard_history", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  // Delete history item
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("omniflash_storyboard_history", JSON.stringify(updated));
  };

  // Apply a preset
  const applyPreset = (preset: typeof AD_PRESETS[0]) => {
    setSelectedPresetName(preset.name);
    setProductName(preset.product);
    
    // Set seed URLs
    setCharacterImage(preset.charUrl);
    setProductImage(preset.prodUrl);
    
    const inst = `Konsepnya dipakai oleh karakter yang wajahnya sama dengan foto referensi. Video generator menggunakan omni flash dengan durasi 10 detik. Lengkap dengan voice over (24-25 kata) yang hard selling tanpa text overlay. \n\nStyle Guide: ${preset.guidance}`;
    setAdditionalInstructions(inst);
    
    // Instantly load the pre-written storyboards for this preset!
    if (PRESET_STORYBOARDS[preset.name]) {
      setStoryboard(PRESET_STORYBOARDS[preset.name]);
      setActiveTab("visual");
    }
  };

  // Load old storyboard from history
  const loadHistoryItem = (item: HistoryItem) => {
    setStoryboard(item.data);
    setProductName(item.productName);
    if (item.promptText) setAdditionalInstructions(item.promptText);
    setSelectedPresetName(null); // Clear active preset tag since loading custom historic work
    setShowHistoryModal(false);
  };

  // Convert files to compressed base64 data URLs to prevent 413 network errors or browser crashes
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "character" | "product"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPresetName(null); // Reset active preset highlight since user uploaded their own media
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High-end smart scaling on client-side (limits payload to ~100-200kb total)
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
          if (type === "character") {
            setCharacterImage(compressedBase64);
          } else {
            setProductImage(compressedBase64);
          }
        } else {
          // Canvas failure fallback
          if (type === "character") {
            setCharacterImage(event.target?.result as string);
          } else {
            setProductImage(event.target?.result as string);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Trigger storyboard API generation
  const handleGenerate = async () => {
    if (!productName.trim()) {
      setErrorMsg("Nama produk tidak boleh kosong!");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setProgressMsg(`Menghubungkan ke Gemini (${modelName})...`);

    try {
      const progressSteps = [
        "Menganalisis aset visual referensi (karakter & produk)...",
        "Merancang struktur visual 10-detik premium...",
        "Menyusun naskah voice-over bahasa indonesia hard-selling (24-25 kata)...",
        "Menyusun properti kamera cinematic & format JSON Omni Flash...",
        "Selesai! Menyajikan storyboard..."
      ];

      let step = 0;
      const interval = setInterval(() => {
        if (step < progressSteps.length) {
          setProgressMsg(progressSteps[step]);
          step++;
        } else {
          clearInterval(interval);
        }
      }, 1500);

      const response = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          productImage,
          characterImage,
          userApiKey,
          additionalInstructions,
          videoDuration: parseInt(videoDuration, 10),
          voWordCount,
          modelName,
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghasilkan storyboard dari API.");
      }

      const data: StoryboardResponse = await response.json();
      setStoryboard(data);
      
      // Save output to historical storage
      saveToHistory(
        data, 
        productName, 
        characterImage ? "Wajah Karakter" : undefined, 
        productImage ? "Foto Produk" : undefined
      );

      // Force view active to visual storyboard
      setActiveTab("visual");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Koneksi backend/Gemini gagal. Mohon verifikasi API Key Anda.");
    } finally {
      setLoading(false);
    }
  };

  // Utility to handle copying JSON output with iframe fallback
  const handleCopy = () => {
    const textToCopy = JSON.stringify(storyboard, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch((err) => {
            console.warn("Clipboard API failed, using fallback:", err);
            fallbackCopy(textToCopy);
          });
      } else {
        fallbackCopy(textToCopy);
      }
    } catch (e) {
      console.warn("Clipboard access error, using fallback:", e);
      fallbackCopy(textToCopy);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback copy failed entirely:", err);
    }
  };

  // Helper analyzer to count word for VO
  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none antialiased">
      {/* Dynamic Header */}
      <nav id="navbar" className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider block leading-none">UGC STORYBOARD ENGINE</span>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              OmniFlash <span className="text-indigo-400 font-medium">Studio</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Configured API Key Section - Cleaned up to avoid cluttering */}
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center bg-zinc-900 border ${userApiKey ? 'border-indigo-500/50' : 'border-zinc-800'} rounded-lg px-2.5 py-1.5 transition-all`}>
              <span className={`text-[9px] uppercase font-bold mr-2 ${userApiKey ? 'text-indigo-400' : 'text-zinc-500'}`}>
                {userApiKey ? "CUSTOM API KEY SET" : "GEMINI API KEY"}
              </span>
              <input
                type={showApiKey ? "text" : "password"}
                placeholder="Settings Key..."
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs w-28 text-zinc-300 placeholder-zinc-600 font-mono"
              />
              <button 
                onClick={() => setShowApiKey(!showApiKey)} 
                className="ml-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                title={showApiKey ? "Sembunyikan Key" : "Tampilkan Key"}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-2.5 rounded-lg border border-zinc-800 transition-colors flex items-center gap-2 text-xs font-semibold"
              title="Riwayat Pembuatan"
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Riwayat ({history.length})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1700px] mx-auto w-full">
        
        {/* LEFT COLUMN: Input Form Section */}
        <aside id="sidebar-inputs" className="w-full lg:w-[420px] shrink-0 border-r border-zinc-900 p-6 flex flex-col gap-6 bg-zinc-900/20 overflow-y-auto">
          
          {/* Presets Quick Pick */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="block text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Cepat Pakai Preset
              </span>
              {selectedPresetName && (
                <span className="text-[9px] bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                  Preset Aktif
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AD_PRESETS.map((p, index) => {
                const isActive = selectedPresetName === p.name;
                return (
                  <button
                    key={index}
                    onClick={() => applyPreset(p)}
                    className={`border rounded-lg p-2 text-left transition-all group duration-200 cursor-pointer ${
                      isActive
                        ? "bg-indigo-950/20 border-indigo-500 shadow-sm shadow-indigo-500/10"
                        : "bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-750 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-[11px] font-bold block truncate leading-tight flex-1 ${
                        isActive ? "text-indigo-400" : "text-zinc-300 group-hover:text-indigo-400"
                      }`}>
                        {p.name}
                      </p>
                      {isActive && <Check className="w-3 h-3 text-indigo-400 shrink-0 animate-bounce" />}
                    </div>
                    <span className="text-[9px] text-zinc-500 block truncate mt-0.5 leading-none">
                      {p.product}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-zinc-900" />

          {/* Core Product Input */}
          <section id="sect-product-name" className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" /> Nama Produk <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-500 italic">Ketik nama mode/merk</span>
            </div>
            <input
              type="text"
              placeholder="Contoh: Baggy Jeans Hitam Retro, Skincare Sakura Glow"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950 outline-none transition-all text-zinc-100 font-medium placeholder-zinc-600"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </section>

          {/* TWO COLUMN IMAGE LOADERS */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* CHARACTER UPLOAD */}
            <section id="sect-character-img" className="flex flex-col gap-1.5 focus-within:ring-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Foto Karakter
              </label>
              
              {!characterImage ? (
                <div className="relative group border border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center bg-zinc-900/50 cursor-pointer h-28 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "character")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[10px] text-zinc-400 font-semibold leading-tight block">Upload Wajah</span>
                  <p className="text-[8px] text-zinc-600 leading-none">Opsional</p>
                </div>
              ) : (
                <div className="relative border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 h-28 flex flex-col items-center justify-center p-2 group">
                  <img
                    src={characterImage}
                    alt="Character Reference"
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-1.5">
                    <button
                      onClick={() => setCharacterImage(null)}
                      className="bg-rose-600 hover:bg-rose-500 text-white p-1.5 rounded-lg text-xs"
                      title="Hapus gambar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-bold text-white uppercase block tracking-wider">Ganti</span>
                  </div>
                </div>
              )}
            </section>

            {/* PRODUCT UPLOAD */}
            <section id="sect-product-img" className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Foto Produk
              </label>
              
              {!productImage ? (
                <div className="relative group border border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center bg-zinc-900/50 cursor-pointer h-28 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "product")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[10px] text-zinc-400 font-semibold leading-tight block">Upload Produk</span>
                  <p className="text-[8px] text-zinc-600 leading-none">Opsional</p>
                </div>
              ) : (
                <div className="relative border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 h-28 flex flex-col items-center justify-center p-2 group">
                  <img
                    src={productImage}
                    alt="Product Reference"
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-1.5">
                    <button
                      onClick={() => setProductImage(null)}
                      className="bg-rose-600 hover:bg-rose-500 text-white p-1.5 rounded-lg text-xs"
                      title="Hapus gambar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-bold text-white uppercase block tracking-wider">Ganti</span>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ADVANCED GENERATING OPTIONS */}
          <div className="bg-zinc-900/50 border border-zinc-850 rounded-xl p-3.5 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Settings className="w-3.5 h-3.5 text-indigo-400" /> Pengaturan Omni Flash & Model
            </h4>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Durasi Video</label>
                <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                  <button
                    onClick={() => setVideoDuration("10")}
                    className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${videoDuration === "10" ? "bg-indigo-600 text-white shadow" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    10s
                  </button>
                  <button
                    onClick={() => setVideoDuration("15")}
                    className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${videoDuration === "15" ? "bg-indigo-700 text-white shadow" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    15s
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Target Naskah VO</label>
                <select
                  value={voWordCount}
                  onChange={(e) => setVoWordCount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 text-[11px] font-bold rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
                >
                  <option value="24-25 words">24-25 Kata</option>
                  <option value="15-20 words">15-20 Kata</option>
                  <option value="30-35 words">30-35 Kata</option>
                </select>
              </div>
            </div>

            <div className="border-t border-zinc-850/60 pt-2.5">
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Model AI (Mendukung Key Gratis)
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                <button
                  onClick={() => setModelName("gemini-2.5-flash")}
                  className={`text-[10px] font-bold py-1.5 rounded-md transition-all truncate px-0.5 ${
                    modelName === "gemini-2.5-flash"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Gemini 2.5 Flash - Handal & Cepat (Sangat direkomendasikan untuk Key Gratis)"
                >
                  2.5 Flash
                </button>
                <button
                  onClick={() => setModelName("gemini-3.1-pro-preview")}
                  className={`text-[10px] font-bold py-1.5 rounded-md transition-all truncate px-0.5 ${
                    modelName === "gemini-3.1-pro-preview"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Gemini 3.1 Pro (Studio Pro) - Khusus untuk analisis sutradara, marketer, dan copywriter senior"
                >
                  3.1 Pro
                </button>
                <button
                  onClick={() => setModelName("gemini-3.5-flash")}
                  className={`text-[10px] font-bold py-1.5 rounded-md transition-all truncate px-0.5 ${
                    modelName === "gemini-3.5-flash"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Gemini 3.5 Flash - Model Kreatif Terbaru"
                >
                  3.5 Flash
                </button>
              </div>
              <p className="text-[9px] text-zinc-500 mt-1 select-none leading-normal">
                Gunakan <strong>2.5 Flash</strong> untuk kunci gratis, atau <strong>3.1 Pro / 3.5 Flash</strong> untuk akurasi kepenulisan senior.
              </p>
            </div>
          </div>

          {/* Trigger Concept / Custom Instructions */}
          <section id="sect-instructions" className="flex flex-col gap-1.5 flex-1">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Tambah Instruksi & Konsep
              </span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-normal uppercase">Prompt Triger</span>
            </label>
            <textarea
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs h-32 tracking-wide focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950 outline-none resize-none leading-relaxed text-zinc-300 placeholder-zinc-600"
              placeholder="Masukkan instruksi khusus atau sudut pandang pemasaran iklan. Klik salah satu preset di bagian atas untuk mengisinya secara otomatis."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
            />
          </section>

          {/* Primary Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              loading 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" 
                : "bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Hasilkan Storyboard...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200 fill-indigo-200/30" />
                <span>Buat Storyboard & Prompt!</span>
              </>
            )}
          </button>

          {/* Tips Info Block */}
          <div className="mt-auto p-4 bg-indigo-950/20 border border-indigo-500/15 rounded-xl flex gap-3 items-start">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-300 leading-relaxed select-none">
              <strong>Tips Premium:</strong> Tulis deskripsi produk secara detail (warna, bahan, potongan) untuk mendapatkan visualisasi naskah Omni Flash yang sangat presisi dan realistis.
            </p>
          </div>
        </aside>

        {/* RIGHT COLUMN: Output Preview Area */}
        <main id="storyboard-viewport" className="flex-1 flex flex-col bg-zinc-950 p-6 overflow-hidden min-w-0">
          
          {/* Output Navigation Header tabs & action controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-4 gap-4 mb-6">
            <div className="flex bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-900 gap-1 select-none">
              <button
                onClick={() => setActiveTab("visual")}
                className={`px-4 sm:px-6 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "visual"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Visual Storyboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab("json")}
                className={`px-4 sm:px-6 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "json"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <CodeIcon className="w-3.5 h-3.5" />
                <span>JSON Prompt</span>
                <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide leading-none hidden sm:inline">Omni Flash</span>
              </button>

              <button
                onClick={() => setActiveTab("voice_over")}
                className={`px-4 sm:px-6 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "voice_over"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Voice Over</span>
                {storyboard.voice_over && (
                  <span className="bg-zinc-850 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded font-bold leading-none hidden sm:inline">
                    {getWordCount(storyboard.voice_over)} Kata
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[11px] text-zinc-500 hidden xl:inline">Video Generator: Omni Flash 10s</span>
              <button
                onClick={handleCopy}
                className="bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-300 px-4 py-2.5 border border-indigo-500/25 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 w-full sm:w-auto justify-center active:scale-98"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Berhasil Disalin!" : "Salin JSON Prompt"}</span>
              </button>
            </div>
          </div>

          {/* Error Message banner if occurred */}
          {errorMsg && (
            <div className="bg-rose-950/25 border border-rose-500/20 rounded-2xl p-4 flex gap-3 mb-6 select-none animate-fade-in">
              <span className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                ⚠️
              </span>
              <div>
                <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wide">Terjadi Kesalahan Pembuatan</h5>
                <p className="text-xs text-rose-400/90 leading-relaxed mt-0.5">{errorMsg}</p>
                <p className="text-[10px] text-rose-500/80 mt-1.5">Pastikan API Key sudah dimasukkan dengan benar pada kolom atas atau hubungi Administrator.</p>
              </div>
            </div>
          )}

          {/* Loading Progress State */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-zinc-900/15 border border-zinc-900 rounded-2xl relative select-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03),transparent)] pointer-events-none" />
              
              <div className="relative flex items-center justify-center mb-6">
                {/* Visual loading ring */}
                <div className="w-16 h-16 border-4 border-indigo-650/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
              </div>

              <span className="text-xs font-bold uppercase text-indigo-400 tracking-widest block mb-2">OmniFlash AI Architect</span>
              <h4 className="text-base font-semibold text-zinc-100 text-center max-w-sm mt-1 animate-pulse">
                {progressMsg}
              </h4>
              <p className="text-xs text-zinc-500 text-center max-w-xs mt-3 leading-relaxed">
                Proses penyusunan storyboard premium biasanya memerlukan waktu sekitar 10 - 20 detik.
              </p>
            </div>
          ) : (
            <div id="tab-viewport-contents" className="flex-1 flex flex-col overflow-y-auto">
              
              {/* TAB 1: VISUAL STORYBOARD TIMELINE COMPONENT */}
              {activeTab === "visual" && (
                <div className="space-y-6">
                  
                  {/* Senior Workflow Guide Banner with 4 Senior Roles representation */}
                  <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/20 to-zinc-900 border border-indigo-500/15 p-6 rounded-2xl flex flex-col gap-5 select-none animate-fade-in shadow-indigo-950/40 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest leading-none">
                            🎬 TIM KREATIF SENIOR ONLINE
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-1 leading-none font-medium">
                            4 Peran Elit Berkolaborasi Untuk Menghasilkan Konsep & Storyboard Terbaik
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-mono font-bold uppercase tracking-widest animate-pulse leading-none">
                        🔴 READY TO DEPLOY
                      </span>
                    </div>

                    {/* Elite Crew Roles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60 hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-4 h-4 text-indigo-400" />
                          <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Prompt Engineer</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          Mengoptimalkan model **Imagen 3 & Omni Flash** lewat preset visual premium, lensed frames, dan pencegahan kecacatan visual (UHD UGC references).
                        </p>
                      </div>

                      <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60 hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-4 h-4 text-amber-500" />
                          <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Senior Marketer</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          Membuat struktur hook adegan 0-2 detik pertama yang mengikat penonton, tonjolan USP yang tajam di tengah, dan CTA pembunuhan kompetitor.
                        </p>
                      </div>

                      <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60 hover:border-sky-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-sky-400" />
                          <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Senior Copywriter</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          Merangkai naskah Voice Over (VO) bahasa Indonesia komersial yang persuasif, keras-gencar (hard selling), mengalir alami, & presisi kata.
                        </p>
                      </div>

                      <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60 hover:border-rose-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="w-4 h-4 text-rose-400" />
                          <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Senior Sutradara</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          Mengatur koreografi pergerakan kamera (dolly zoom, camera jitter), pencahayaan realistis, dan detail aksi subjek agar selaras.
                        </p>
                      </div>
                    </div>

                    {/* Operational Instruction Row */}
                    <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900 text-xs text-zinc-400 leading-normal flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        💡 <strong className="text-zinc-200">Tips Workflow:</strong> Klik tombol <strong className="text-indigo-400">"Hasilkan Gambar"</strong> di tiap adegan untuk merender initial visual frame menggunakan Imagen 3, lalu gabungkan dengan template JSON di tab sebelah untuk input video generator Anda!
                      </div>
                    </div>
                  </div>

                  {/* Top Header Card detailing overall Commercial Guidelines */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl select-none">
                    <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">Gaya Kamera / Look</span>
                      <p className="text-xs text-indigo-300 font-medium leading-relaxed font-mono">
                        {storyboard.camera_style}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">Pergerakan Utama</span>
                      <p className="text-xs text-indigo-300 font-medium leading-relaxed font-mono">
                        {storyboard.movement}
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">Pencahayaan Studio</span>
                      <p className="text-xs text-indigo-300 font-medium leading-relaxed font-mono">
                        {storyboard.lighting}
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">Latar Belakang / Background</span>
                      <p className="text-xs text-indigo-300 font-medium leading-relaxed font-mono">
                        {storyboard.background}
                      </p>
                    </div>
                  </div>

                  {/* 5-Scene visual horizontal cards flow */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                        <span>Alur Adegan Video (10 Detik)</span>
                      </h4>
                      <span className="text-[10px] text-zinc-500 select-none">Total: 5 Scenes</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {storyboard.scenes?.map((scene: StoryboardScene, idx: number) => (
                        <div
                          key={idx}
                          className="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row gap-5 transition-all group relative overflow-hidden"
                        >
                          {/* Left index box & timing metrics */}
                          <div className="md:w-36 shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-3 select-none">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold font-mono text-indigo-400 shadow-sm">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Adegan</span>
                                <span className="text-xs font-bold text-zinc-300">Frame {idx + 1}</span>
                              </div>
                            </div>

                            <div className="flex md:flex-col gap-1.5 justify-start">
                              <span className="bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-lg text-[10px] font-bold text-zinc-400 flex items-center gap-1 font-mono leading-none">
                                <Clock className="w-3 h-3 text-indigo-400" />
                                {scene.time}
                              </span>
                              <span className="bg-indigo-950/35 border border-indigo-900/55 px-2.5 py-1 rounded-lg text-[10px] font-bold text-indigo-400 flex items-center gap-1 leading-none font-mono">
                                <Layers className="w-3 h-3 text-indigo-400" />
                                {scene.shot}
                              </span>
                            </div>
                          </div>

                          {/* Right descriptions & motion actions */}
                          <div className="flex-1 flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest block leading-none select-none">Deskripsi Visual Omni Flash</span>
                              <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-1">
                                {scene.description}
                              </p>
                            </div>

                            {/* Detailed Image Gen Prompt Section for reference-first image-to-video workflow */}
                            <div className="bg-indigo-950/20 border border-indigo-950 p-3.5 rounded-xl flex flex-col gap-2 relative group/prompt">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-widest block leading-none select-none">
                                  📸 PROMPT GENERATE GAMBAR (REFERENSI IMAGE-TO-VIDEO)
                                </span>
                                <button
                                  onClick={() => handleCopyText(scene.image_prompt || "", idx)}
                                  className="text-[10px] font-bold text-indigo-400 hover:text-white bg-indigo-950/60 hover:bg-indigo-950/90 border border-indigo-900/50 rounded px-2 py-1 transition-all flex items-center gap-1 active:scale-95"
                                  title="Salin prompt gambar untuk adegan ini"
                                >
                                  {copiedSceneIndex === idx ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400 animate-bounce" />
                                      <span>Tersalin!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-indigo-400" />
                                      <span>Salin Prompt</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs text-indigo-300/90 leading-relaxed font-mono select-all">
                                {scene.image_prompt || "Sistem sedang mengumpulkan prompt gambar referensi..."}
                              </p>
                            </div>

                            {/* Render generated image if exists or we are currently generating */}
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              {/* The Action Button column */}
                              <div className="md:col-span-1 flex flex-col gap-2">
                                <button
                                  type="button"
                                  onClick={() => generateSceneImage(scene.image_prompt || "", idx)}
                                  disabled={generatingImages[idx] || !scene.image_prompt}
                                  className={`px-3 py-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none cursor-pointer active:scale-95 ${
                                    generatingImages[idx]
                                      ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
                                      : "bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/20 hover:border-indigo-500 text-indigo-400 font-bold"
                                  }`}
                                >
                                  <Camera className={`w-5 h-5 ${generatingImages[idx] ? "animate-spin text-indigo-400" : "text-indigo-400"}`} />
                                  <span className="text-[10px] uppercase tracking-wider block font-bold leading-tight">
                                    {generatingImages[idx] ? "Membuat..." : "Hasilkan Gambar"}
                                  </span>
                                  <span className="text-[8px] text-zinc-500 leading-none block font-semibold">Imagen 3 Renderer</span>
                                </button>
                              </div>

                              {/* Preview column */}
                              <div className="md:col-span-3 border border-zinc-850 bg-zinc-950/20 p-2.5 rounded-xl flex items-center justify-center min-h-[110px] relative overflow-hidden group">
                                {generatingImages[idx] ? (
                                  <div className="flex flex-col items-center justify-center gap-2 text-center p-3">
                                    <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono animate-pulse">Menghubungkan ke Imagen 3...</span>
                                  </div>
                                ) : imageErrors[idx] ? (
                                  <div className="text-center p-4">
                                    <p className="text-[10px] text-rose-400 font-mono">
                                      ⚠️ {imageErrors[idx]}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => generateSceneImage(scene.image_prompt || "", idx)}
                                      className="mt-2 text-[9px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded font-bold uppercase tracking-wider"
                                    >
                                      Coba Lagi
                                    </button>
                                  </div>
                                ) : generatedImages[idx] ? (
                                  <div className="w-full relative flex flex-col sm:flex-row items-center gap-4">
                                    <img
                                      src={generatedImages[idx]}
                                      alt={`Generated Frame Ref ${idx + 1}`}
                                      className="w-20 h-32 object-cover rounded-lg border border-indigo-500/30 shadow-indigo-950/40 shadow-lg shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex-1 text-left space-y-1.5 py-1">
                                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Gambar Referensi Berhasil Dibuat! 🎉</span>
                                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                                        Unduh gambar portrait 9:16 ini untuk dijadikan framework visual pertama Anda pada generator video (such as Omni Flash/Luma/Runway) bersama JSON skrip di samping.
                                      </p>
                                      <div className="flex items-center gap-2 pt-1">
                                        <a
                                          href={generatedImages[idx]}
                                          download={`omni_flash_scene_${idx + 1}.jpeg`}
                                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-[9px] text-white rounded font-bold transition-all uppercase tracking-wider"
                                        >
                                          Unduh Gambar
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center p-4 select-none">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block leading-none">Gambar Referensi Belum Dibuat</span>
                                    <p className="text-[9px] text-zinc-600 font-sans mt-1 leading-normal max-w-md">
                                      Ini adalah workflow opsional (Metode B). Render visualisasi framing visual pertama menggunakan model image generator Imagen 3.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-zinc-950/40 border border-zinc-900 p-2.5 rounded-xl flex items-center gap-4">
                              <div className="flex items-center gap-2 shrink-0 select-none">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest block">Gerakan Kamera:</span>
                              </div>
                              <span className="text-xs font-semibold text-emerald-400 font-mono">
                                "{scene.camera_motion}"
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Negative prompt output display at the bottom */}
                  <div className="bg-zinc-900/15 border border-zinc-900/70 p-4 rounded-xl flex gap-3 select-none">
                    <HelpCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest block">Negative Prompt Configured</span>
                      <p className="text-xs text-zinc-400 leading-relaxed font-mono mt-1">
                        {storyboard.negative_prompt}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: JSON PROMPT EDITOR & PREVIEW SCREEN */}
              {activeTab === "json" && (
                <div className="flex-1 flex flex-col gap-4 min-h-[450px]">
                  <div className="flex items-center justify-between select-none">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <CodeIcon className="w-4 h-4 text-emerald-400" /> Omni Flash JSON Response Schema
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 py-1 px-2 hover:bg-indigo-950/30 rounded-lg transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? "Berhasil disalin!" : "Salin Cepat"}</span>
                    </button>
                  </div>

                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-indigo-300 overflow-auto max-h-[600px] relative">
                    <pre className="whitespace-pre-wrap break-words leading-relaxed select-text">
                      {JSON.stringify(storyboard, null, 2)}
                    </pre>
                  </div>

                  <p className="text-[10px] text-zinc-500 leading-relaxed font-mono select-none">
                    * Format JSON di atas valid dan terstruktur, siap digunakan sebagai payload input langsung ke video generator Google Omni Flash API.
                  </p>
                </div>
              )}

              {/* TAB 3: VOICE OVER METRIC ANALYSIS */}
              {activeTab === "voice_over" && (
                <div className="space-y-6">
                  
                  {/* VO Showcase Card */}
                  <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-3 select-none">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-indigo-400" />
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Naskah Voice Over (Bahasa Indonesia)</span>
                      </div>
                      <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider font-mono">Hard Selling</span>
                    </div>

                    <blockquote className="text-base sm:text-lg text-white font-medium text-center py-6 leading-relaxed px-4 select-text">
                      "{storyboard.voice_over}"
                    </blockquote>

                    {/* Word-count meter indicator */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-900 pt-4 select-none">
                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Jumlah Kata Berhasil</span>
                        <p className="text-xl font-extrabold text-white font-mono mt-1">
                          {getWordCount(storyboard.voice_over)} <span className="text-xs font-normal text-zinc-400">Kata</span>
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Target Batas Kata</span>
                        <p className="text-xl font-extrabold text-indigo-400 font-mono mt-1">
                          24-25 <span className="text-xs font-normal text-zinc-400">Kata</span>
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Kualitas Status</span>
                        <p className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                          LULUS <span className="text-xs font-normal text-zinc-400">Check</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Indonesian Voice Over Writing Guide */}
                  <div className="bg-indigo-950/10 border border-indigo-500/10 p-5 rounded-2xl select-none">
                    <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">Pedoman Iklan Fashion UGC Profesional:</h5>
                    <ul className="space-y-3.5 text-xs text-indigo-300 leading-relaxed font-sans">
                      <li className="flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></span>
                        <span><strong>Hard-selling Tanpa Text Overlay:</strong> Iklan visual premium Omni Flash mengutamakan kenyamanan pengguna tanpa teks yang menutupi wajah karakter atau bahan baju agar look tetap mewah.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></span>
                        <span><strong>Aturan 24-25 Kata:</strong> Batas ini sangat ideal untuk video iklan pendek 10 detik agar tempo pelafalan narasi terdengar profesional, tidak terlalu tergesa-gesa namun sarat unsur urgensi checkout barang.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></span>
                        <span><strong>Diksi Urgensi:</strong> Menggunakan jargon-jargon modern premium (seperti <i>retro vibes</i>, <i>loose fit</i>, <i>unisex</i>, <i>wajib punya</i>, <i>checkout sekarang</i>).</span>
                      </li>
                    </ul>
                  </div>

                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* LIGHTWEIGHT HISTORY MODAL/SIDEBAR */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Riwayat Storyboard Generated</h3>
                  <p className="text-xs text-zinc-400 leading-none mt-1">Disimpan otomatis di Web storage lokal browser Anda.</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm bg-zinc-800 hover:bg-zinc-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <History className="w-6 h-6 text-zinc-500" />
                  </div>
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Belum ada Riwayat Pembuatan</h5>
                  <p className="text-xs text-zinc-650 mt-1 max-w-xs mx-auto leading-relaxed">
                    Setiap kali Anda menekan tombol "Buat Storyboard & Prompt!", hasilnya akan dicatat di panel ini.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="p-4 bg-zinc-950/60 hover:bg-zinc-850 border border-zinc-800 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all flex justify-between items-center group gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold font-mono text-zinc-500 leading-none">{item.createdAt}</span>
                        <span className="bg-indigo-950/40 text-indigo-400 text-[9px] px-1.5 py-0.5 rounded font-mono leading-none border border-indigo-900/45 uppercase">Omni Flash</span>
                      </div>
                      <h4 className="text-sm font-semibold text-zinc-100 truncate">{item.productName}</h4>
                      
                      {/* Attached visual indicators log */}
                      <div className="flex gap-2.5 mt-2">
                        {item.characterImageName && (
                          <span className="text-[9px] font-bold tracking-wide text-indigo-400 bg-indigo-950/20 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            👤 Wajah Karakter
                          </span>
                        )}
                        {item.productImageName && (
                          <span className="text-[9px] font-bold tracking-wide text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            🛍️ Foto Produk
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Pakai Ulang →</span>
                      <button
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all"
                        title="Hapus riwayat ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-zinc-800 hover:bg-zinc-700 py-2 px-5 rounded-xl text-xs font-semibold text-zinc-300"
              >
                Tutup Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Icon fallbacks inside code
function CodeIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
