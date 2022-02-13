import React from 'react';
import { shallow } from 'enzyme';
import PostForm from '../PostForm';
import { initialState as artistInitialState } from '../../../../../redux/artists/initial-state';

describe('post form', () => {
  let discardChangesAction = jest.fn();
  let createPostAction = jest.fn();
  let editPostAction = jest.fn();
  let getArtistAction = jest.fn();
  let showToastAction = jest.fn();

  let props = {
    post : { 
      id: 1, 
      title: 'Title', 
      body: 'This is the body.', 
      video_embed_url: '', 
      is_private: false, 
      allow_download: false, 
      artist_page_id: 'artist',
      post_type: 'Text',
      audio_uploads: [],
      images: [],
    },
    isEdit: false,
    close: () => null,
    discardChanges: discardChangesAction,
    creatingPost: false,
    postCreated: false,
    createPost: createPostAction,
    editPost: editPostAction,
    getArtist: getArtistAction,
    showToast: showToastAction,
    ...artistInitialState
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('on submit', () => {
    describe('when saving post has not completed', () => {
      let wrapper = shallow(<PostForm {...props} />);

      beforeEach(() => { 
        wrapper.setState({ savingPost: true });
        wrapper.setProps({ creatingPost: true })
        wrapper.setProps({ postCreated: true })
      });

      it('should not call getArtist', () => {
        expect(getArtistAction.mock.calls.length).toBe(0);
      });

      it('should not call discardChanges', () => {
        expect(discardChangesAction.mock.calls.length).toBe(0);
      });
    });

    describe('when saving post has completed', () => {
      let wrapper = shallow(<PostForm {...props} />);

      beforeEach(() => { 
        wrapper.setState({ savingPost: true });
        wrapper.setProps({ creatingPost: true })
        wrapper.setProps({ postCreated: true })
        wrapper.setProps({ creatingPost: false })
        wrapper.setProps({ postCreated: false })
      });

      it('should call getArtist', () => {
        expect(getArtistAction.mock.calls.length).toBe(1);
      });

      it('should call discardChanges', () => {
        expect(discardChangesAction.mock.calls.length).toBe(1);
      });
    });
  });
});