import {
    ArrowLeftStartOnRectangleIcon,
    Bars3BottomLeftIcon,
    BellAlertIcon,
    BriefcaseIcon,
    CloudIcon,
    CogIcon,
    ComputerDesktopIcon,
    IdentificationIcon,
    MoonIcon,
    RectangleStackIcon,
    SparklesIcon,
    SunIcon,
    ViewColumnsIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../context/useAuthContext";
import { RoutePaths } from "../../routes/RoutePaths";
import type { IconProps } from "../commons";

type SidebarComponentProps = {
    theme: "dark" | "light" | "system";
    toggleTheme: (theme: "dark" | "light" | "system") => void;
};

export default function SidebarComponent({
    theme,
    toggleTheme,
}: SidebarComponentProps) {
    const { logout } = useAuthContext();

    const navigate = useNavigate();

    const navItems: {
        page: string;
        uri: string;
        icon: IconProps;
    }[] = [
        {
            page: "Dashboard",
            uri: RoutePaths.DASHBOARD,
            icon: BellAlertIcon,
        },
        {
            page: "Publication",
            uri: RoutePaths.PUBLICATIONS,
            icon: CloudIcon,
        },
        {
            page: "Profile",
            uri: RoutePaths.PROFILE,
            icon: IdentificationIcon,
        },
        {
            page: "Library",
            uri: RoutePaths.LIBRARY,
            icon: ViewColumnsIcon,
        },
        {
            page: "About",
            uri: RoutePaths.ABOUT,
            icon: Bars3BottomLeftIcon,
        },
        {
            page: "Skills",
            uri: RoutePaths.SKILLS,
            icon: SparklesIcon,
        },
        {
            page: "Projects",
            uri: RoutePaths.PROJECTS,
            icon: RectangleStackIcon,
        },
        {
            page: "Experience",
            uri: RoutePaths.EXPERIENCE,
            icon: BriefcaseIcon,
        },
    ];

    return (
        <aside
            className={`sidebar flex flex-col justify-between p-4 lg:p-5 fixed z-1000 lg:sticky bg-section-theme shadow-lg h-full min-w-68 duration-150 *:space-y-3`}
        >
            <div className="divide-y">
                <div className="pb-4 lg:pb-5 flex items-center gap-2 font-semibold">
                    <div className="size-12 text-white bg-primary flex items-center justify-center border font-bold uppercase rounded shadow-md drop-shadow-lg tracking-wider">
                        CMS
                    </div>
                    <span>Edit Portfolio</span>
                </div>
                <nav className="flex flex-col gap-0 text-md">
                    {navItems.map((item, idx) => {
                        const active =
                            location.pathname == item.uri ||
                            location.pathname.startsWith(item.uri);
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    navigate(item.uri);
                                }}
                                className={`p-2 cursor-pointer flex items-center gap-1.5 flex-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 ${active && "bg-primary/10 dark:bg-slate-800 text-slate-900 dark:text-current hover:bg-primary/10! dark:hover:bg-slate-800!"}`}
                            >
                                <Icon className="size-4" />
                                {item.page}
                            </div>
                        );
                    })}
                </nav>
            </div>
            <div className="text-md space-y-1!">
                <div
                    onClick={() => {
                        navigate(RoutePaths.ACCOUNT);
                    }}
                    className={`p-2 cursor-pointer flex items-center gap-1.5 flex-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 ${location.pathname == RoutePaths.ACCOUNT && "bg-primary/10 dark:bg-slate-800 text-slate-900 dark:text-current hover:bg-primary/10! dark:hover:bg-slate-800!"}`}
                >
                    <CogIcon className="size-4" />
                    <span>Manage Account</span>
                </div>
                <div
                    onClick={logout}
                    className={`p-2 cursor-pointer flex items-center gap-1.5 flex-1 rounded hover:bg-rose-200/50 hover:dark:bg-rose-600/15`}
                >
                    <ArrowLeftStartOnRectangleIcon className="size-4 text-rose-400" />
                    <span>Logout</span>
                </div>
                <hr className="border-t my-1.5! mb-3!" />
                <div
                    className="border rounded-full p-1 mx-auto dark:bg-slate-800 bg-slate-100 flex justify-around
                    text-sm
                    *:cursor-pointer *:flex *:gap-1 *:items-center *:m-px *:px-2 *:py-1 *:rounded-full
                    "
                >
                    <div
                        className={`${theme === "light" && "bg-primary dark:bg-slate-900 text-white dark:text-current"}`}
                        onClick={() => {
                            toggleTheme("light");
                        }}
                    >
                        <SunIcon className="size-4" />
                        <span
                            className={`${theme !== "light" && "opactiy-40"}`}
                        >
                            Light
                        </span>
                    </div>
                    <div
                        className={`${theme === "dark" && "bg-primary dark:bg-slate-900 text-white dark:text-current"}`}
                        onClick={() => {
                            toggleTheme("dark");
                        }}
                    >
                        <MoonIcon className="size-4" />
                        <span className={`${theme !== "dark" && "opactiy-40"}`}>
                            Dark
                        </span>
                    </div>
                    <div
                        className={`${theme === "system" && "bg-primary dark:bg-slate-900 text-white dark:text-current"}`}
                        onClick={() => {
                            toggleTheme("system");
                        }}
                    >
                        <ComputerDesktopIcon className="size-4" />
                        <span
                            className={`${theme !== "system" && "opactiy-40"}`}
                        >
                            System
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
