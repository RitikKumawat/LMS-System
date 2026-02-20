import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
    return (
        <ModalsProvider>
            <Notifications position="top-right" />
            <Outlet />
        </ModalsProvider>
    );
};

export default RootLayout;
