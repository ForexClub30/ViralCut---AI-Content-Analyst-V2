export interface AnalysisSettings {
  platform: 'TikTok' | 'Reels' | 'Shorts';
  clipLength: '15s' | '30s' | '60s';
  niche: string;
  language: string;
  sourceUrl?: string;
}

export interface ClipMetadata {
  clip_id: string;
  start_time: string;
  end_time: string;
  duration: string;
  viral_score: number;
  category: string[];
  reason: string;
  on_screen_hook: string;
  video_title: string;
  tags: string[];
  platform: string;
  recommended_aspect_ratio: string;
  monetization_risk: 'safe' | 'needs_censor' | 'not_recommended';
}

export interface AnalysisResult {
  clips: ClipMetadata[];
  summary: string;
}

export interface ChartDataPoint {
  time: string;
  score: number;
  category: string;
}