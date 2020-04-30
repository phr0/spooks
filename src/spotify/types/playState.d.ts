interface Context {
  uri?: any;
}

interface LinkedFrom {
  uri?: any;
  id?: any;
}

interface Artist {
  name: string;
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Album {
  uri: string;
  name: string;
  images: Image[];
}

interface CurrentTrack {
  id: string;
  uri: string;
  type: string;
  linked_from_uri?: any;
  linked_from: LinkedFrom;
  media_type: string;
  name: string;
  duration_ms: number;
  artists: Artist[];
  album: Album;
  is_playable: boolean;
}

interface TrackWindow {
  current_track: CurrentTrack;
  next_tracks: any[];
  previous_tracks: any[];
}

interface Restrictions {
  disallow_resuming_reasons: string[];
  disallow_skipping_prev_reasons: string[];
}

interface Disallows {
  resuming: boolean;
  skipping_prev: boolean;
}

export interface PlayState {
  context: Context;
  bitrate: number;
  position: number;
  duration: number;
  paused: boolean;
  shuffle: boolean;
  repeat_mode: number;
  track_window: TrackWindow;
  timestamp: number;
  restrictions: Restrictions;
  disallows: Disallows;
}