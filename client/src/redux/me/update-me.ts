import { createActionThunk } from 'redux-thunk-actions';
import { updateMe } from 'src/api/me/update-me';
import { signinFile } from 'src/api/signin-file';
import { uploadFile } from 'src/api/upload-file';

import { actions } from './actions';
import { Reducer } from './initial-state';

export const updateMeAction = createActionThunk(actions.updateMe, async (updatedMe) => {
  if (!updatedMe.file) {
    return;
  }

  const profile_image_url = await uploadPhoto(updatedMe.file);

  return updateMe({ profile_image_url });
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
  [updateMeAction.SUCCEEDED]: (state, { payload }) => ({
    ...state,
    updated: true,
    updatedData: payload,
  }),
  [updateMeAction.FAILED]: (state, { payload }) => ({
    ...state,
    updating: false,
    error: payload,
  }),
  [updateMeAction.ENDED]: (state) => ({
    ...state,
    updating: false,
    updated: false,
    updatedData: undefined,
  }),
} as Reducer;
