export const AppConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    IDENTITY_SERVICE_URL: "/identity/api/v1",
    IDENTITY_AUTH_URL: "/identity/api/v1/auth",
    IDENTITY_PROFILE_URL: "/identity/api/v1/users",
    CMS_PUBLICATION_URL: "/cms/api/v1/publish",
    CMS_MEDIA_URL: "/cms/api/v1/media",
    CMS_PROFILE_URL: "/cms/api/v1/profile",
    CMS_ABOUT_URL: "/cms/api/v1/about",
    CMS_SOCIAL_PROFILES_URL: "/cms/api/v1/socialprofile",
    CMS_SKILLS_URL: "/cms/api/v1/skills",
    CMS_TECHNOLOGIES_URL: "/cms/api/v1/technologies",
    CMS_PROJECTS_URL: "/cms/api/v1/projects",
    CMS_EXPERIENCE_URL: "/cms/api/v1/experience",
    CMS_CONTACT_URL: "/cms/api/v1/contact",

    LOCAL_AUTH_KEY: "cms-portfolio",
    PUBLIC_ENDPOINTS: ["/auth", "/publication", "/fetch"],
} as const;
