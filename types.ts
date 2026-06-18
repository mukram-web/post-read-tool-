export interface SessionMeta {
  title: string;
  brand: string;
}

export interface SessionData {
  transcript: string;
  resources: string;
  images: string;
  logo: string;
  meta: SessionMeta;
}

export interface GenerationStatus {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export type ImageSize = '1K' | '2K' | '4K';
