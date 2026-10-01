import { useState, type SubmitEvent } from "react";
import useAuthContext from "../../context/useAuthContext";

export default function LoginPage() {
    const { login } = useAuthContext();
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    function handleSignIn(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (email === null || password === null) {
            return;
        }

        login(email, password);
    }

    return (
        <form onSubmit={handleSignIn}>
            <input
                type="email"
                name="email"
                id="email"
                className="border"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <input
                type="password"
                name="password"
                className="border"
                id="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <button type="submit">Login</button>
        </form>
    );
}
