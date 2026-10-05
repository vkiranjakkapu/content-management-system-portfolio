import type { IconType } from "react-icons";
import {
    BsGithub,
    BsInstagram,
    BsLinkedin,
    BsSpotify,
    BsWhatsapp,
} from "react-icons/bs";
import { apiClient, type ApiResponse } from "../api/api";

class PublicationService {
    async getPublicationContent<T>(): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            uri: "/publish/publication",
        });
    }

    async fetchMediaById<T>(mediaId: string): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            uri: "/media/fetch/" + mediaId,
            config: {
                responseType: "blob",
            },
        });
    }

    async fetchMediaFromList<T>(payload: {
        ids: string[];
    }): Promise<ApiResponse<T>> {
        return apiClient({
            type: "get",
            uri: "/media/fetch/",
            payload,
        });
    }

    async sendQuote(payload: {
        name: string;
        email: string;
        message: string;
    }): Promise<ApiResponse<Contact>> {
        return apiClient({
            type: "post",
            uri: "/contact/sendquote",
            payload,
        });
    }
}

export default new PublicationService();

export type Publication = {
    id: string;
    settings: DisplaySettings;
    seo?: SeoSettings;
    profile: Profile;
    about: About;
    skills: Map<string, Skill[]>;
    projects: Project[];
    experiences: Experience[];
    socialProfiles: SocialProfile[];
};

export type SeoSettings = {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: Media;
    robots?: string;
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
};

export type Skill = {
    tech: string;
    name: string;
};

export type SocialProfile = {
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

export type Contact = {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
};

export const SocialIconMap: Record<SocialMediaType, IconType> = {
    [SocialMediaType.LINKEDIN]: BsLinkedin,
    [SocialMediaType.WHATSAPP]: BsWhatsapp,
    [SocialMediaType.GITHUB]: BsGithub,
    [SocialMediaType.SPOTIFY]: BsSpotify,
    [SocialMediaType.INSTAGRAM]: BsInstagram,
};
