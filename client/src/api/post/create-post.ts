import { apiAxios } from '../setup-axios';

interface Post {
  title: string;
  body: string;
  audio_file: string;
  imageUrl: string;
  artist_page_id: string;
}

export const createPost = async (post: Post) => {
  const { title, body, audio_file, imageUrl, artist_page_id } = post;

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
        imageUrl,
        artist_page_id,
      },
    },
  });

  return { data };
};
