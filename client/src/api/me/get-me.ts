import * as store from 'store';
// import axios from 'axios';

export const getMeData = async () => {
  // const { data } = await axios({
  //   method: 'get',
  //   url: '/me',
  // });

  return !!store.get('token')
    ? {
        id: 45,
        artistPages: [{ artistId: 8, role: 'owner' }, { artistId: 10, role: 'supporter' }],
      }
    : undefined;
};
