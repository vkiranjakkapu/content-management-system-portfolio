import {
    CheckBadgeIcon,
    CheckCircleIcon,
    PencilIcon,
    PlusCircleIcon,
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
import InputComponent from "../../components/formelements/InputComponent";
import SelectComponent from "../../components/formelements/SelectComponent";
import ModalComponent from "../../components/ModalComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";

import {
    SkillRequestType,
    type Skill,
    type SkillResponse,
    type Technology,
} from "../../services/DtoModels";

import SkillsService from "../../services/SkillsService";
import { SkillComponent } from "./SkillComponent";

export default function SkillsPage() {
    const { notifications, setNotifications } = useNotifications([
        "info",
        "modal",
    ]);

    const infoNotifications = notifications["info"] ?? null;
    const modalNotifications = notifications["modal"] ?? null;

    const [emptyProfile, setEmptyProfile] = useState<boolean>(true);

    const [allSkills, setAllSkills] = useState<SkillResponse>({});
    const [fetchProgress, setFetchProgress] = useState<boolean>(true);

    const [reqTypeField, setReqTypeField] = useState<SkillRequestType>(
        SkillRequestType.USE_EXISTING_TECH,
    );
    const fetchSkills = useCallback(() => {
        SkillsService.getSkills<SkillResponse>()
            .then((resp) => {
                setAllSkills(resp.data);
                setEmptyProfile(false);
                if (Object.entries(resp.data).length == 0) {
                    setReqTypeField(SkillRequestType.CREATE_NEW_TECH);
                }
            })
            .catch((e: ErrorResponse) => {
                if (e.errorCode === "BUS-2001") {
                    setEmptyProfile(true);
                    setAllSkills({});
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
                setFetchProgress(false);
            });
    }, [setNotifications]);

    const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
    const [techFetchProgress, setTechFetchProgress] = useState<boolean>(true);

    const fetchTechnologies = useCallback(() => {
        SkillsService.getTechnologies<Technology[]>()
            .then((resp) => {
                setAllTechnologies(resp.data);
                if (resp.data.length > 0) {
                    setReqTypeField(SkillRequestType.USE_EXISTING_TECH);
                }
            })
            .catch((e: ErrorResponse) => {
                setNotifications("modal", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setTechFetchProgress(false);
            });
    }, [setNotifications]);

    useEffect(() => {
        fetchSkills();
        fetchTechnologies();
    }, [fetchSkills, fetchTechnologies]);

    const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [modalMode, setModalMode] = useState<"new" | "edit" | null>(null);
    const [actionProgress, setActionProgress] = useState<boolean>(false);
    const [targetSkill, setTargetSkill] = useState<Skill | null>(null);

    function openNewSkillModal() {
        setTargetSkill(null);
        setNotifications("modal", null);
        setModalMode("new");
    }

    function openEditSkillModal(skill: Skill) {
        setTargetSkill(skill);
        setNotifications("modal", null);
        setModalMode("edit");
    }

    function closeSkillModal() {
        setModalMode(null);
        setTargetSkill(null);
        setNotifications("modal", null);
    }

    function handleSkillSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formTarget = e.currentTarget;
        const formData = new FormData(formTarget);

        const skillName = String(formData.get("skillName") ?? "");

        const requestType = (formData.get("requestType") ??
            SkillRequestType.USE_EXISTING_TECH) as SkillRequestType;

        const tech = String(formData.get("tech") ?? "");

        if (modalMode === "edit" && !targetSkill?.id) {
            setNotifications("modal", {
                type: "error",
                messages: ["Skill Id not assigned"],
            });
            return;
        }

        if (
            requestType === SkillRequestType.CREATE_NEW_TECH &&
            (!tech || tech === "")
        ) {
            setNotifications("modal", {
                type: "error",
                messages: ["Technology name must be entered. to proceed."],
            });
            return;
        }

        setActionProgress(true);

        const promise =
            modalMode === "new"
                ? SkillsService.createSkill<Skill>({
                      type: requestType,
                      name: skillName,
                      tech,
                  })
                : SkillsService.updateSkill<Skill>({
                      id: targetSkill!.id,
                      name: skillName,
                      techId: tech,
                  });

        promise
            .then((resp) => {
                setNotifications("modal", {
                    type: "success",
                    messages: [
                        `Skill @${skillName} ${
                            modalMode === "edit" ? "updated" : "created"
                        } successfully.`,
                    ],
                });

                fetchSkills();
                fetchTechnologies();

                if (modalMode === "new") {
                    formTarget.reset();
                } else {
                    setTargetSkill(resp.data);
                }
            })
            .catch((e: ErrorResponse) => {
                setNotifications("modal", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(false);
            });
    }

    const [targetTech, setTargetTech] = useState<Technology | null>(null);
    const [techUpdateInProgress, setTechUpdateInProgress] =
        useState<boolean>(false);
    function handleUpdateTechName(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!targetTech) {
            return;
        }
        setTechUpdateInProgress(true);
        const formData = new FormData(e.currentTarget);
        const techName = String(formData.get("techName") ?? "");

        SkillsService.updateTech<Technology>({
            id: targetTech.id,
            name: techName,
        })
            .then((resp) => {
                setNotifications("info", {
                    type: "success",
                    messages: [
                        `Technology name updated to ${resp.data.name} successfully.`,
                    ],
                });
                setAllSkills((prevSkills) => {
                    const updatedEntries = Object.entries(prevSkills).map(
                        ([tech, skills]) => {
                            if (tech === techName) {
                                return [
                                    techName,
                                    skills.map((sk) => ({
                                        ...sk,
                                        tech: { ...sk.tech, name: techName },
                                    })),
                                ];
                            }
                            return [tech, skills];
                        },
                    );

                    return Object.fromEntries(updatedEntries);
                });
                setAllTechnologies((prevTechs) =>
                    prevTechs.map((t) =>
                        t.id === targetTech.id ? { ...t, name: techName } : t,
                    ),
                );
                setTargetTech(null);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("info", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setTechUpdateInProgress(false);
            });
    }

    const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
    function deleteSkill(skill: Skill) {
        if (window.confirm(`Are you sure deleting @${skill.name}?`)) {
            setDeleteInProgress(true);
            SkillsService.deleteSkill(skill.id)
                .then(() => {
                    setAllSkills((prevSkills) => {
                        const updatedEntries = Object.entries(prevSkills).map(
                            ([tech, skills]) => {
                                if (tech === skill.tech.name) {
                                    return [
                                        skill.tech.name,
                                        skills.filter(
                                            (sk) => sk.id !== skill.id,
                                        ),
                                    ];
                                }
                                return [tech, skills];
                            },
                        );

                        return Object.fromEntries(updatedEntries);
                    });
                    setNotifications("info", {
                        type: "success",
                        messages: [
                            `skill @${skill.name} deleted successfully.`,
                        ],
                    });

                    if (timeOutRef.current) {
                        clearTimeout(timeOutRef.current);
                    }
                    timeOutRef.current = setTimeout(() => {
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
                    setDeleteInProgress(false);
                    setTargetSkill(null);
                });
        }
    }

    return (
        <>
            <SectionLayoutComponent
                title="Skills"
                description="you can manage your skills from this page"
                spinner={{
                    isLoading: fetchProgress,
                    text: "Fetching you skills...",
                }}
                actionEvents={[
                    {
                        text: "New Skill",
                        icon: PlusCircleIcon,
                        onClick() {
                            openNewSkillModal();
                        },
                        disabled: emptyProfile,
                    },
                ]}
            >
                <div className="space-y-3">
                    {infoNotifications && (
                        <div>
                            <Notification {...infoNotifications} />
                        </div>
                    )}

                    {!fetchProgress && Object.entries(allSkills).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 *:rounded-md *:shadow-sm">
                            {Object.entries(allSkills).map(
                                ([category, skills]) => (
                                    <div
                                        key={category}
                                        className="@container bg-section-theme p-2 border space-y-2"
                                    >
                                        <h3 className="text-lg *:flex *:items-center *:gap-2">
                                            {targetTech?.name === category ? (
                                                <form
                                                    onSubmit={
                                                        handleUpdateTechName
                                                    }
                                                    className="gap-1!"
                                                >
                                                    <InputComponent
                                                        defaultValue={category}
                                                        name="techName"
                                                        className="text-md"
                                                        required
                                                    />
                                                    <div className="flex rounded outline outline-offset-1 outline-primary *:outline-none *:m-0 *:py-1.5">
                                                        <ActionButton
                                                            className="text-sm rounded-r-none"
                                                            icon={
                                                                CheckCircleIcon
                                                            }
                                                            spinner={{
                                                                isLoading:
                                                                    techUpdateInProgress,
                                                            }}
                                                            type="submit"
                                                            disabled={
                                                                techUpdateInProgress
                                                            }
                                                        />
                                                        <ActionButton
                                                            className="text-sm btn-secondary rounded-l-none"
                                                            icon={XMarkIcon}
                                                            onClick={() => {
                                                                setTargetTech(
                                                                    null,
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </form>
                                            ) : (
                                                <span>
                                                    {category}
                                                    <PencilIcon
                                                        key={
                                                            allTechnologies.length
                                                        }
                                                        className="size-4"
                                                        onClick={() => {
                                                            setTargetTech(
                                                                allTechnologies.find(
                                                                    (tech) =>
                                                                        tech.name ===
                                                                        category,
                                                                )!,
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            )}
                                        </h3>
                                        <ul className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-2">
                                            {skills.length === 0 && (
                                                <Notification
                                                    type="info"
                                                    messages={[
                                                        "No skills under this technology.",
                                                    ]}
                                                />
                                            )}
                                            {skills.map((skill) => (
                                                <SkillComponent
                                                    key={skill.id}
                                                    skill={skill}
                                                    actionBtns={[
                                                        {
                                                            icon: PencilIcon,
                                                            className:
                                                                "p-2 rounded-full",
                                                            onClick() {
                                                                openEditSkillModal(
                                                                    skill,
                                                                );
                                                            },
                                                        },
                                                        {
                                                            icon: TrashIcon,
                                                            className:
                                                                "p-2 rounded-full btn-secondary text-rose-400",
                                                            spinner: {
                                                                isLoading:
                                                                    targetSkill?.id ===
                                                                        skill.id &&
                                                                    deleteInProgress,
                                                            },
                                                            onClick() {
                                                                setTargetSkill(
                                                                    skill,
                                                                );
                                                                deleteSkill(
                                                                    skill,
                                                                );
                                                            },
                                                        },
                                                    ]}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        !emptyProfile && (
                            <Notification
                                type="info"
                                messages={["No Skills added yet."]}
                            />
                        )
                    )}
                </div>
            </SectionLayoutComponent>

            <ModalComponent
                title={
                    modalMode === "edit"
                        ? "Update Skill"
                        : "Add New Skill Category"
                }
                isOpen={modalMode != null}
                onClose={closeSkillModal}
            >
                <form
                    onSubmit={handleSkillSubmit}
                    className="space-y-3 *:first:pt-1 *:px-1 *:pr-1.5 *:last:pb-0"
                >
                    {modalNotifications && (
                        <div>
                            <Notification {...modalNotifications} />
                        </div>
                    )}

                    <div className="">Enter your skill name:</div>
                    <div>
                        <InputComponent
                            type="text"
                            id="skillName"
                            name="skillName"
                            placeholder="Skill Name"
                            defaultValue={targetSkill?.name}
                            required
                        />
                    </div>
                    <div className="">Choose a technology from below:</div>
                    {modalMode === "new" && (
                        <>
                            <div>
                                <SelectComponent
                                    key={allTechnologies.length}
                                    options={Object.keys(SkillRequestType).map(
                                        (type) => ({
                                            value: type,
                                            disabled:
                                                type ===
                                                    SkillRequestType.USE_EXISTING_TECH &&
                                                allTechnologies.length === 0,
                                        }),
                                    )}
                                    defaultValue={
                                        allTechnologies.length === 0
                                            ? SkillRequestType.CREATE_NEW_TECH
                                            : SkillRequestType.USE_EXISTING_TECH
                                    }
                                    id="requestType"
                                    name="requestType"
                                    onChange={(e) => {
                                        setReqTypeField(e.target.value);
                                    }}
                                    required
                                />
                            </div>

                            {reqTypeField ===
                                SkillRequestType.CREATE_NEW_TECH && (
                                <div id="newTech">
                                    <InputComponent
                                        type="text"
                                        id="tech"
                                        name="tech"
                                        placeholder="Technology Name"
                                        required
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {reqTypeField === SkillRequestType.USE_EXISTING_TECH && (
                        <div>
                            <SelectComponent
                                options={allTechnologies.map((tech) => ({
                                    value: tech.id,
                                    text: tech.name,
                                }))}
                                emptyOption={
                                    techFetchProgress
                                        ? "Loading..."
                                        : allTechnologies.length === 0
                                          ? "Created will be attached"
                                          : "Select"
                                }
                                name="tech"
                                id="tech"
                                defaultValue={
                                    modalMode === "edit"
                                        ? targetSkill?.tech?.id
                                        : undefined
                                }
                                required
                            />
                        </div>
                    )}

                    <div>
                        <ActionButton
                            type="submit"
                            text={modalMode === "new" ? "Create" : "Update"}
                            icon={CheckBadgeIcon}
                            className="ml-auto"
                            spinner={{
                                isLoading: actionProgress,
                            }}
                            disabled={techFetchProgress || actionProgress}
                        />
                    </div>
                </form>
            </ModalComponent>
        </>
    );
}
