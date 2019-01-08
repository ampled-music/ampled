import { apiAxios } from '../setup-axios';

interface Post {
  title: string;
  body: string;
  audioUrl: string;
  imageUrl: string;
  artist_page_id: string;
}

export const createPost = async (post: Post) => {
  const { title, body, audioUrl, imageUrl, artist_page_id } = post;

  const { data } = await apiAxios({
    method: 'post',
    url: '/admin/posts.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      post: {
        title,
        body,
        audioUrl,
        imageUrl,
        artist_page_id,
      },
    },
  });

  return { data };
};
