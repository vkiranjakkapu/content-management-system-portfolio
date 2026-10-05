import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import AuthenticationContextProvider from "./context/AuthenticationContextProvider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthenticationContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthenticationContextProvider>
    </StrictMode>,
);
