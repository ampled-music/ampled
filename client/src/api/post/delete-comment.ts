import { apiAxios } from '../setup-axios';

export const deleteComment = async (commentId) => {
  await apiAxios({
    method: 'delete',
    url: `/comments/${commentId}.json`,
  });
};
