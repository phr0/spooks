import { UserData } from "./dataTypes";

const localStorageKey = "userData";

const initialUserData: UserData = {
  savedBooks:{}
};

export function getUserData(): Promise<UserData> {
  return new Promise(resolve => {
    const userData: UserData = {
      ...initialUserData,
      ...(localStorage[localStorageKey]
        ? JSON.parse(localStorage[localStorageKey])
        : {})
    };
    setTimeout(() => resolve(userData), 500);
  });
}

export function setUserData(userData: UserData): Promise<UserData> {
  return new Promise(resolve => {
    setTimeout(() => {
      localStorage[localStorageKey] = JSON.stringify(userData);
    }, 500);
  });
}