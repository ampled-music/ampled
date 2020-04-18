import { apiAxios } from '../setup-axios';

interface Post {
  title: string;
  body: string;
  audio_file: string;
  image_url: string;
  video_embed_url: string;
  artist_page_id: string;
  is_private: boolean;
  allow_download: boolean;
}

export const createPost = async (post: Post) => {
  const {
    title,
    body,
    audio_file,
    image_url,
    video_embed_url,
    artist_page_id,
    is_private,
    allow_download,
  } = post;

  const { data } = await apiAxios({
    method: 'post',
    url: `/artist_pages/${artist_page_id}/posts.json`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      post: {
        title,
        body,
        audio_file,
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
