import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import AuthenticationContextProvider from "./context/AuthenticationContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthenticationContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthenticationContextProvider>
    </StrictMode>,
);
