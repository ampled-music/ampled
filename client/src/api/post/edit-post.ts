import { apiAxios } from '../setup-axios';

interface Post {
  id: number;
  title: string;
  body: string;
  audio_file: string;
  image_url: string;
  artist_page_id: string;
  is_private: boolean;
}

export const editPost = async (post: Post) => {
  const {
    title,
    body,
    audio_file,
    image_url,
    artist_page_id,
    is_private,
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
        audio_file,
        image_url,
        artist_page_id,
        is_private,
      },
    },
  });

  return { data };
};
