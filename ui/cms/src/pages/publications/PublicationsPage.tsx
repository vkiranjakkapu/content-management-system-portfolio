import { CheckBadgeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import type { ErrorResponse } from "../../api/api";
import ActionButton from "../../components/ActionButtonComponent";
import InputComponent from "../../components/formelements/InputComponent";
import SelectComponent from "../../components/formelements/SelectComponent";
import TextareaComponent from "../../components/formelements/TextareaComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import TableComponent from "../../components/TableComponent";
import AboutService from "../../services/AboutService";
import {
    PublicationStatus,
    type About,
    type Experience,
    type Media,
    type Project,
    type Publication,
    type Skill,
} from "../../services/DtoModels";
import ExperienceService from "../../services/ExperienceService";
import MediaService from "../../services/MediaService";
import ProjectsService from "../../services/ProjectsService";
import PublicationService, {
    type PublicationPayload,
} from "../../services/PublicationService";
import SkillsService from "../../services/SkillsService";
import { SkillComponent } from "../skills/SkillComponent";
import AboutComponent from "./components/AboutComponent";

const publicationColumns = [
    { key: "id" as const, alias: "ID", customiseColumn: "max-w-64 truncate" },
    { key: "status" as const, alias: "Status" },
    { key: "createdAt" as const, alias: "Created" },
    { key: "updatedAt" as const, alias: "Updated" },
];

type SeoForm = {
    title: string;
    description: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImageId: string;
    robots: string;
};

const emptySeo: SeoForm = {
    title: "",
    description: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImageId: "",
    robots: "index,follow",
};

function getSeoForm(publication: Publication | null): SeoForm {
    return {
        title: publication?.seo?.title ?? "",
        description: publication?.seo?.description ?? "",
        canonicalUrl: publication?.seo?.canonicalUrl ?? "",
        ogTitle: publication?.seo?.ogTitle ?? "",
        ogDescription: publication?.seo?.ogDescription ?? "",
        ogImageId:
            publication?.seo?.ogImageId ?? publication?.seo?.ogImage?.id ?? "",
        robots: publication?.seo?.robots ?? "index,follow",
    };
}

export default function PublicationsPage() {
    const [isEmptyProfile, setEmptyProfile] = useState(true);
    const { notifications, setNotifications } = useNotifications(["info"]);
    const infoNotifications = notifications["info"] ?? null;

    const [actionInProgress, setActionInProgress] = useState<
        "pub-fetch" | "action" | "publish" | null
    >("pub-fetch");

    const [allAbouts, setAllAbouts] = useState<About[]>([]);
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
    const [allMedia, setAllMedia] = useState<Media[]>([]);
    const [activeDraft, setActiveDraft] = useState<Publication | null>(null);
    const [allPublications, setAllPublications] = useState<Publication[]>([]);
    const [seoForm, setSeoForm] = useState<SeoForm>(emptySeo);

    const fetchAllAbouts = useCallback(async () => {
        return AboutService.getAbouts<About[]>().then((resp) => {
            setAllAbouts(resp.data);
        });
    }, []);

    const fetchAllSkills = useCallback(async () => {
        return SkillsService.getSkills<Record<string, Skill[]>>().then(
            (resp) => {
                setAllSkills(Object.values(resp.data).flat());
            },
        );
    }, []);

    const fetchAllProjects = useCallback(async () => {
        return ProjectsService.getProjects<Project[]>().then((resp) => {
            setAllProjects(resp.data);
        });
    }, []);

    const fetchAllExperiences = useCallback(async () => {
        return ExperienceService.getExperiences<Experience[]>().then((resp) => {
            setAllExperiences(resp.data);
        });
    }, []);

    const fetchAllMedia = useCallback(async () => {
        return MediaService.getMedia<Media[]>().then((resp) => {
            setAllMedia(resp.data);
        });
    }, []);

    const fetchAllPublications = useCallback(() => {
        PublicationService.getPublicaitons<Publication[]>()
            .then((resp) => {
                setEmptyProfile(false);
                setAllPublications(resp.data);

                const draft =
                    resp.data.find(
                        (publication) =>
                            publication.status === PublicationStatus.DRAFT,
                    ) ?? null;

                setActiveDraft(draft);
                setSeoForm(getSeoForm(draft));

                void Promise.all([
                    fetchAllAbouts(),
                    fetchAllSkills(),
                    fetchAllProjects(),
                    fetchAllExperiences(),
                    fetchAllMedia(),
                ]);
            })
            .catch((e: ErrorResponse) => {
                if (e.errorCode === "BUS-2001") {
                    setEmptyProfile(true);
                    setNotifications("info", {
                        type: "info",
                        messages: [e.errorMessage],
                    });
                    return;
                }

                setNotifications("info", {
                    type: "error",
                    messages: [
                        "We are facing unexpected issues, please try again later.",
                    ],
                });
            })
            .finally(() => {
                setActionInProgress(null);
            });
    }, [
        fetchAllAbouts,
        fetchAllExperiences,
        fetchAllMedia,
        fetchAllProjects,
        fetchAllSkills,
        setNotifications,
    ]);

    useEffect(() => {
        fetchAllPublications();
    }, [fetchAllPublications]);

    const updatePublication = useCallback(
        (payload: PublicationPayload) => {
            setActionInProgress("action");

            PublicationService.updatePublication<Publication>(payload)
                .then((resp) => {
                    setAllPublications((prev) => [
                        resp.data,
                        ...prev.filter(
                            (publication) => publication.id !== resp.data.id,
                        ),
                    ]);
                    setActiveDraft(resp.data);
                    setSeoForm(getSeoForm(resp.data));
                })
                .catch((e: ErrorResponse) => {
                    setNotifications("info", {
                        type: "error",
                        messages: [e.errorMessage],
                    });
                })
                .finally(() => {
                    setActionInProgress(null);
                });
        },
        [setNotifications],
    );

    const publish = useCallback(
        (publication: Publication) => {
            if (publication.status !== PublicationStatus.DRAFT) {
                setNotifications("info", {
                    type: "info",
                    messages: ["Only a DRAFT publication can be published."],
                });
                return;
            }

            if (
                !window.confirm(
                    "This action will publish the selected draft. Confirm.",
                )
            ) {
                return;
            }

            setActionInProgress("publish");
            PublicationService.publish<void>(publication.id)
                .then(() => {
                    setNotifications("info", {
                        type: "success",
                        messages: ["Published successfully."],
                    });
                    fetchAllPublications();
                })
                .catch((e: ErrorResponse) => {
                    setNotifications("info", {
                        type: "error",
                        messages: [e.errorMessage],
                    });
                    setActionInProgress(null);
                });
        },
        [fetchAllPublications, setNotifications],
    );

    const selectAbout = useCallback(
        (about: About) => {
            if (about.id === activeDraft?.about?.id) {
                return;
            }
            updatePublication({ aboutId: about.id });
        },
        [activeDraft?.about?.id, updatePublication],
    );

    const toggleSkill = useCallback(
        (skill: Skill) => {
            const selectedIds = Object.values(activeDraft?.skills ?? {})
                .flat()
                .map((item) => item.id);

            const skillIds = selectedIds.includes(skill.id)
                ? selectedIds.filter((id) => id !== skill.id)
                : [...selectedIds, skill.id];

            updatePublication({ skillIds });
        },
        [activeDraft?.skills, updatePublication],
    );

    const toggleProject = useCallback(
        (project: Project) => {
            const selectedIds =
                activeDraft?.projects?.map((item) => item.id) ?? [];
            const projectIds = selectedIds.includes(project.id)
                ? selectedIds.filter((id) => id !== project.id)
                : [...selectedIds, project.id];

            updatePublication({ projectIds });
        },
        [activeDraft?.projects, updatePublication],
    );

    const toggleExperience = useCallback(
        (experience: Experience) => {
            const selectedIds =
                activeDraft?.experiences?.map((item) => item.id) ?? [];
            const experienceIds = selectedIds.includes(experience.id)
                ? selectedIds.filter((id) => id !== experience.id)
                : [...selectedIds, experience.id];

            updatePublication({ experienceIds });
        },
        [activeDraft?.experiences, updatePublication],
    );

    const updateSectionVisibility = useCallback(
        (payload: PublicationPayload) => updatePublication(payload),
        [updatePublication],
    );

    const saveSeo = useCallback(() => {
        updatePublication({
            seo: {
                title: seoForm.title,
                description: seoForm.description,
                canonicalUrl: seoForm.canonicalUrl,
                ogTitle: seoForm.ogTitle,
                ogDescription: seoForm.ogDescription,
                ogImageId: seoForm.ogImageId || undefined,
                robots: seoForm.robots,
            },
        });
    }, [seoForm, updatePublication]);

    const selectedSkillIds = new Set(
        Object.values(activeDraft?.skills ?? {})
            .flat()
            .map((skill) => skill.id),
    );
    const selectedProjectIds = new Set(
        activeDraft?.projects?.map((project) => project.id) ?? [],
    );
    const selectedExperienceIds = new Set(
        activeDraft?.experiences?.map((experience) => experience.id) ?? [],
    );

    const selectionDisabled = actionInProgress !== null;

    return (
        <div className="space-y-6">
            <SectionLayoutComponent
                title="Publications"
                description="Manage your site publication versions from here"
                spinner={{
                    isLoading: actionInProgress === "pub-fetch",
                    text: "Fetching your publications...",
                }}
            >
                <div className="space-y-3">
                    {infoNotifications && (
                        <Notification {...infoNotifications} />
                    )}
                    {!isEmptyProfile && !activeDraft && (
                        <Notification
                            type="info"
                            messages={[
                                "No draft exists yet. Selecting any content below will create the first draft publication.",
                            ]}
                        />
                    )}
                    {!isEmptyProfile && (
                        <TableComponent
                            body={allPublications}
                            columns={publicationColumns}
                            actionEvents={[
                                {
                                    title: "Action",
                                    clickEvent: {
                                        text: "Publish",
                                        className: "text-primary font-medium",
                                        onClick: publish,
                                    },
                                },
                            ]}
                        />
                    )}
                </div>
            </SectionLayoutComponent>

            {!isEmptyProfile && (
                <>
                    <SectionLayoutComponent
                        title="Select About"
                        description="Choose the About content that will appear on the published portfolio."
                        spinner={{
                            isLoading: actionInProgress === "action",
                            text: "Updating publication...",
                        }}
                    >
                        {allAbouts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {allAbouts.map((about) => (
                                    <AboutComponent
                                        key={about.id}
                                        about={about}
                                        checked={
                                            activeDraft?.about?.id === about.id
                                        }
                                        onClick={selectAbout}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Notification
                                type="info"
                                messages={["No abouts added so far"]}
                            />
                        )}
                    </SectionLayoutComponent>

                    <SectionLayoutComponent
                        title="Select Skills"
                        description="Choose the skills that should be included in the publication."
                        spinner={{
                            isLoading: actionInProgress === "action",
                            text: "Updating publication...",
                        }}
                    >
                        {allSkills.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {allSkills.map((skill) => (
                                    <SkillComponent
                                        key={skill.id}
                                        skill={skill}
                                        className={
                                            selectedSkillIds.has(skill.id)
                                                ? "border-primary bg-primary/10"
                                                : ""
                                        }
                                        actionBtns={[
                                            {
                                                icon: CheckBadgeIcon,
                                                disabled: selectionDisabled,
                                                className: selectedSkillIds.has(
                                                    skill.id,
                                                )
                                                    ? "text-primary"
                                                    : "opacity-40",
                                                onClick: toggleSkill,
                                            },
                                        ]}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Notification
                                type="info"
                                messages={["No skills added so far"]}
                            />
                        )}
                    </SectionLayoutComponent>

                    <SectionLayoutComponent
                        title="Select Projects"
                        description="Choose the projects that should appear on the published portfolio."
                        spinner={{
                            isLoading: actionInProgress === "action",
                            text: "Updating publication...",
                        }}
                    >
                        {allProjects.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {allProjects.map((project) => {
                                    const selected = selectedProjectIds.has(
                                        project.id,
                                    );

                                    return (
                                        <div
                                            key={project.id}
                                            className={`relative cursor-pointer rounded border p-4 space-y-2 hover:shadow-md ${
                                                selected
                                                    ? "border-primary bg-primary/10"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                if (!selectionDisabled) {
                                                    toggleProject(project);
                                                }
                                            }}
                                        >
                                            <div className="absolute top-3 right-3">
                                                <InputComponent
                                                    type="checkbox"
                                                    className="size-5"
                                                    checked={selected}
                                                    disabled={selectionDisabled}
                                                    readOnly
                                                />
                                            </div>
                                            <h3 className="text-lg font-semibold pr-8">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm opacity-80 line-clamp-3">
                                                {project.description}
                                            </p>
                                            {project.techStack.length > 0 && (
                                                <p className="text-sm">
                                                    <b>Skills: </b>
                                                    {project.techStack
                                                        .map(
                                                            (skill) =>
                                                                skill.name,
                                                        )
                                                        .join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <Notification
                                type="info"
                                messages={["No projects added so far"]}
                            />
                        )}
                    </SectionLayoutComponent>

                    <SectionLayoutComponent
                        title="Select Experience"
                        description="Choose the experience entries that should appear on the published portfolio."
                        spinner={{
                            isLoading: actionInProgress === "action",
                            text: "Updating publication...",
                        }}
                    >
                        {allExperiences.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {allExperiences.map((experience) => {
                                    const selected = selectedExperienceIds.has(
                                        experience.id,
                                    );

                                    return (
                                        <div
                                            key={experience.id}
                                            className={`relative cursor-pointer rounded border p-4 space-y-1 hover:shadow-md ${
                                                selected
                                                    ? "border-primary bg-primary/10"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                if (!selectionDisabled) {
                                                    toggleExperience(
                                                        experience,
                                                    );
                                                }
                                            }}
                                        >
                                            <div className="absolute top-3 right-3">
                                                <InputComponent
                                                    type="checkbox"
                                                    className="size-5"
                                                    checked={selected}
                                                    disabled={selectionDisabled}
                                                    readOnly
                                                />
                                            </div>
                                            <h3 className="text-lg font-semibold pr-8">
                                                {experience.position}
                                            </h3>
                                            <p className="font-medium">
                                                {experience.company}
                                            </p>
                                            <p className="text-sm opacity-70">
                                                {experience.startDate} —{" "}
                                                {experience.working
                                                    ? "Present"
                                                    : experience.endDate}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <Notification
                                type="info"
                                messages={["No experience added so far"]}
                            />
                        )}
                    </SectionLayoutComponent>

                    <SectionLayoutComponent
                        title="Page Sections"
                        description="Control which sections are visible on the published portfolio."
                        spinner={{
                            isLoading: actionInProgress === "action",
                            text: "Updating publication...",
                        }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                ["Skills", "showSkills"],
                                ["Projects", "showProjects"],
                                ["Experience", "showExperience"],
                                ["Contact", "showContact"],
                            ].map(([label, key]) => {
                                const settingKey = key as
                                    | "showSkills"
                                    | "showProjects"
                                    | "showExperience"
                                    | "showContact";
                                const checked =
                                    activeDraft?.settings?.[settingKey] ?? true;

                                return (
                                    <label
                                        key={key}
                                        className="flex items-center gap-3 rounded border p-3 cursor-pointer"
                                    >
                                        <InputComponent
                                            type="checkbox"
                                            className="size-5"
                                            checked={checked}
                                            disabled={selectionDisabled}
                                            onChange={(event) => {
                                                updateSectionVisibility({
                                                    [settingKey]:
                                                        event.target.checked,
                                                });
                                            }}
                                        />
                                        <span className="font-medium">
                                            {label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </SectionLayoutComponent>

                    <SectionLayoutComponent
                        title="SEO Settings"
                        description="These values are stored with the draft and become part of the published portfolio."
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="space-y-1">
                                    <span className="text-sm font-medium">
                                        Title
                                    </span>
                                    <InputComponent
                                        value={seoForm.title}
                                        onChange={(event) =>
                                            setSeoForm((prev) => ({
                                                ...prev,
                                                title: event.target.value,
                                            }))
                                        }
                                        placeholder="Portfolio title"
                                        disabled={selectionDisabled}
                                        className="w-full rounded border p-2"
                                    />
                                </label>
                                <label className="space-y-1">
                                    <span className="text-sm font-medium">
                                        Canonical URL
                                    </span>
                                    <InputComponent
                                        type="url"
                                        value={seoForm.canonicalUrl}
                                        onChange={(event) =>
                                            setSeoForm((prev) => ({
                                                ...prev,
                                                canonicalUrl:
                                                    event.target.value,
                                            }))
                                        }
                                        placeholder="https://example.com"
                                        disabled={selectionDisabled}
                                        className="w-full rounded border p-2"
                                    />
                                </label>
                            </div>

                            <label className="space-y-1 block">
                                <span className="text-sm font-medium">
                                    Description
                                </span>
                                <TextareaComponent
                                    value={seoForm.description}
                                    onChange={(event) =>
                                        setSeoForm((prev) => ({
                                            ...prev,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Short description for search engines"
                                    disabled={selectionDisabled}
                                    className="w-full rounded border p-2"
                                />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="space-y-1">
                                    <span className="text-sm font-medium">
                                        OG Title
                                    </span>
                                    <InputComponent
                                        value={seoForm.ogTitle}
                                        onChange={(event) =>
                                            setSeoForm((prev) => ({
                                                ...prev,
                                                ogTitle: event.target.value,
                                            }))
                                        }
                                        disabled={selectionDisabled}
                                        className="w-full rounded border p-2"
                                    />
                                </label>
                                <label className="space-y-1">
                                    <span className="text-sm font-medium">
                                        Robots
                                    </span>
                                    <SelectComponent
                                        options={[
                                            {
                                                value: "index,follow",
                                                text: "Index, Follow",
                                            },
                                            {
                                                value: "noindex,follow",
                                                text: "No Index, Follow",
                                            },
                                            {
                                                value: "index,nofollow",
                                                text: "Index, No Follow",
                                            },
                                            {
                                                value: "noindex,nofollow",
                                                text: "No Index, No Follow",
                                            },
                                        ]}
                                        value={seoForm.robots}
                                        onChange={(event) =>
                                            setSeoForm((prev) => ({
                                                ...prev,
                                                robots: event.target.value,
                                            }))
                                        }
                                        disabled={selectionDisabled}
                                        className="w-full rounded border p-2 bg-transparent"
                                        emptyOption="Select robots policy"
                                    />
                                </label>
                            </div>

                            <label className="space-y-1 block">
                                <span className="text-sm font-medium">
                                    OG Description
                                </span>
                                <TextareaComponent
                                    value={seoForm.ogDescription}
                                    onChange={(event) =>
                                        setSeoForm((prev) => ({
                                            ...prev,
                                            ogDescription: event.target.value,
                                        }))
                                    }
                                    disabled={selectionDisabled}
                                    className="w-full rounded border p-2"
                                />
                            </label>

                            <label className="space-y-1 block">
                                <span className="text-sm font-medium">
                                    OG Image
                                </span>
                                <SelectComponent
                                    options={allMedia.map((media) => ({
                                        value: media.id,
                                        text: `${media.mediaName} (${media.tag})`,
                                    }))}
                                    value={seoForm.ogImageId}
                                    onChange={(event) =>
                                        setSeoForm((prev) => ({
                                            ...prev,
                                            ogImageId: event.target.value,
                                        }))
                                    }
                                    disabled={selectionDisabled}
                                    className="w-full rounded border p-2 bg-transparent"
                                    emptyOption="No OG image"
                                />
                            </label>

                            <div className="flex justify-end">
                                <ActionButton
                                    icon={CheckCircleIcon}
                                    text="Save SEO"
                                    className="px-3 py-2"
                                    disabled={selectionDisabled}
                                    onClick={saveSeo}
                                />
                            </div>
                        </div>
                    </SectionLayoutComponent>
                </>
            )}
        </div>
    );
}
