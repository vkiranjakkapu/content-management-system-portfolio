import { Outlet, useNavigate } from "react-router-dom";
import useAuthContext from "../context/useAuthContext";
import { RoutePaths } from "../routes/RoutePaths";

export default function PublicRoutes() {
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();

    if (isLoggedIn) {
        navigate(RoutePaths.DASHBOARD);
    }

    return <Outlet />;
}
