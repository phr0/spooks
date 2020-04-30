import * as React from "react";
import { UserProfile } from "./types/userProfile";
import { Album, CurrentlyPlayingInfo } from "./types/general";
import { useAuthentication } from "../auth/authContext";

export function useSpotify() {
  const {accessToken, renewToken} = useAuthentication();

  function api(endpoint: string, init?: RequestInit): Promise<any> {
    function call(bearerToken: string, retry: boolean): Promise<any> {
      return fetch(`https://api.spotify.com${endpoint}`, {
        ...init,
        headers: { Authorization: "Bearer " + bearerToken },
      }).then((response) => {
        if (response.status === 401 && renewToken) {
          return renewToken().then((newToken) => call(newToken, false));
        }
        return response;
      });
    }

    return call(accessToken, true);
  }

  function me(): Promise<UserProfile> {
    return api("/v1/me").then((x) => x.json());
  }

  function play(
    playerId: string,
    uris: string[],
    options?: { position_ms: number }
  ) {
    return api(`/v1/me/player/play?device_id=${playerId}`, {
      method: "PUT",
      body: JSON.stringify({ uris, ...options }),
    });
  }

  function album(albumId: string) {
    return api(`/v1/albums/${albumId}`).then((x) => x.json() as Album);
  }

  function currentlyPlaying():Promise<CurrentlyPlayingInfo|null> {
    return api("/v1/me/player/currently-playing")
    .then(response=>{
      if(response.status===204) return null;
      else return response.json();
    });
  }

  function pause() {
    return api("/v1/me/player/pause", {
      method: "PUT",
    });
  }


  return {
    api,
    me,
    play,
    pause,
    currentlyPlaying,
    album,
  };
}
