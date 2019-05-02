import { createActionThunk } from 'redux-thunk-actions';
import { updateMe } from 'src/api/me/update-me';

import { uploadFileToCloudinary } from 'src/api/cloudinary/upload-image';
import { actions } from './actions';
import { Reducer } from './initial-state';

export const updateMeAction = createActionThunk(actions.updateMe, async (updatedMe) => {
  if (!updatedMe.file) {
    return;
  }

  const fileInfo = await uploadFileToCloudinary(updatedMe.file);

  return updateMe({ profile_image_url: fileInfo.secure_url });
});

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
