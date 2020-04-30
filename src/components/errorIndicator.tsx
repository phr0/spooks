import * as React from "react";
import { Alert } from "antd";

export function ErrorIndicator(props: { message?: string }): JSX.Element {
  return (
    <Alert
      message={props.message || "Ein Fehler ist aufgetreten"}
      type="error"
    />
  );
}