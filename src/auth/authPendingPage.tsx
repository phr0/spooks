import * as React from "react";
import { Result } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { MobileLayout } from "mobile-react-components";

export function AuthPendingPage() {
    return <MobileLayout mainStyle={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <Result icon={<LoadingOutlined spin/>} title="authenticating..." />
    </MobileLayout>
}