import { Navigate, Outlet } from "react-router-dom";
import useAuthContext, { AuthStatus } from "../context/useAuthContext";
import { RoutePaths } from "../routes/RoutePaths";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function ProtectedRoutes() {
    const { status, isLoggedIn } = useAuthContext();

    if (status === AuthStatus.INITIALIZING) {
        return;
    }

    if (!isLoggedIn) {
        return <Navigate to={RoutePaths.LOGIN} />;
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}
