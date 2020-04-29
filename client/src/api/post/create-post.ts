import { apiAxios } from '../setup-axios';
import { Post } from './post';

export const createPost = async (post: Post) => {
  const { artist_page_id } = post;

  const { data } = await apiAxios({
    method: 'post',
    url: `/artist_pages/${artist_page_id}/posts.json`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      post: post
    },
  });

  return { data };
};
