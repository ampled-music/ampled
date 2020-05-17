import { createActionThunk } from 'redux-thunk-actions';
import { updateMe } from '../../api/me/update-me';

import { uploadFileToCloudinary } from '../../api/cloudinary/upload-image';
import { actions } from './actions';
import { Reducer } from './initial-state';

export const updateMeAction = createActionThunk(
  actions.updateMe,
  async (updatedMe) => {
    if (updatedMe.file) {
      const cloudinaryResponse = await uploadFileToCloudinary(updatedMe.file);

      if (!cloudinaryResponse) {
        // TODO: handle error when cloudinary request errors once we can pass along error messages
        return () => undefined;
      }
      return updateMe({ image: { url: cloudinaryResponse.secure_url, public_id: cloudinaryResponse.public_id }});
    }

    return updateMe({
      name: updatedMe.name,
      last_name: updatedMe.last_name,
      email: updatedMe.email,
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
      ship_zip: updatedMe.ship_zip,
    });
  },
);

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
