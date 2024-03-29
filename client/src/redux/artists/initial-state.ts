import { Image } from '../../api/image/image';

export interface ArtistModel {
  slug: string;
  name: string;
  id: number;
  accent_color: string;
  video_url: string;
  video_screenshot_url: string;
  location: string;
  bio: string;
  twitter_handle: string;
  instagram_handle: string;
  bandcamp_handle: string;
  youtube_handle: string;
  external: string;
  isStripeSetup: boolean;
  posts: [];
  images: [Image];
  owners: OwnersProps[];
  supporters: SupportersProps[];
  most_recent_supporter: SupportersProps;
  approved: boolean;
  hide_members: boolean;
  style_type: string;
}

interface OwnersProps {
  id: string;
  name: string;
  image: Image;
}
interface SupportersProps {
  id: string;
  name: string;
  image: Image;
}

export const initialState = {
  loading: false,
  error: undefined,
  artist: {} as ArtistModel,
};
