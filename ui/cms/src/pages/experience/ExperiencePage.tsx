import {
    CheckBadgeIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import {
    useEffect,
    useMemo,
    useState,
    type SubmitEvent,
} from "react";

import type { ErrorResponse } from "../../api/api";
import ActionButton from "../../components/ActionButtonComponent";
import InputComponent from "../../components/formelements/InputComponent";
import ModalComponent from "../../components/ModalComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import usePagination from "../../components/pagination/usePagination";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import TableComponent from "../../components/TableComponent";
import ExperienceService from "../../services/ExperienceService";
import type { Experience } from "../../services/DtoModels";

type ExperienceForm = {
    id?: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isWorking: boolean;
};

const emptyForm: ExperienceForm = {
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    isWorking: false,
};

function toForm(experience: Experience): ExperienceForm {
    return {
        id: experience.id,
        company: experience.company ?? "",
        position: experience.position ?? "",
        startDate: experience.startDate ?? "",
        endDate: experience.endDate ?? "",
        isWorking: experience.working,
    };
}

export default function ExperiencePage() {
    const [modalOpen, setModalOpen] = useState<"new" | "update" | null>(null);
    const [experience, setExperience] = useState<ExperienceForm>(emptyForm);
    const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
    const [emptyProfile, setEmptyProfile] = useState(true);
    const [fetchProgress, setFetchProgress] = useState(true);
    const [actionProgress, setActionProgress] = useState(false);
    const [queryString, setQueryString] = useState("");

    const { notifications, setNotifications, resetNotifications } =
        useNotifications(["new", "update", "info"]);

    const creationNotifications = notifications["new"] ?? null;
    const updateNotifications = notifications["update"] ?? null;
    const infoNotifications = notifications["info"] ?? null;

    useEffect(() => {
        ExperienceService.getExperiences<Experience[]>()
            .then((resp) => {
                setAllExperiences(resp.data);
                setEmptyProfile(false);
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
                        e.errorCode
                            ? `We are facing unexpected issues, please try again later. [${e.errorCode}]`
                            : e.errorMessage,
                    ],
                });
            })
            .finally(() => {
                setFetchProgress(false);
            });
    }, [setNotifications]);

    const queryResults = useMemo(() => {
        const query = queryString.trim().toLowerCase();

        if (!query) {
            return allExperiences;
        }

        return allExperiences.filter(
            (item) =>
                item.company.toLowerCase().includes(query) ||
                item.position.toLowerCase().includes(query),
        );
    }, [allExperiences, queryString]);

    const pagination = usePagination(queryResults, 8);

    const closeModal = () => {
        setModalOpen(null);
        resetNotifications("new");
        resetNotifications("update");
        setExperience(emptyForm);
    };

    const openNewExperienceModal = () => {
        resetNotifications("new");
        resetNotifications("update");
        setExperience(emptyForm);
        setModalOpen("new");
    };

    const openUpdateExperienceModal = (target: Experience) => {
        resetNotifications("new");
        resetNotifications("update");
        setExperience(toForm(target));
        setModalOpen("update");
    };

    const submitExperience = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const notificationKey = modalOpen === "new" ? "new" : "update";
        resetNotifications(notificationKey);

        const errors: string[] = [];

        if (!experience.company.trim()) {
            errors.push("Company is required.");
        }

        if (!experience.position.trim()) {
            errors.push("Position is required.");
        }

        if (!experience.startDate) {
            errors.push("Start date is required.");
        }

        if (!experience.isWorking && !experience.endDate) {
            errors.push("End date is required for a completed experience.");
        }

        if (
            experience.startDate &&
            experience.endDate &&
            !experience.isWorking &&
            experience.endDate < experience.startDate
        ) {
            errors.push("End date cannot be before the start date.");
        }

        if (errors.length > 0) {
            setNotifications(notificationKey, {
                type: "error",
                messages: errors,
            });
            return;
        }

        setActionProgress(true);

        const payload = {
            company: experience.company.trim(),
            position: experience.position.trim(),
            startDate: experience.startDate,
            ednDate: experience.isWorking ? undefined : experience.endDate,
            isWorking: experience.isWorking,
        };

        const request =
            modalOpen === "new"
                ? ExperienceService.createExperience<Experience>(payload)
                : ExperienceService.updateExperience<Experience>({
                      expId: experience.id!,
                      ...payload,
                  });

        request
            .then((resp) => {
                if (modalOpen === "new") {
                    setAllExperiences((prev) => [resp.data, ...prev]);
                    setNotifications("new", {
                        type: "success",
                        messages: [
                            `Experience @${resp.data.position} at ${resp.data.company} created successfully.`,
                        ],
                    });
                } else {
                    setAllExperiences((prev) =>
                        prev.map((item) =>
                            item.id === resp.data.id ? resp.data : item,
                        ),
                    );
                    setNotifications("update", {
                        type: "success",
                        messages: [
                            `Experience @${resp.data.position} at ${resp.data.company} updated successfully.`,
                        ],
                    });
                }

                setExperience(toForm(resp.data));
            })
            .catch((e: ErrorResponse) => {
                setNotifications(notificationKey, {
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
                setActionProgress(false);
            });
    };

    const deleteExperience = (target: Experience) => {
        if (!target.id) {
            return;
        }

        if (
            !window.confirm(
                `Are you sure deleting @${target.position} at ${target.company}?`,
            )
        ) {
            return;
        }

        setActionProgress(true);

        ExperienceService.deleteExperience(target.id)
            .then(() => {
                setAllExperiences((prev) =>
                    prev.filter((item) => item.id !== target.id),
                );
                setNotifications("info", {
                    type: "success",
                    messages: [
                        `Experience @${target.position} at ${target.company} deleted successfully.`,
                    ],
                });
            })
            .catch((e: ErrorResponse) => {
                setNotifications("info", {
                    type: "error",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(false);
            });
    };

    return (
        <SectionLayoutComponent
            title="Experience"
            description="Manage your professional experiences from this page."
            spinner={{
                isLoading: fetchProgress,
                text: "Fetching your experiences...",
            }}
            actionEvents={[
                {
                    icon: PlusCircleIcon,
                    text: "New Experience",
                    disabled: emptyProfile || actionProgress,
                    onClick: openNewExperienceModal,
                },
            ]}
            search={
                allExperiences.length > 0
                    ? {
                          type: "text",
                          placeholder: "Search by company or position",
                          value: queryString,
                          onChange: (event) =>
                              setQueryString(event.target.value),
                      }
                    : undefined
            }
            pagination={pagination}
        >
            {infoNotifications && (
                <Notification
                    type={infoNotifications.type}
                    messages={infoNotifications.messages}
                    customise="mb-3 border-0 capitalize"
                />
            )}

            {!emptyProfile && (
                <TableComponent
                    columns={[
                        {
                            key: "company",
                            alias: "Company",
                        },
                        {
                            key: "position",
                            alias: "Position",
                        },
                        {
                            key: "startDate",
                            alias: "Start Date",
                        },
                        {
                            key: "endDate",
                            alias: "End Date",
                        },
                        {
                            key: "working",
                            alias: "Current",
                        },
                    ]}
                    body={pagination.currentItems}
                    loading={{
                        showSpinner: fetchProgress,
                        spinner: { text: "Fetching experiences..." },
                    }}
                    actionEvents={[
                        {
                            title: "Edit",
                            clickEvent: {
                                icon: PencilIcon,
                                onClick: openUpdateExperienceModal,
                            },
                        },
                        {
                            title: "Delete",
                            clickEvent: {
                                icon: TrashIcon,
                                className: "text-rose-500",
                                onClick: deleteExperience,
                            },
                        },
                    ]}
                />
            )}

            <ModalComponent
                title={
                    modalOpen === "new"
                        ? "Add Experience"
                        : "Update Experience"
                }
                isOpen={modalOpen !== null}
                onClose={closeModal}
                maxWidthClass="max-w-2xl"
            >
                {creationNotifications && modalOpen === "new" && (
                    <Notification {...creationNotifications} />
                )}

                {updateNotifications && modalOpen === "update" && (
                    <Notification {...updateNotifications} />
                )}

                <form
                    onSubmit={submitExperience}
                    className="space-y-1 *:p-1 *:space-y-2"
                >
                    <div>
                        <label htmlFor="company" className="text-md">
                            Company
                        </label>
                        <InputComponent
                            name="company"
                            id="company"
                            placeholder="Company name"
                            value={experience.company}
                            onChange={(event) =>
                                setExperience((prev) => ({
                                    ...prev,
                                    company: event.target.value,
                                }))
                            }
                            required
                            disabled={actionProgress}
                        />
                    </div>

                    <div>
                        <label htmlFor="position" className="text-md">
                            Position
                        </label>
                        <InputComponent
                            name="position"
                            id="position"
                            placeholder="Job title / position"
                            value={experience.position}
                            onChange={(event) =>
                                setExperience((prev) => ({
                                    ...prev,
                                    position: event.target.value,
                                }))
                            }
                            required
                            disabled={actionProgress}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="startDate" className="text-md">
                                Start Date
                            </label>
                            <InputComponent
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={experience.startDate}
                                onChange={(event) =>
                                    setExperience((prev) => ({
                                        ...prev,
                                        startDate: event.target.value,
                                    }))
                                }
                                required
                                disabled={actionProgress}
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="text-md">
                                End Date
                            </label>
                            <InputComponent
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={experience.endDate}
                                onChange={(event) =>
                                    setExperience((prev) => ({
                                        ...prev,
                                        endDate: event.target.value,
                                    }))
                                }
                                disabled={experience.isWorking || actionProgress}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="isWorking"
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <InputComponent
                                type="checkbox"
                                name="isWorking"
                                id="isWorking"
                                className="size-5"
                                checked={experience.isWorking}
                                onChange={(event) =>
                                    setExperience((prev) => ({
                                        ...prev,
                                        isWorking: event.target.checked,
                                        endDate: event.target.checked
                                            ? ""
                                            : prev.endDate,
                                    }))
                                }
                                disabled={actionProgress}
                            />
                            <span>Currently working here</span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-2">
                        <ActionButton
                            type="submit"
                            text={
                                modalOpen === "new"
                                    ? "Create Experience"
                                    : "Update Experience"
                            }
                            icon={CheckBadgeIcon}
                            disabled={actionProgress}
                            spinner={{
                                isLoading: actionProgress,
                            }}
                        />
                    </div>
                </form>
            </ModalComponent>
        </SectionLayoutComponent>
    );
}
