import { apiAxios } from '../setup-axios';
import { Post } from './post';

export const editPost = async (post: Post) => {
  const { id } = post;

  const { data } = await apiAxios({
    method: 'put',
    url: `/posts/${id}.json`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      post: post,
    },
  });

  return { data };
};

// Sends a request to the backend to delete the given imageId from the given postId
export const removeImageFromPost = async (postId: number, imageId: number) => {
  const { data } = await apiAxios(
    {
      method: 'put',
      url: `/posts/${postId}.json`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        post: {
          images: [{id: imageId, _destroy: true}]
        }
      },
    }
  )

  return { data };
};
