import { apiAxios } from '../setup-axios';

export const addComment = async (comment) => {
  const { data } = await apiAxios({
    method: 'post',
    url: '/comments.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { post_id: comment.postId, text: comment.text },
  });

  return { data };
};
