interface Hash<T> {
  [id: string]: T;
}

export interface UserData {
  savedBooks: Hash<AudioBook>;
}

export interface AudioBook {
  title: string;
  parts: AudioBookPart[];
  finished: boolean;
  id: string;
}

export interface AudioBookPart {
  durationMarker: number;
  length: number;
  finished: boolean;
  containingAudioBookId: string;
  title: string;
  id:string;
  trackNumber:number;
}
