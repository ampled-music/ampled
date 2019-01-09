import axios from 'axios';

export const deleteComment = async (commentId) => {
  await axios({
    method: 'delete',
    url: `/comments/${commentId}`,
  });
};
