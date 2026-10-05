export type Publication = {
    id: string;
    settings: DisplaySettings;
    seo?: SeoSettings;
    profile: Profile;
    about: About;
    skills: Record<string, Skill[]>;
    projects: Project[];
    experiences: Experience[];
    socialProfiles: SocialProfile[];
};

export type SeoSettings = {
    id: string;
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: Media;
    robots?: string;
};

export type About = {
    id: string;
    name: string;
    summary: string;
    updatedAt: string;
    createdAt: string;
};

export type Experience = {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isWorking: string;
};

export type Project = {
    id: string;
    title: string;
    techStack: Skill[];
    gallery: Media[];
    gitUrl: string;
};

export type DisplaySettings = {
    id: string;
    showSkills: boolean;
    showProjects: boolean;
    showExperience: boolean;
    showContact: boolean;
};

export type Profile = {
    id: string;
    dp: Media;
    email: string;
    name: string;
    phone: string;
    designation: string;
    availability: string;
    location: string;
    banner: Media;
};

export type Skill = {
    id: string;
    tech: string;
    name: string;
};

export type SocialProfile = {
    id: string;
    name: SocialMediaType;
    url: string;
};

export const SocialMediaType = {
    LINKEDIN: "LINKEDIN",
    GITHUB: "GITHUB",
    WHATSAPP: "WHATSAPP",
    SPOTIFY: "SPOTIFY",
    INSTAGRAM: "INSTAGRAM",
} as const;

export type SocialMediaType =
    (typeof SocialMediaType)[keyof typeof SocialMediaType];

export type Media = {
    id: string;
    mediaName: string;
    media: Blob;
    mediaType: string;
    tag: MediaTag;
    createdAt: string;
};

export const MediaTag = {
    PROFILE: "PROFILE",
    UI: "UI",
    BANNER: "BANNER",
    ARCHITECTURE: "ARCHITECTURE",
    SCHEMA: "SCHEMA",
    THUMBNAIL: "THUMBNAIL",
} as const;

export type MediaTag = (typeof MediaTag)[keyof typeof MediaTag];

export type Contact = {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
};
