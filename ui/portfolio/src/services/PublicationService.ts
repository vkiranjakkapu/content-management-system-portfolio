class PublicationService {}

export default new PublicationService();

export type Publication = {
    id: string;
    settings: DisplaySettings;
    profile: Profile;
    about: About;
    skills: Map<string, Skill[]>;
    projects: Project[];
    experiences: Experience[];
};

export type About = {
    name: string;
    summary: string;
};

export type Experience = {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isWorking: string;
};

export type Project = {
    title: string;
    techStack: Skill[];
    gallery: Media[];
    gitUrl: string;
};

export type DisplaySettings = {
    showSkills: boolean;
    showProjects: boolean;
    showExperience: boolean;
    showContact: boolean;
};

export type Profile = {
    dp: Media;
    email: string;
    name: string;
    phone: string;
    designation: string;
    availability: string;
    location: string;
    banner: Media;
    socialProfiles: SocialProfile[];
};

export type Skill = {
    tech: string;
    name: string;
};

export type SocialProfile = {
    name: SocialMediaType;
    url: string;
};

const SocialMediaType = {
    LINKEDIN: "LINKEDIN",
    WHATSAPP: "WHATSAPP",
    SPOTIFY: "SPOTIFY",
} as const;

export type SocialMediaType =
    (typeof SocialMediaType)[keyof typeof SocialMediaType];

export type Media = {
    id: string;
    mediaName: string;
    media: Blob;
    mediaType: string;
    tag: MediaTag;
};

const MediaTag = {
    PROFILE: "PROFILE",
    UI: "UI",
    BANNER: "BANNER",
    ARCHITECTURE: "ARCHITECTURE",
    SCHEMA: "SCHEMA",
    THUMBNAIL: "THUMBNAIL",
} as const;

export type MediaTag = (typeof MediaTag)[keyof typeof MediaTag];

