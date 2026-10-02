import { useState, type SubmitEvent } from "react";
import useAuthContext from "../../context/useAuthContext";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import ActionButton from "../../components/ActionButtonComponent";
import InputComponent from "../../components/formelements/InputComponent";
import { useNotifications } from "../../components/notifications/useNotifications";
import Notification from "../../components/notifications/Notification";
import type { ErrorResponse } from "../../api/api";

export default function LoginPage() {
    const { login } = useAuthContext();

    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const { notifications, setNotifications } = useNotifications(["login"]);

    function handleSignIn(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (email === null || password === null) {
            return;
        }

        login(email, password).catch((e: ErrorResponse) => {
            setNotifications("login", {
                type: "error",
                messages:
                    e.validationErrors.length > 0
                        ? e.validationErrors.map(
                              (ve) => `${ve.field} ${ve.message}`,
                          )
                        : [e.errorMessage],
            });
        });
    }

    return (
        <main className="h-screen overflow-hidden flex items-center justify-center">
            <form
                onSubmit={handleSignIn}
                className="m-4 p-4 md:p-6 lg:p-10 bg-background-secondary space-y-3 w-full md:w-2/5 rounded-md shadow-lg"
            >
                <div className="relative rounded-md shadow-sm bg-background min-h-30 py-3 flex flex-col items-center justify-center">
                    <div
                        className="absolute inset-0 bg-cover bg-left z-0 opacity-40 bg-gray-900/10"
                        style={{ backgroundImage: "url(/banner.webp)" }}
                    ></div>
                    <h1 className="z-1 text-primary font-semibold text-center">
                        Content Management System <br /> Portfolio
                    </h1>
                </div>
                <div className="">
                    <h2 className="text-lg flex gap-1 items-center">
                        <LockClosedIcon className="size-4" /> Please sign in to
                        continue
                    </h2>
                </div>
                {notifications["login"] && (
                    <div className="">
                        <Notification
                            type={notifications["login"]?.type}
                            messages={notifications["login"]?.messages}
                        />
                    </div>
                )}
                <div className="">
                    <label htmlFor="email" className="capitalize">
                        email
                    </label>
                    <InputComponent
                        type="email"
                        name="email"
                        id="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        placeholder="Enter Email"
                        required
                    />
                </div>
                <div className="">
                    <label htmlFor="password" className="capitalize">
                        password
                    </label>
                    <InputComponent
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="Enter Password"
                        required
                    />
                </div>
                <ActionButton
                    type="submit"
                    icon={LockOpenIcon}
                    text="Login"
                    className="ms-auto"
                />
            </form>
        </main>
    );
}
