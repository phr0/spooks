import * as React from "react";
import { SpotifyPlayer, PlayState } from "./types/general";
import { useAuthentication } from "../auth/authContext";
declare var Spotify: {
  Player: new (arg0: {
    name: string;
    getOAuthToken: (cb: any) => void;
  }) => SpotifyPlayer;
};

let spotifyPlaybackSdkReady = false;
window.onSpotifyWebPlaybackSDKReady = () => {
  console.info("Spotify Web Playback SDK is now ready");
  spotifyPlaybackSdkReady = true;
};

export function useSpotifyPlayer() {
  const {accessToken, renewToken} = useAuthentication();

  React.useEffect(() => {
    console.log("using spotify player");
  }, []);

  const [player, setPlayer] = React.useState<SpotifyPlayer | null>(null);

  const [playerId, setPlayerId] = React.useState<string | null>(null);

  const [playState, setPlayState] = React.useState<PlayState | undefined>();

  React.useEffect(() => {
    console.info("Trying to initialize Web Player...");

    if (!spotifyPlaybackSdkReady) {
      console.info("Spotify Web Playback SDK is not ready yet");
      return;
    }

    console.info("Initializing Web Player...");

    const player: SpotifyPlayer = new Spotify.Player({
      name: "Web Playback SDK Quick Start Player",
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
    });
    // Error handling
    player.addListener("initialization_error", (error) => {
      console.error("initialization_error", error, accessToken);
    });
    player.addListener("authentication_error", (error) => {
      console.error("authentication_error", error);
      renewToken();
    });
    player.addListener("account_error", (error) => {
      console.error("account_error", error);
    });
    player.addListener("playback_error", (error) => {
      console.error("playback_error", error);
    });

    // Playback status updates
    player.addListener("player_state_changed", setPlayState);

    // Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      setPlayerId(device_id);
      setPlayer(player);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Connect to the player!
    player.connect();
  }, [accessToken, spotifyPlaybackSdkReady]);

  if (!player) return null;

  console.log("playerid",player,player._options.id)

  return {
    deviceId: playerId,
    playState,
  };
}
