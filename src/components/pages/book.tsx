import * as React from "react";
import { MainBottomNavigation } from "../mainBottomNavigation";
import { LoggedIn } from "../loggedIn";
import { useSpotifyPlayer } from "../../spotify/useSpotifyPlayer";
import { useAuthentication } from "../../auth/authContext";
import { Button, List } from "antd";
import { useSpotify } from "../../spotify/useSpotify";
import { MobileLayout, MobileTitleHeader } from "mobile-react-components";
import { useHistory, useParams } from "react-router-dom";
import { useAsyncData, IAsyncData } from "../../useAsyncData";
import { Album } from "../../spotify/types/general";
import { AudioBookPartInList } from "../audioBookPartInList";
import { AudioBook, AudioBookPart } from "../../userData/dataTypes";
import {
  useUserData,
  useUserDataDispatch,
} from "../../userData/userDataContext";
import { useInterval } from "../../useInterval";
import { PlayControlBar } from "../playControlBar";

function mapAlbumToAudioBook(album: Album): AudioBook {
  return {
    id: album.id,
    title: album.name,
    finished: false,
    parts: album.tracks.items.map((x,index) => ({
      containingAudioBookId: album.id,
      durationMarker: 0,
      finished: false,
      id: x.id,
      length: x.duration_ms,
      title: x.name,
      trackNumber: index+1
    })),
  };
}

function useBook(id: string): IAsyncData<AudioBook | undefined> {
  const accessToken = useAuthentication();
  const spotifyPlayer = useSpotifyPlayer();
  const spotify = useSpotify();
  const userData = useUserData();
  const dispatch = useUserDataDispatch();

  const fetchBook = React.useCallback(async () => {
    const bookInUserData = userData.savedBooks[id];
    if (bookInUserData) return Promise.resolve(bookInUserData);
    const album = await spotify.album(id);
    const audioBook = mapAlbumToAudioBook(album);
    dispatch({
      type: "addAudioBook",
      audioBook,
    });
    return audioBook;
  }, [id, userData]);

  return useAsyncData<AudioBook | undefined>(fetchBook, undefined);
}

export function Book() {
  const { bookId } = useParams();
  if (!bookId) throw new Error("Must provide bookId parameter");

  const bookData = useBook(bookId);
  const spotifyPlayer = useSpotifyPlayer();
  const spotify = useSpotify();
  const [selectedPartId, setSelectedPartId] = React.useState<
    string | undefined
  >();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const history = useHistory();
  const dispatch = useUserDataDispatch();
  const userData = useUserData();
  const audioPart: AudioBookPart | undefined = userData.savedBooks[
    bookId
  ]?.parts.filter((x) => x.id === selectedPartId)[0];
  const createGotoPageHandler = (url: string) => () => history.push(url);

  React.useEffect(() => {
    if (!spotifyPlayer?.deviceId) return;
    if (!selectedPartId) return;
    setIsPlaying(true);
  }, [selectedPartId, spotifyPlayer?.deviceId]);

  React.useEffect(() => {
    console.info("playstate changed", spotifyPlayer?.playState);
  }, [spotifyPlayer?.playState]);

  React.useEffect(() => {
    if (!selectedPartId) return;
    if (isPlaying) {
      if (!spotifyPlayer?.deviceId) return;
      spotify.play(
        spotifyPlayer?.deviceId,
        [`spotify:track:${selectedPartId}`],
        {
          position_ms: audioPart?.durationMarker,
        }
      );
    } else {
      spotify.pause();
    }
  }, [isPlaying,selectedPartId]);

  function updateProgress() {
    console.log("playstate", spotifyPlayer?.playState);
    if (!bookData.data?.id || !spotifyPlayer?.playState) return;

    // detect if finished
    const finished = spotifyPlayer?.playState?.position === 0 && spotifyPlayer?.playState?.paused;

    dispatch({
      type: "setDurationMarker",
      audioBookId: bookData.data?.id,
      audioBookPartId: spotifyPlayer?.playState?.track_window.current_track.id,
      durationMarker: finished ? spotifyPlayer?.playState?.track_window.current_track.duration_ms: spotifyPlayer?.playState?.position,
    });

    if(finished) {
      const prevPartIndex = bookData.data.parts.findIndex(x=>x.id===selectedPartId); 
      const nextPart = bookData.data.parts[prevPartIndex+1];
      if(nextPart)
        setSelectedPartId(nextPart.id);
    }
  }

  React.useEffect(updateProgress, [
    spotifyPlayer?.playState?.position,
    spotifyPlayer?.playState?.track_window.current_track.id,
  ]);

  // useInterval(()=>{
  //   spotify.currentlyPlaying().then(()=>{

  //   });
  // })

  function changeCurrentlyPlayingPart(newPart: AudioBookPart) {
    spotify
      .currentlyPlaying()
      .then((currentlyPlayingInfo) => {
        if (!currentlyPlayingInfo) return;
        if (!bookData.data?.id) return;
        console.log("SETTING DURATION",currentlyPlayingInfo.item,currentlyPlayingInfo.progress_ms);
        dispatch({
          type: "setDurationMarker",
          audioBookId: bookData.data?.id,
          audioBookPartId: currentlyPlayingInfo.item.id,
          durationMarker: currentlyPlayingInfo.progress_ms,
        });
      })
      .then(() => setSelectedPartId(newPart.id));
  }

  function triggerFromBeginning(){
    if (!bookData.data?.id) return;
    if (!audioPart) return;
    if(!spotifyPlayer) return;

    dispatch({
      type: "setDurationMarker",
      audioBookId: bookData.data?.id,
      audioBookPartId: audioPart.id,
      durationMarker: 0,
    });

    setIsPlaying(true);

    spotify.play(
      spotifyPlayer?.deviceId,
      [`spotify:track:${selectedPartId}`],
      {
        position_ms: 0,
      }
    );

  }

  return (
    <MobileLayout
      header={
        <MobileTitleHeader
          onBack={createGotoPageHandler("/")}
          title={bookData.data?.title}
        />
      }
      footer={
        selectedPartId ? (
          <>
            <PlayControlBar
              onTriggerFromBeginning={triggerFromBeginning}
              onTriggerStart={() => setIsPlaying(true)}
              onTriggerStop={() => setIsPlaying(false)}
            />
          </>
        ) : undefined
      }
    >
      <>
        <h3>Currently Playing</h3>
        <table>
          <tr>
            <th>Name</th>
            <td>{audioPart?.title}</td>
          </tr>
          <tr>
            <th>ID</th>
            <td>{audioPart?.id}</td>
          </tr>
          <tr>
            <th>Progress</th>
            <td>{audioPart?.durationMarker}</td>
          </tr>
        </table>
        <List
          dataSource={bookData?.data?.parts}
          loading={bookData.promiseState === "pending"}
          renderItem={(item,index) => (
            <List.Item
              key={item.id}
              onClick={() => changeCurrentlyPlayingPart(item)}
            >
              <AudioBookPartInList audioBookPart={item} />
            </List.Item>
          )}
        />

        <h3>Album</h3>
        <pre>{JSON.stringify(bookData?.data, null, 2)}</pre>
      </>
    </MobileLayout>
  );
}
