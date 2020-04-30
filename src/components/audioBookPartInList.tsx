import * as React from "react";
import { PlayCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { List } from "antd";

interface AudioBookPartInListProps {
  audioBookPart: {
    title: string;
    finished: boolean;
    durationMarker: number;
    trackNumber:number;
  };
}

export function AudioBookPartInList(props: AudioBookPartInListProps) {
  function Icon() {
    if (props.audioBookPart.finished) return <CheckCircleOutlined />;
    if (props.audioBookPart.durationMarker > 0) return <PlayCircleOutlined />;
    else return <></>;
  }

  return (
    <List.Item.Meta
  title={<><Icon /> Part {props.audioBookPart.trackNumber}</>}
        description={props.audioBookPart.title} />
  );
}
