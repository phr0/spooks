import { AuthFlow } from "./authContext";
import React, { useState } from "react";
import ClientOAuth2 from "client-oauth2";

(window as any).oauth2Callback = function (uri: string) {
  console.log("oauth stuff", uri);
};

function getTokenWithIframe(silentLoginUrl: string): Promise<string> {

  const iframe = document.createElement("iframe");

  return new Promise((resolve, reject) => {
    function onLoad(e: any) {
      try {
        debugger;
        const accessTokenRegex = /#access_token=([^&]*)&.*/i
        resolve(
          e.currentTarget.contentWindow.location.hash.replace(
            accessTokenRegex,
            "$1"
          )
        );

      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error("konnte iframe content nicht auslesen", silentLoginUrl);
        reject();
      } finally {
        iframe.remove();
      }
    }
    
    iframe.style.display = "none";
    document.getElementsByTagName("body")[0].appendChild(iframe);
    iframe.setAttribute("src", silentLoginUrl);
    iframe.onload = onLoad;
  });
}

export const createImplicitAuthFlow: (
  config: ClientOAuth2.Options,
  options?: { silentLoginUrl?: string }
) => AuthFlow = (config, options) => (
  accessToken: string | undefined,
  setAccessToken,
  setError
) => {
  var oauthClient = new ClientOAuth2(config);
  var silentOauthClient = new ClientOAuth2({
    ...config,
    redirectUri: options?.silentLoginUrl,
  });

  function acquireToken() {
    return getTokenWithIframe(silentOauthClient.token.getUri())
      .catch(() => {
        window.location.href = oauthClient.token.getUri();
        return "";
      })
      .then((x) => {
        setAccessToken(x);
        setError(undefined);
        return x;
      });
  }

  function onAuth(response: ClientOAuth2.Token) {
    setAccessToken(response.accessToken);
    setError(undefined);
    return response.accessToken;
  }

  React.useEffect(() => {
    (window as any).oauth2Callback = function (uri: string) {
      oauthClient.token.getToken(uri).then(onAuth);
    };

    if (accessToken) return;

    if (window.location.hash.startsWith("#access_token")) {
      oauthClient.token.getToken(window.location.hash).then(onAuth);
    } else {
      acquireToken();
    }
  }, []);

  return {
    renewToken: acquireToken,
  };
};
