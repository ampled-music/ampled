export interface ArtistModel {
  slug: string;
  name: string;
  id: number;
  accent_color: string;
  video_url: string;
  location: string;
  bio: string;
  twitter_handle: string;
  instagram_handle: string;
  isStripeSetup: boolean;
  posts: [];
  images: [];
  owners: OwnersProps[];
  supporters: SupportersProps[];
  most_recent_supporter: SupportersProps;
}

interface OwnersProps {
  id: string;
  name: string;
  profile_image_url: string;
}
interface SupportersProps {
  id: string;
  name: string;
  profile_image_url: string;
}

export const initialState = {
  loading: false,
  error: undefined,
  artist: {} as ArtistModel,
};
