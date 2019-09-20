import { createActionThunk } from 'redux-thunk-actions';
import { updateMe } from 'src/api/me/update-me';

import { uploadFileToCloudinary } from 'src/api/cloudinary/upload-image';
import { actions } from './actions';
import { Reducer } from './initial-state';

export const updateMeAction = createActionThunk(actions.updateMe, async (updatedMe) => {

  if (updatedMe.file) {
    const fileInfo = await uploadFileToCloudinary(updatedMe.file);
    return updateMe({ profile_image_url: fileInfo.secure_url });
  }

  return updateMe({
    name: updatedMe.name,
    last_name: updatedMe.last_name,
    city: updatedMe.city,
    country: updatedMe.country,
    twitter: updatedMe.twitter,
    instagram: updatedMe.instagram,
    bio: updatedMe.bio,
    ship_address: updatedMe.ship_address,
    ship_address2: updatedMe.ship_address2,
    ship_city: updatedMe.ship_city,
    ship_state: updatedMe.ship_state,
    ship_country: updatedMe.ship_country,
    ship_zip: updatedMe.ship_zip
  });


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
