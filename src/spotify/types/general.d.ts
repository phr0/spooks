declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

type SpotifyPlayerCallback<T> = (obj: T) => void;
interface SpotifyPlayer {
  addListener: (
    eventName: string,
    callBack: SpotifyPlayerCallback<any>
  ) => void;
  connect: () => void;
  _options: { id: string };
}

export interface UserProfile {
  country: string;
  display_name: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href?: any;
    total: number;
  };
  href: string;
  id: string;
  images: {
    height?: any;
    url: string;
    width?: any;
  }[];
  product: string;
  type: string;
  uri: string;
}

interface Album {
  name: string;
  id: string;
  tracks: {
    items: { name: string; duration_ms: number; uri: string; id: string }[];
  };
}

interface PlayState {
  paused: true;
  track_window: {
    current_track: { id: string; duration_ms: number };
  };
  position: number;
}

interface CurrentlyPlayingInfo {
  item: {
    id: string;
  };
  progress_ms: number;
}
