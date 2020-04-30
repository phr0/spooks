import React, { useState, useCallback, useEffect } from "react";

import { useAuthentication } from "../auth/authContext";
import { useSpotify } from "../spotify/useSpotify";
import { Avatar } from "antd";
import { UserProfile } from "../spotify/types/userProfile";

export const LoggedIn: React.FC = () => {
  const accessToken = useAuthentication();
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();

  const spotify = useSpotify();

  React.useEffect(() => {
    spotify?.me().then((userProfile) => {
      setUserProfile(userProfile);
    });
  }, []);

  return (
    <>
      <Avatar size={64} src={userProfile?.images[0].url} />
      <h2>Access Token </h2>
      <>
        <pre>{JSON.stringify(accessToken, null, 2)}</pre>

        <h2>User Info</h2>
        <pre>{JSON.stringify(userProfile, null, 2)}</pre>
      </>
    </>
  );
};
