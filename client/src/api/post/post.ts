// Represents a Post, in the shape expected by our API.
export interface Post {
  id: number;
  title: string;
  body: string;
  audio_file: string;
  // Although the backend API supports multiple images per Post, for now all code can
  // assume zero or at most 1 image per in this Array.
  images: [];
  video_embed_url: string;
  artist_page_id: string;
  is_private: boolean;
  allow_download: boolean;
}
