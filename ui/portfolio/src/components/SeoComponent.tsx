import { useEffect } from "react";
import type { Publication } from "../services/PublicationService";

const SITE_URL = "https://your-domain.com";
const MEDIA_URL = `${SITE_URL}/cms/api/v1/media/fetch`;

type SeoComponentProps = {
    content: Publication | null;
};

export default function SeoComponent({ content }: SeoComponentProps) {
    const name = content?.profile?.name ?? "Venkata Kiran Jakkapu";

    const designation =
        content?.profile?.designation ?? "Java Full Stack Engineer";

    const defaultTitle = `${name} | ${designation}`;

    const defaultDescription =
        content?.about?.summary ??
        "Java Full Stack Engineer specializing in Java, Spring Boot, React, microservices, PostgreSQL, cloud-native applications, and AI-assisted software engineering.";

    const title = content?.seo?.title || defaultTitle;

    const description = content?.seo?.description || defaultDescription;

    const canonicalUrl = content?.seo?.canonicalUrl || `${SITE_URL}/`;

    const ogTitle = content?.seo?.ogTitle || title;

    const ogDescription = content?.seo?.ogDescription || description;

    const ogImageUrl = content?.seo?.ogImage?.id
        ? `${MEDIA_URL}/${content.seo.ogImage.id}`
        : `${SITE_URL}/og-image.webp`;

    const robots = content?.seo?.robots || "index,follow";

    useEffect(() => {
        document.title = title;

        const setMeta = (
            selector: string,
            attribute: string,
            value: string,
        ) => {
            const meta = document.querySelector<HTMLMetaElement>(selector);

            meta?.setAttribute(attribute, value);
        };

        const setLink = (
            selector: string,
            attribute: string,
            value: string,
        ) => {
            const link = document.querySelector<HTMLLinkElement>(selector);

            link?.setAttribute(attribute, value);
        };

        setMeta('meta[name="description"]', "content", description);

        setMeta('meta[name="robots"]', "content", robots);

        setLink('link[rel="canonical"]', "href", canonicalUrl);

        setMeta('meta[property="og:title"]', "content", ogTitle);

        setMeta('meta[property="og:description"]', "content", ogDescription);

        setMeta('meta[property="og:image"]', "content", ogImageUrl);

        setMeta('meta[name="twitter:image"]', "content", ogImageUrl);

        setMeta('meta[name="twitter:card"]', "content", "summary_large_image");

        setMeta('meta[property="og:url"]', "content", canonicalUrl);

        setMeta('meta[property="og:type"]', "content", "website");

        setMeta('meta[name="twitter:title"]', "content", ogTitle);

        setMeta('meta[name="twitter:description"]', "content", ogDescription);

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: canonicalUrl,
            name: title,
            description,
            mainEntity: {
                "@type": "Person",
                name,
                jobTitle: designation,
                description,
                image: `${SITE_URL}/profile.webp`,
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

        return () => {
            script?.remove();
        };
    }, [
        title,
        description,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImageUrl,
        robots,
        name,
        designation,
    ]);

    return null;
}
