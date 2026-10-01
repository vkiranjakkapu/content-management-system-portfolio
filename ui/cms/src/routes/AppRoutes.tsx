import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../layouts/ProtectedRoutes";
import PublicRoutes from "../layouts/PublicRoutes";
import Dashboard from "../pages/dashboard/Dashboard";
import LoginPage from "../pages/landing/LoginPage";
import { RoutePaths } from "./RoutePaths";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoutes />}>
                <Route path={RoutePaths.LOGIN} element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
                <Route path={RoutePaths.DASHBOARD} element={<Dashboard />} />
            </Route>
        </Routes>
    );
}
