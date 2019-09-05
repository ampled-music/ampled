import { apiAxios } from '../setup-axios';

export const deletePost = async (postId) => {
  await apiAxios({
    method: 'delete',
    url: `/posts/${postId}`,
  });
};
