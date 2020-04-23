import { apiAxios } from '../setup-axios';

interface Post {
  id: number;
  title: string;
  body: string;
  audio_uploads: PostAudio[];
  image_url: string;
  video_embed_url: string;
  artist_page_id: string;
  is_private: boolean;
  allow_download: boolean;
}

interface PostAudio {
  id: number;
  public_id: string;
  _destroy: boolean;
}

export const editPost = async (post: Post) => {
  const {
    title,
    body,
    audio_uploads,
    image_url,
    video_embed_url,
    artist_page_id,
    is_private,
    allow_download,
    id,
  } = post;

  const { data } = await apiAxios({
    method: 'put',
    url: `/posts/${id}.json`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      post: {
        title,
        body,
        audio_uploads_attributes: audio_uploads,
        image_url,
        video_embed_url,
        artist_page_id,
        is_private,
        allow_download,
      },
    },
  });

  return { data };
};
