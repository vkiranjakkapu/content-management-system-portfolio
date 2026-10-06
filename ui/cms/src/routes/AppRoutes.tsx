import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../layouts/ProtectedRoutes";
import PublicRoutes from "../layouts/PublicRoutes";
import AboutPage from "../pages/about/AboutPage";
import AccountPage from "../pages/account/AccountPage";
import Dashboard from "../pages/dashboard/Dashboard";
import ExperiencePage from "../pages/experience/ExperiencePage";
import LoginPage from "../pages/landing/LoginPage";
import LibraryPage from "../pages/library/LibraryPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import PublicationsPage from "../pages/publications/PublicationsPage";
import SkillsPage from "../pages/skills/SkillsPage";
import { RoutePaths } from "./RoutePaths";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoutes />}>
                <Route path={RoutePaths.LOGIN} element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
                <Route path={RoutePaths.DASHBOARD} element={<Dashboard />} />
                <Route
                    path={RoutePaths.PUBLICATIONS}
                    element={<PublicationsPage />}
                />
                <Route path={RoutePaths.PROFILE} element={<ProfilePage />} />
                <Route path={RoutePaths.LIBRARY} element={<LibraryPage />} />
                <Route path={RoutePaths.ABOUT} element={<AboutPage />} />
                <Route path={RoutePaths.SKILLS} element={<SkillsPage />} />
                <Route path={RoutePaths.PROJECTS} element={<ProjectsPage />} />
                <Route
                    path={RoutePaths.PROJECT_DETAILS}
                    element={<ProjectsPage />}
                />
                <Route
                    path={RoutePaths.EXPERIENCE}
                    element={<ExperiencePage />}
                />
                <Route
                    path={RoutePaths.EXPERIENCE_DETAILS}
                    element={<ExperiencePage />}
                />
                <Route path={RoutePaths.ACCOUNT} element={<AccountPage />} />
            </Route>
        </Routes>
    );
}
