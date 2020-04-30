import { UserDataState } from "./userDataContext";
import { SetAction, AddAudioBookToCollection, SetDurationMarker } from "./actionTypes";
import { AudioBook } from "./dataTypes";

const stateMustBeDefinedError = new Error("State must be defined");

export const setUserDataState = (
  state: UserDataState | null,
  action: SetAction
): UserDataState => action.userData;


export function addAudioBookToCollection(
  state: UserDataState | null,
  action: AddAudioBookToCollection
) {
  if (!state) throw stateMustBeDefinedError;
  if (state.savedBooks[action.audioBook.id]) {
    return { ...state };
  }
  state.savedBooks[action.audioBook.id] = action.audioBook;
  return { ...state };
}

export function setDurationMarker(
  state: UserDataState | null,
  action: SetDurationMarker
) {
  if (!state) throw stateMustBeDefinedError;
  const audioBook = state.savedBooks[action.audioBookId];
  const audioBookPart = audioBook.parts.filter(
    (x) => x.id === action.audioBookPartId
  )[0];
  audioBookPart.durationMarker = action.durationMarker;
  if (action.durationMarker === audioBookPart.length) {
    audioBookPart.finished = true;

    const unfinishedParts = state.savedBooks[audioBookPart.containingAudioBookId].parts.filter(
      (x) => !x.finished
    );
    if (unfinishedParts.length === 0) {
      audioBook.finished = true;
    }
  }
  return { ...state };
}
