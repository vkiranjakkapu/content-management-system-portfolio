import { useEffect, useState, type ReactNode } from "react";
import ActionButton from "../ActionButtonComponent";
import SidebarComponent from "./SidebarComponent";
import {
    Bars3Icon,
    ComputerDesktopIcon,
    MoonIcon,
    SunIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const [theme, setTheme] = useState<"dark" | "light" | "system">(() => {
        const theme = localStorage.getItem("theme") as
            | "dark"
            | "light"
            | "system"
            | null;
        if (theme === null) {
            return "system";
        }
        return theme;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            if (theme === "system") {
                document.documentElement.classList.toggle(
                    "dark",
                    mediaQuery.matches,
                );
            } else {
                document.documentElement.classList.toggle(
                    "dark",
                    theme === "dark",
                );
            }
        };

        applyTheme();

        if (theme === "system") {
            mediaQuery.addEventListener("change", applyTheme);

            return () => {
                mediaQuery.removeEventListener("change", applyTheme);
            };
        }
    }, [theme]);

    function toggleTheme(theme: "dark" | "light" | "system") {
        localStorage.setItem("theme", theme);
        setTheme(theme);
    }

    return (
        <main
            className={`relative flex gap-3 h-screen ${openMenu ? "[&>.sidebar]:translate-x-0" : "[&>.sidebar]:-translate-x-full lg:[&>.sidebar]:translate-x-0"}`}
        >
            <div
                className={`absolute z-1000 inset-0 backdrop-blur-xs bg-primary/20 dark:bg-slate-600/40 lg:opacity-0 lg:pointer-events-none ${openMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} duration-150`}
                onClick={() => setOpenMenu(false)}
            ></div>
            <SidebarComponent theme={theme} toggleTheme={toggleTheme} />
            <div className="h-full overflow-y-scroll overflow-x-clip flex-1">
                <nav className=" lg:hidden p-4 lg:p-5 flex flex-wrap justify-between bg-section-theme shadow-lg">
                    <div className="flex items-center gap-2">
                        <span
                            className={`size-12 text-white bg-primary flex items-center justify-center border font-bold uppercase rounded shadow-xl tracking-wider`}
                        >
                            CMS
                        </span>
                        <span className="font-semibold">Edit Portfolio</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-0.5">
                            <ActionButton
                                icon={theme !== "light" ? MoonIcon : SunIcon}
                                className={`p-1.5 rounded-full ${theme === "system" && "btn-secondary "}`}
                                onClick={() => {
                                    toggleTheme(
                                        theme == "dark" ? "light" : "dark",
                                    );
                                }}
                            />
                            <ActionButton
                                icon={ComputerDesktopIcon}
                                className={`p-1.5 rounded-full ${theme !== "system" && "btn-secondary "}`}
                                onClick={() => {
                                    toggleTheme("system");
                                }}
                            />
                        </div>
                        <ActionButton
                            icon={openMenu ? XMarkIcon : Bars3Icon}
                            className="p-1.5 rounded"
                            onClick={() => {
                                setOpenMenu(!openMenu);
                            }}
                        />
                    </div>
                </nav>
                <div className="p-4 lg:py-6">{children}</div>
            </div>
        </main>
    );
}
