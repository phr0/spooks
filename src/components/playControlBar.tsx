import * as React from "react";
import { HomeOutlined, ScanOutlined, LoginOutlined, PauseCircleOutlined, PlayCircleOutlined, VerticalRightOutlined, PauseOutlined } from "@ant-design/icons";
import {BottomNavigation, BottomNavigationLinkItem} from "mobile-react-components";

interface PlayControlBarProps {
  onTriggerFromBeginning: ()=>void;
  onTriggerStart: ()=>void;
  onTriggerStop: ()=>void;
}

export function PlayControlBar(props:PlayControlBarProps) {
  return (
    <>
    <BottomNavigation
      navigationItems={[
        <BottomNavigationLinkItem
        title="From beginning"
        icon={<VerticalRightOutlined />}
        onClick={props.onTriggerFromBeginning}
      />,
      <BottomNavigationLinkItem
        title="Play"
        icon={<PlayCircleOutlined />}
        onClick={props.onTriggerStart}
      />,
        <BottomNavigationLinkItem
          title="Pause"
          icon={<PauseOutlined />}
          onClick={props.onTriggerStop}
        />
      ]}
    ></BottomNavigation></>
  );
}
