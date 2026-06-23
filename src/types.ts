export interface StoryboardScene {
  time: string;
  shot: string;
  description: string;
  camera_motion: string;
  image_prompt: string;
}

export interface StoryboardResponse {
  camera_style: string;
  movement: string;
  lighting: string;
  background: string;
  voice_over: string;
  scenes: StoryboardScene[];
  negative_prompt: string;
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  productName: string;
  productImageName?: string;
  characterImageName?: string;
  promptText?: string;
  data: StoryboardResponse;
}
