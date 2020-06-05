import { Image } from '../image/image';

// Represents a Post, in the shape expected by our API.
export interface AudioUpload {
  id: number;
  public_id: number;
  waveform: number[];
  duration: number;
  name: string;
  _destroy: boolean;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  // Although the backend API supports multiple audio uploads per Post, for now all code can
  // assume zero or at most 1 image per in this Array.
  audio_uploads: AudioUpload[];
  // Although the backend API supports multiple images per Post, for now all code can
  // assume zero or at most 1 image per in this Array.
  images: Image[];
  video_embed_url: string;
  artist_page_id: string;
  is_private: boolean;
  allow_download: boolean;
}
