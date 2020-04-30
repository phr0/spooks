import * as React from "react";
import { HomeOutlined, ScanOutlined, LoginOutlined } from "@ant-design/icons";
import {BottomNavigation, BottomNavigationLinkItem} from "mobile-react-components";
import { useHistory } from "react-router-dom";

export function MainBottomNavigation() {
  const history = useHistory();
  const createGotoPageHandler = (url:string)=>()=>history.push(url);
  
  return (
    <BottomNavigation
      navigationItems={[
        <BottomNavigationLinkItem
          title="Home"
          icon={<HomeOutlined />}
          onClick={createGotoPageHandler("/")}
        />,
        <BottomNavigationLinkItem
          title="Login"
          icon={<LoginOutlined />}
          onClick={createGotoPageHandler("/login")}
        />
      ]}
    ></BottomNavigation>
  );
}
