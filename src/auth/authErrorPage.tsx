import * as React from "react";
import { AuthError } from "./authContext";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";
import { MobileLayout } from "mobile-react-components";

export function AuthErrorPage({ error }: { error: AuthError }) {
  const history = useHistory();

  return (
    <MobileLayout
      mainStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Result
        status="error"
        title={error.errorCode}
        subTitle={error.errorMessage}
        extra={[
          <Button type="primary" onClick={() => window.location.reload()}>
            Erneut versuchen
          </Button>,
          <Button type="default" onClick={() => history.push("/")}>
            Zurück
          </Button>
        ]}
      />
    </MobileLayout>
  );
}
