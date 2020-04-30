import { AudioBook, AudioBookPart, UserData } from "./dataTypes";


export type UserDataAction = SetAction | AddAudioBookToCollection | SetDurationMarker;

export type SetAction = {
  type: "set";
  userData: UserData;
};

export type AddAudioBookToCollection = {
  type: "addAudioBook";
  audioBook: AudioBook;
};

export type SetDurationMarker = {
  type: "setDurationMarker";
  audioBookId: string;
  audioBookPartId: string;
  durationMarker: number;
};
