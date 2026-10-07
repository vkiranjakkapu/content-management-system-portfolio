import {
    ArrowPathIcon,
    CheckBadgeIcon,
    InformationCircleIcon,
    PencilIcon,
    PlusCircleIcon,
    PlusIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type SubmitEvent,
} from "react";

import type { ErrorResponse } from "../../api/api";
import ActionButton from "../../components/ActionButtonComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";

import {
    MediaTag,
    type Media,
    type Project,
    type Skill,
} from "../../services/DtoModels";

import MediaService from "../../services/MediaService";
import ProjectsService from "../../services/ProjectsService";
import SkillsService from "../../services/SkillsService";

import InputComponent from "../../components/formelements/InputComponent";
import SelectComponent from "../../components/formelements/SelectComponent";
import TextareaComponent from "../../components/formelements/TextareaComponent";
import ModalComponent from "../../components/ModalComponent";
import MasonryComponent from "../library/MasonryComponent";
import { SkillComponent } from "../skills/SkillComponent";
import ProjectComponent from "./ProjectComponent";

const SELECT_MEDIA_TAGS = [
    MediaTag.THUMBNAIL,
    MediaTag.ARCHITECTURE,
    MediaTag.SCHEMA,
    MediaTag.UI,
];

export default function ProjectsPage() {
    const [emptyProfile, setEmptyProfile] = useState(true);

    const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const { notifications, setNotifications } = useNotifications([
        "info",
        "modal",
        "media",
    ]);

    const infoNotifications = notifications["info"] ?? null;
    const modalNotifications = notifications["modal"] ?? null;
    const mediaNotifications = notifications["media"] ?? null;

    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [allSkills, setAllSkills] = useState<Record<string, Skill[]>>({});

    const [resourceFetchProgress, setResourceFetchProgress] = useState(true);
    const [allResources, setAllResources] = useState<Media[]>([]);

    const [fetchProjectsProgress, setFetchProjectsProgress] = useState(true);

    const [modalType, setModalType] = useState<"new" | "edit" | null>(null);

    const [actionProgress, setActionProgress] = useState<
        | "create-project"
        | "update-project"
        | "delete-project"
        | "add-skill"
        | "remove-skill"
        | null
    >(null);

    const [targetProject, setTargetProject] = useState<Project | null>(null);
    const [draft, setDraft] = useState<Project | null>(null);

    const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
    const [targetSkill, setTargetSkill] = useState<Skill | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

    const [techFilter, setTechFilter] = useState<string | null>(null);

    /*
     * ---------------------------------------------------------
     * Skills Fetching
     * ---------------------------------------------------------
     */

    const fetchAllSkills = useCallback(() => {
        SkillsService.getSkills<Record<string, Skill[]>>()
            .then((resp) => {
                setAllSkills(resp.data);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("info", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            });
    }, [setNotifications]);

    /*
     * ---------------------------------------------------------
     * Media Fetching
     * ---------------------------------------------------------
     */

    const getProjectWithMedia = useCallback(
        async (project: Project): Promise<Project> => {
            try {
                const response = await MediaService.fetchMediaByList<
                    Record<string, Blob>
                >({
                    ids: project.gallery.map((media) => media.id),
                });

                const mediaMap = response.data;

                return {
                    ...project,
                    gallery: project.gallery.map((media) => ({
                        ...media,
                        media: mediaMap[media.id],
                    })),
                };
            } catch (e) {
                const error = e as ErrorResponse;

                setNotifications("info", {
                    type: "error",
                    messages: [error.errorMessage],
                });

                throw error;
            }
        },
        [setNotifications],
    );

    const fetchAllResources = useCallback(() => {
        setResourceFetchProgress(true);

        MediaService.getAllMediaByTagList<Media[]>({
            tags: SELECT_MEDIA_TAGS,
        })
            .then(async (resp) => {
                const allMedia = resp.data;

                if (allMedia.length === 0) {
                    setAllResources([]);
                    return;
                }

                const mediaResponse = await MediaService.fetchMediaByList<
                    Record<string, Blob>
                >({
                    ids: allMedia.map((media) => media.id),
                });

                const mediaMap = mediaResponse.data;

                const preparedResources: Media[] = allMedia.map((media) => ({
                    ...media,
                    media: mediaMap[media.id],
                }));

                setAllResources(preparedResources);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("info", {
                    type: "error",
                    messages: [
                        `We are facing unexpected issues, please try again later. [${e.errorCode}]`,
                    ],
                });
            })
            .finally(() => {
                setResourceFetchProgress(false);
            });
    }, [setNotifications, setAllResources]);

    /*
     * ---------------------------------------------------------
     * Projects Fetching
     * ---------------------------------------------------------
     */

    const fetchAllProjects = useCallback(() => {
        ProjectsService.getProjects<Project[]>()
            .then(async (resp) => {
                const rawProjects = resp.data;

                setEmptyProfile(false);
                fetchAllResources();
                fetchAllSkills();

                if (rawProjects.length === 0) {
                    return;
                }

                const preparedProjects = await Promise.all(
                    rawProjects.map((project) => getProjectWithMedia(project)),
                );

                setAllProjects(preparedProjects);
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

                if (e.errorCode === "500") {
                    setNotifications("info", {
                        type: "error",
                        messages: [
                            `We are facing unexpected issues, Please try again later. [${e.errorCode}]`,
                        ],
                    });

                    return;
                }

                setNotifications("info", {
                    type: "info",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setFetchProjectsProgress(false);
            });
    }, [
        getProjectWithMedia,
        fetchAllResources,
        fetchAllSkills,
        setNotifications,
    ]);

    useEffect(() => {
        fetchAllProjects();
    }, [fetchAllProjects]);

    /*
     * ---------------------------------------------------------
     * Modal helpers
     * ---------------------------------------------------------
     */

    const openNewProjectModal = () => {
        setModalType("new");
        setTargetProject(null);
        setSelectedSkills([]);
        setSelectedMedia([]);
        setTargetSkill(null);
        setTechFilter(null);
        setNotifications("modal", null);
    };

    const openEditProjectModal = (project: Project) => {
        setModalType("edit");

        setTargetProject(project);
        setDraft(project);

        setSelectedMedia(project.gallery);
        setSelectedSkills(project.techStack);
        setTargetSkill(null);
        setTechFilter(null);

        setNotifications("modal", null);
    };

    const closeModal = () => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }

        setModalType(null);
        setTargetProject(null);
        setDraft(null);
        setSelectedMedia([]);
        setSelectedSkills([]);
        setTargetSkill(null);
        setTechFilter(null);
        setActionProgress(null);
        setNotifications("modal", null);
    };

    /*
     * ---------------------------------------------------------
     * Media Management
     * ---------------------------------------------------------
     */

    const addMedia = (media: Media) => {
        const project = targetProject;

        if (!project) {
            setNotifications("modal", {
                type: "error",
                messages: [`project not selected`],
            });
            return;
        }

        if (!media.id) {
            setNotifications("modal", {
                type: "error",
                messages: [`Media not identitfied`],
            });
            return;
        }

        setNotifications("media", {
            type: "info",
            messages: [`Adding ${media.mediaName} to project...`],
            customise: "animate-pulse",
        });
        ProjectsService.addMediaToProject(project.id, media.id)
            .then(() => {
                const updatedProject: Project = {
                    ...project,
                    gallery: [...project.gallery, media],
                };

                setTargetProject(updatedProject);

                setAllProjects((prev) =>
                    prev.map((item) =>
                        item.id === project.id ? updatedProject : item,
                    ),
                );

                setSelectedMedia((prev) => {
                    if (prev.some((item) => item.id === media.id)) {
                        return prev;
                    }

                    return [...prev, media];
                });

                setNotifications("media", {
                    type: "success",
                    messages: [`@${media.mediaName} added successfully.`],
                });

                if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current);
                }

                notificationTimeoutRef.current = setTimeout(() => {
                    setNotifications("media", null);
                }, 5000);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("media", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            });
    };

    const removeMedia = (media: Media) => {
        if (!targetProject) {
            setNotifications("media", {
                type: "error",
                messages: ["Target not identified."],
            });

            return;
        }
        if (!targetProject.gallery.some((md) => md.id)) {
            setNotifications("media", {
                type: "error",
                messages: ["Media not in project."],
            });

            return;
        }

        setNotifications("media", {
            type: "info",
            messages: [`Removing ${media.mediaName} from project...`],
            customise: "animate-pulse",
        });

        ProjectsService.removeMediaFromProject(targetProject.id, media.id)
            .then(() => {
                const updatedProject: Project = {
                    ...targetProject,
                    gallery: targetProject.gallery.filter(
                        (item) => item.id !== media.id,
                    ),
                };

                setTargetProject(updatedProject);

                setSelectedMedia((prev) =>
                    prev.filter((item) => item.id !== media.id),
                );

                setAllProjects((prev) =>
                    prev.map((project) =>
                        project.id === updatedProject.id
                            ? updatedProject
                            : project,
                    ),
                );

                setNotifications("media", {
                    type: "success",
                    messages: [`@${media.mediaName} removed successfully.`],
                });

                if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current);
                }

                notificationTimeoutRef.current = setTimeout(() => {
                    setNotifications("media", null);
                }, 5000);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("media", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(null);
            });
    };

    /*
     * ---------------------------------------------------------
     * Skills Management
     * ---------------------------------------------------------
     */

    const addSkill = () => {
        if (!targetSkill) {
            setNotifications("modal", {
                type: "error",
                messages: ["Skill not selected!"],
            });

            return;
        }

        /*
         * New project:
         * only modify local selection.
         */
        if (modalType === "new") {
            setSelectedSkills((prev) => {
                if (prev.some((skill) => skill.id === targetSkill.id)) {
                    return prev;
                }

                return [...prev, targetSkill];
            });

            setTargetSkill(null);
            return;
        }

        /*
         * Existing project.
         */
        if (!targetProject) {
            setNotifications("modal", {
                type: "error",
                messages: ["Project not identified!"],
            });

            return;
        }

        setActionProgress("add-skill");

        ProjectsService.addSkillToProject(targetProject.id, targetSkill.id)
            .then(() => {
                const updatedProject: Project = {
                    ...targetProject,
                    techStack: [...targetProject.techStack, targetSkill],
                };

                setTargetProject(updatedProject);

                setAllProjects((prev) =>
                    prev.map((project) =>
                        project.id === updatedProject.id
                            ? updatedProject
                            : project,
                    ),
                );

                setNotifications("modal", {
                    type: "success",
                    messages: [`@${targetSkill.name} added successfully.`],
                });

                setTargetSkill(null);

                if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current);
                }

                notificationTimeoutRef.current = setTimeout(() => {
                    setNotifications("modal", null);
                }, 5000);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("modal", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(null);
            });
    };

    const removeSkill = (skill: Skill) => {
        if (modalType === "new") {
            setSelectedSkills((prev) =>
                prev.filter((item) => item.id !== skill.id),
            );

            return;
        }

        if (!targetProject) {
            setNotifications("modal", {
                type: "error",
                messages: ["Project not identified!"],
            });

            return;
        }

        setActionProgress("remove-skill");

        ProjectsService.removeSkillFromProject(targetProject.id, skill.id)
            .then(() => {
                const updatedProject: Project = {
                    ...targetProject,
                    techStack: targetProject.techStack.filter(
                        (item) => item.id !== skill.id,
                    ),
                };

                setTargetProject(updatedProject);

                setAllProjects((prev) =>
                    prev.map((project) =>
                        project.id === updatedProject.id
                            ? updatedProject
                            : project,
                    ),
                );

                setNotifications("modal", {
                    type: "success",
                    messages: [`@${skill.name} removed successfully.`],
                });

                if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current);
                }

                notificationTimeoutRef.current = setTimeout(() => {
                    setNotifications("modal", null);
                }, 5000);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("modal", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(null);
            });
    };

    /*
     * ---------------------------------------------------------
     * Project Creation
     * ---------------------------------------------------------
     */

    const createProject = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setActionProgress("create-project");

        const errors: string[] = [];

        if (selectedSkills.length === 0) {
            errors.push("Skills Not selected!");
        }

        if (selectedMedia.length === 0) {
            errors.push("Media Not selected!");
        }

        const formData = new FormData(e.currentTarget);

        const title = String(formData.get("title") ?? "").trim();
        const gitUrl = String(formData.get("git") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();

        if (!title) {
            errors.push("Title is required");
        }

        if (!gitUrl) {
            errors.push("Git repo URL is required");
        }

        if (!description) {
            errors.push("Description is required");
        }

        if (errors.length > 0) {
            setNotifications("modal", {
                type: "error",
                messages: errors,
            });

            setActionProgress(null);
            return;
        }

        ProjectsService.createProject<Project>({
            title,
            gitUrl,
            description,
            techStack: selectedSkills.map((skill) => skill.id),
            gallery: selectedMedia.map((media) => media.id),
        })
            .then((resp) => {
                setNotifications("modal", {
                    type: "success",
                    messages: [
                        `Project @${resp.data.title} created successfully.`,
                    ],
                });

                const data = resp.data;
                const newProject = {
                    ...data,
                    gallery: data.gallery.map((md) =>
                        allResources.find((rs) => rs.id === md.id),
                    ),
                } as Project;

                setAllProjects((prev) => [...prev, newProject]);

                setDraft(null);
                setSelectedSkills([]);
                setSelectedMedia([]);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("modal", {
                    type: "error",
                    messages:
                        e.validationErrors?.length > 0
                            ? e.validationErrors.map(
                                  (ve) => `${ve.field} ${ve.message}`,
                              )
                            : [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(null);
            });
    };

    /*
     * ---------------------------------------------------------
     * Project Update
     * ---------------------------------------------------------
     */
    const updateProject = () => {
        const errors = [];
        console.log(draft);

        if (!draft) {
            setNotifications("modal", {
                type: "error",
                messages: ["draft not updated."],
            });
            return;
        }
        if (!draft.id) {
            errors.push("Id not identitifed");
        }
        if (!draft.title) {
            errors.push("Title is required");
        }
        if (!draft.description) {
            errors.push("Description is required");
        }
        if (!draft.gitUrl) {
            errors.push("Git Repo is required");
        }

        if (errors.length != 0) {
            setNotifications("modal", {
                type: "error",
                messages: errors,
            });
            return;
        }

        setActionProgress("update-project");
        ProjectsService.updateProject<Project>({
            id: draft!.id,
            title: draft!.title,
            gitUrl: draft!.gitUrl,
        })
            .then((resp) => {
                const data = resp.data;
                setNotifications("modal", {
                    type: "success",
                    messages: [`Project Metadata updated successfully.`],
                });
                setTargetProject({
                    ...draft,
                    title: data.title,
                    description: data.description,
                    gitUrl: data.gitUrl,
                });
                if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current);
                }
                notificationTimeoutRef.current = setTimeout(() => {
                    setNotifications("modal", null);
                }, 5000);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("modal", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(null);
            });
    };

    /*
     * ---------------------------------------------------------
     * Deleting Project
     * ---------------------------------------------------------
     */
    function deleteProject(project: Project) {
        if (!project.id) {
            setNotifications("info", {
                type: "info",
                messages: ["Project not identified."],
            });
            setTargetProject(null);
            return;
        }

        if (
            window.confirm(`Are you sure deleting @${project.title} project?`)
        ) {
            setActionProgress("delete-project");
            ProjectsService.deleteProject(project.id)
                .then(() => {
                    setNotifications("info", {
                        type: "success",
                        messages: [
                            `Project @${project.title} deleted successfully.`,
                        ],
                    });
                    setAllProjects((prev) =>
                        prev.filter((prj) => prj.id != project.id),
                    );
                    if (notificationTimeoutRef.current) {
                        clearTimeout(notificationTimeoutRef.current);
                    }

                    notificationTimeoutRef.current = setTimeout(() => {
                        setNotifications("info", null);
                    }, 5000);
                })
                .catch((e: ErrorResponse) => {
                    setNotifications("info", {
                        type: "error",
                        messages: [e.errorMessage],
                    });
                })
                .finally(() => {
                    setTargetProject(null);
                    setActionProgress(null);
                });
        }
    }

    const currentProjectSkills =
        modalType === "new" ? selectedSkills : (targetProject?.techStack ?? []);

    const currentProjectMedia =
        modalType === "edit" ? (targetProject?.gallery ?? []) : selectedMedia;

    return (
        <>
            <SectionLayoutComponent
                title="Projects"
                description="you can Manage your projects from this page."
                spinner={{
                    isLoading: fetchProjectsProgress,
                    text: "Fetching your projects...",
                }}
                actionEvents={[
                    {
                        icon: PlusCircleIcon,
                        text: "New Project",
                        disabled: emptyProfile,
                        onClick: openNewProjectModal,
                    },
                ]}
            >
                <div className="space-y-3">
                    {infoNotifications && (
                        <div>
                            <Notification {...infoNotifications} />
                        </div>
                    )}

                    {allProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {allProjects.map((project) => (
                                <ProjectComponent
                                    key={project.id}
                                    project={project}
                                    actionButtons={[
                                        {
                                            icon: PencilIcon,
                                            className: "p-1",
                                            onClick() {
                                                openEditProjectModal(project);
                                            },
                                        },
                                        {
                                            icon: TrashIcon,
                                            className:
                                                "p-1 btn-secondary text-rose-400",
                                            onClick() {
                                                setTargetProject(project);
                                                deleteProject(project);
                                            },
                                            spinner: {
                                                isLoading:
                                                    actionProgress ===
                                                        "delete-project" &&
                                                    project.id ===
                                                        targetProject?.id,
                                            },
                                        },
                                    ]}
                                />
                            ))}
                        </div>
                    ) : (
                        !emptyProfile &&
                        !fetchProjectsProgress && (
                            <Notification
                                type="info"
                                messages={["No Projects to display"]}
                            />
                        )
                    )}
                </div>
            </SectionLayoutComponent>

            <ModalComponent
                title={modalType === "new" ? "New Project" : "Edit Project"}
                isOpen={modalType !== null}
                onClose={closeModal}
                maxWidthClass="max-w-6xl"
            >
                {modalNotifications && <Notification {...modalNotifications} />}

                <form
                    onSubmit={
                        modalType === "new"
                            ? createProject
                            : (e) => e.preventDefault()
                    }
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 *:px-1"
                >
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="text-md">
                            Title
                        </label>

                        <InputComponent
                            name="title"
                            id="title"
                            placeholder="Project Title"
                            defaultValue={
                                draft?.title ?? targetProject?.title ?? ""
                            }
                            onChange={(e) => {
                                setDraft((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              title: e.target.value,
                                          }
                                        : null,
                                );
                            }}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 md:row-span-2">
                        <label htmlFor="description" className="text-md">
                            Description
                        </label>

                        <TextareaComponent
                            name="description"
                            id="description"
                            placeholder="..."
                            defaultValue={
                                draft?.description ??
                                targetProject?.description ??
                                ""
                            }
                            onChange={(e) => {
                                setDraft((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              description: e.target.value,
                                          }
                                        : null,
                                );
                            }}
                            required
                        />
                    </div>

                    {/* Git URL */}
                    <div>
                        <label htmlFor="git" className="text-md">
                            GitHub Link
                        </label>

                        <InputComponent
                            type="url"
                            name="git"
                            id="git"
                            placeholder="Repository Link"
                            defaultValue={
                                draft?.gitUrl ?? targetProject?.gitUrl ?? ""
                            }
                            onChange={(e) => {
                                setDraft((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              gitUrl: e.target.value,
                                          }
                                        : null,
                                );
                            }}
                            required
                        />
                    </div>

                    {/* Update metadata Button */}
                    {modalType === "edit" && (
                        <>
                            <div className="col-span-full">
                                <ActionButton
                                    text="Update Project"
                                    icon={CheckBadgeIcon}
                                    className="ml-auto mt-2"
                                    onClick={updateProject}
                                    spinner={{
                                        isLoading:
                                            actionProgress === "update-project",
                                    }}
                                />
                            </div>

                            <hr className="col-span-full border-t my-2" />
                        </>
                    )}

                    {/* Skills management */}
                    <div className="space-y-2">
                        <label className="text-md">Manage Skills</label>
                        <span className="flex items-center gap-2 text-sm">
                            <InformationCircleIcon className="size-4" />
                            can be managed from skills section
                        </span>

                        <SelectComponent
                            options={Object.keys(allSkills).map((tech) => ({
                                value: tech,
                            }))}
                            value={techFilter ?? ""}
                            onChange={(e) => {
                                setTechFilter(e.target.value || null);
                            }}
                            className="bg-section-theme"
                            emptyOption="Filter By Technology"
                        />

                        <SelectComponent
                            key={techFilter ?? "all"}
                            options={(techFilter
                                ? (allSkills[techFilter] ?? [])
                                : Object.values(allSkills).flat()
                            ).map((skill) => ({
                                value: skill.id,
                                text: skill.name,
                            }))}
                            className="bg-section-theme"
                            emptyOption="Choose Skill"
                            name="addSkill"
                            value={targetSkill?.id ?? ""}
                            onChange={(e) => {
                                const skill = Object.values(allSkills)
                                    .flat()
                                    .find((item) => item.id === e.target.value);

                                setTargetSkill(skill ?? null);
                            }}
                        />

                        <ActionButton
                            icon={PlusCircleIcon}
                            text="Add Skill"
                            className="ml-auto justify-center flex-1"
                            onClick={addSkill}
                            spinner={{
                                isLoading: actionProgress === "add-skill",
                            }}
                        />
                    </div>

                    {/* Selected skills */}
                    <div className="md:col-span-2">
                        <h4 className="w-full">Project Skills</h4>

                        {modalType === "new" &&
                            currentProjectSkills.length === 0 && (
                                <Notification
                                    type="info"
                                    messages={["No Skill selected"]}
                                    customise="w-full"
                                />
                            )}

                        <div className="flex flex-wrap gap-1">
                            {currentProjectSkills.map((skill) => (
                                <SkillComponent
                                    key={skill.id}
                                    skill={skill}
                                    actionBtns={[
                                        {
                                            icon: XMarkIcon,
                                            className:
                                                "p-1 btn-secondary text-rose-500",
                                            customiseIcon: "size-3.5!",
                                            title: `Remove ${skill.name} from this project`,
                                            onClick: () => removeSkill(skill),
                                        },
                                    ]}
                                    className="p-1.5! pl-2! border-none hover:bg-background/60 dark:hover:bg-transparent"
                                    hideTech
                                />
                            ))}
                        </div>
                    </div>

                    {/* Media */}
                    <hr className="border-t col-span-full" />

                    <h3 className="col-span-full">
                        Choose Media to{" "}
                        {modalType === "edit" ? "Update" : "Create"} your
                        project
                    </h3>

                    <div className="col-span-full">
                        <MasonryComponent
                            resources={allResources}
                            spinner={{
                                isLoading: resourceFetchProgress,
                                text: "Fetching Resources...",
                            }}
                            searchOptions={SELECT_MEDIA_TAGS.map(
                                (mediaTag) => ({
                                    value: mediaTag,
                                }),
                            )}
                            selectedItems={currentProjectMedia}
                            handleImageClick={(media) => {
                                if (modalType === "edit") {
                                    setSelectedMedia([media]);
                                    return;
                                }

                                setSelectedMedia((prev) => {
                                    if (
                                        prev.some(
                                            (item) => item.id === media.id,
                                        )
                                    ) {
                                        return prev.filter(
                                            (item) => item.id !== media.id,
                                        );
                                    }

                                    return [...prev, media];
                                });
                            }}
                            actionButtons={[
                                {
                                    text: "Refresh",
                                    icon: ArrowPathIcon,
                                    onClick() {
                                        fetchAllResources();
                                    },
                                },
                                ...(modalType === "new"
                                    ? [
                                          {
                                              text: "Create Project",
                                              icon: CheckBadgeIcon,
                                              type: "submit" as const,
                                              spinner: {
                                                  isLoading:
                                                      actionProgress ===
                                                      "create-project",
                                              },
                                          },
                                      ]
                                    : []),
                            ]}
                            notifications={mediaNotifications ?? undefined}
                            handleNewUpload={(media) => {
                                setAllResources((prev) => [media, ...prev]);
                            }}
                            multiSelect={{
                                conditionalCheckbox: modalType === "edit",
                                showWhen: true,
                                alwaysHide: modalType === "edit",
                            }}
                            multiSelectOptions={
                                modalType === "edit"
                                    ? [
                                          {
                                              icon: PlusIcon,
                                              title: "Add to Gallery",
                                              onClick(media) {
                                                  addMedia(media as Media);
                                              },
                                              showWhenIncluded: false,
                                          },
                                          {
                                              icon: XMarkIcon,
                                              title: "Remove from Gallery",
                                              className: "btn-danger",
                                              onClick(media) {
                                                  removeMedia(media as Media);
                                              },
                                              showWhenIncluded: true,
                                          },
                                      ]
                                    : []
                            }
                            allowUpload
                        />
                    </div>
                </form>
            </ModalComponent>
        </>
    );
}
