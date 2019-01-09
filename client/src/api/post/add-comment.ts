import axios from 'axios';

export const addComment = async (comment) => {
  const { data } = await axios({
    method: 'post',
    url: '/comments.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { post_id: comment.postId, text: comment.text },
  });

  return { data };
};
