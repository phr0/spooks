import * as React from "react";
import { MainBottomNavigation } from "../mainBottomNavigation";
import { LoggedIn } from "../loggedIn";
import { useSpotifyPlayer } from "../../spotify/useSpotifyPlayer";
import { useAuthentication } from "../../auth/authContext";
import { Button } from "antd";
import { useSpotify } from "../../spotify/useSpotify";
import { MobileLayout, MobileTitleHeader } from "mobile-react-components";

export function Home() {
  const spotifyPlayer = useSpotifyPlayer();
  const spotify = useSpotify();

  const play = () => {
    if (spotifyPlayer?.deviceId)
      spotify.play(spotifyPlayer.deviceId, [
        "spotify:album:3cy3PeRCJprC5fhwHRPDtE",
      ]);
  };

  return (
    <MobileLayout
      header={<MobileTitleHeader title="Spooks" />}
      footer={<MainBottomNavigation />}
    >
      <>
        <h3>Playinfo</h3>
        <pre>{JSON.stringify(spotifyPlayer?.playState, null, 2)}</pre>
        <Button
          type="primary"
          disabled={!spotifyPlayer?.deviceId}
          onClick={play}
        >
          Play
        </Button>
        <Button
          disabled={!spotifyPlayer?.deviceId}
          type="primary"
          onClick={spotify.pause}
        >
          Stop
        </Button>

        <LoggedIn />
      </>
    </MobileLayout>
  );
}
