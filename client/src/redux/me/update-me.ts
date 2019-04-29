import { createActionThunk } from 'redux-thunk-actions';
import { signinFile } from 'src/api/signin-file';
import { uploadFile } from 'src/api/upload-file';

import { actions } from './actions';
import { Reducer } from './initial-state';

export const updateMeAction = createActionThunk(actions.updateMe, async (updatedMe) => {
  if (updatedMe.file) {
    return await uploadPhoto(updatedMe.file);
  }
});

const uploadPhoto = async (file) => {
  const fileUploadResponse = await signinFile(file.type);
  const putUrl = fileUploadResponse.signedUrl;
  const userPhotoUrl = await uploadFile(putUrl, file, fileUploadResponse.key);

  return userPhotoUrl;
};

export const updateMeReducer = {
  [updateMeAction.STARTED]: (state) => ({
    ...state,
    updating: true,
  }),
  [updateMeAction.SUCCEEDED]: (state) => ({
    ...state,
    updated: true,
  }),
  [updateMeAction.FAILED]: (state, { payload }) => ({
    ...state,
    updating: false,
    error: payload.image,
  }),
  [updateMeAction.ENDED]: (state) => ({
    ...state,
    updating: false,
    updated: false,
  }),
} as Reducer;
