import { useEffect } from "react";
import type { Publication } from "../services/PublicationService";

const SITE_URL = "https://your-domain.com";

type SeoComponentProps = {
    content: Publication | null;
};

export default function SeoComponent({ content }: SeoComponentProps) {
    const name = content?.profile?.name ?? "Venkata Kiran Jakkapu";
    const designation =
        content?.profile?.designation ?? "Java Full Stack Engineer";
    const description =
        content?.about?.summary ??
        "Java Full Stack Engineer specializing in Java, Spring Boot, React, microservices, PostgreSQL, cloud-native applications, and AI-assisted software engineering.";

    useEffect(() => {
        document.title = `${name} | ${designation}`;

        const descriptionMeta = document.querySelector(
            'meta[name="description"]',
        );
        descriptionMeta?.setAttribute("content", description);

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: `${SITE_URL}/`,
            name: `${name} | ${designation}`,
            description,
            mainEntity: {
                "@type": "Person",
                name,
                jobTitle: designation,
                description,
                image: `${SITE_URL}/profile.png`,
                sameAs: [
                    "https://github.com/vkiranjakkapu",
                    "https://www.linkedin.com/in/venkata-kiran-jakkapu-a2209415a/",
                    "https://www.instagram.com/jvkiran_/",
                ],
            },
        };

        let script = document.getElementById(
            "profile-structured-data",
        ) as HTMLScriptElement | null;

        if (!script) {
            script = document.createElement("script");
            script.id = "profile-structured-data";
            script.type = "application/ld+json";
            document.head.appendChild(script);
        }

        script.textContent = JSON.stringify(structuredData);

        return () => script?.remove();
    }, [name, designation, description]);

    return null;
}
