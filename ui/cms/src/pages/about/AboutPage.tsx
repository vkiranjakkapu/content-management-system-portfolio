import {
    Bars3BottomLeftIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import type { ErrorResponse } from "../../api/api";
import ActionButton from "../../components/ActionButtonComponent";
import InputComponent from "../../components/formelements/InputComponent";
import TextareaComponent from "../../components/formelements/TextareaComponent";
import ModalComponent from "../../components/ModalComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import usePagination from "../../components/pagination/usePagination";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import TableComponent from "../../components/TableComponent";
import AboutService from "../../services/AboutService";
import type { About } from "../../services/DtoModels";

export default function AboutPage() {
    const [modalOpen, setModalOpen] = useState<"new" | "update" | null>(null);

    const { notifications, setNotifications } = useNotifications([
        "new",
        "update",
        "info",
    ]);
    const creationNotifications = notifications["new"] ?? null;
    const updateNotifications = notifications["update"] ?? null;
    const infoNotifications = notifications["info"] ?? null;

    const [actionProgress, setActionProgress] = useState<boolean>(false);

    const [about, setAbout] = useState<About>({} as About);

    function createAbout(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (about.name === "" || about.summary === "") {
            const errors = [];
            if (about.name === "") {
                errors.push("name is required.");
            }
            if (about.summary === "") {
                errors.push("summary is required.");
            }
            setNotifications(modalOpen!, {
                type: "error",
                messages: errors,
            });
            return;
        }

        setActionProgress(true);
        if (modalOpen == "new") {
            AboutService.createNewAbout<About>(about)
                .then((resp) => {
                    setNotifications("new", {
                        type: "success",
                        messages: [
                            `About '@${resp.data.name}' has been created successfully.`,
                        ],
                    });
                    setAbout(resp.data);
                })
                .catch((e: ErrorResponse) => {
                    setNotifications("new", {
                        type: "error",
                        messages:
                            e.validationErrors.length > 0
                                ? e.validationErrors.map(
                                      (ve) => `${ve.field} ${ve.message}`,
                                  )
                                : [e.errorMessage],
                    });
                })
                .finally(() => {
                    setActionProgress(false);
                });
            return;
        }
        AboutService.updateAbout<About>(about)
            .then((resp) => {
                setNotifications("update", {
                    type: "success",
                    messages: [
                        `About '@${resp.data.name}' has been updated successfully.`,
                    ],
                });
                setAbout(resp.data);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("update", {
                    type: "error",
                    messages:
                        e.validationErrors.length > 0
                            ? e.validationErrors.map(
                                  (ve) => `${ve.field} ${ve.message}`,
                              )
                            : [e.errorMessage],
                });
            })
            .finally(() => {
                setActionProgress(false);
            });
    }

    // * Data Fetch
    const [allAbouts, setAllAbouts] = useState<About[]>([]);

    const [fetchProgress, setFetchProgress] = useState<boolean>(true);

    useEffect(() => {
        AboutService.getAbouts<About[]>()
            .then((resp) => {
                setAllAbouts(resp.data);
            })
            .catch((e: ErrorResponse) => {
                setNotifications("info", {
                    type: "info",
                    messages: [e.errorMessage],
                });
            })
            .finally(() => {
                setFetchProgress(false);
            });
    }, [setNotifications]);

    const [queryString, setQueryString] = useState<string>("");

    const queryResults = useMemo(() => {
        if (queryString == "") {
            return allAbouts;
        }

        const results = allAbouts.filter((abt) =>
            abt.name.includes(queryString),
        );

        return results;
    }, [queryString, allAbouts]);

    const pagination = usePagination(queryResults, 8);

    function deleteAbout(about: About) {
        if (window.confirm(`Are you sure deleting @${about.name}?`)) {
            AboutService.deleteAbout(about.id)
                .then(() => {
                    window.alert(`@${about.name} deleted successfully.`);
                })
                .catch((e: ErrorResponse) => {
                    window.alert(e.errorMessage);
                });
        }
    }

    return (
        <SectionLayoutComponent
            title="About"
            description="Manage your saved abouts from this page."
            actionEvents={[
                {
                    icon: PlusCircleIcon,
                    text: "New About",
                    onClick() {
                        setModalOpen("new");
                    },
                    disabled: allAbouts.length == 0,
                },
            ]}
            search={
                allAbouts.length > 0
                    ? {
                          type: "text",
                          placeholder: "Search by name",
                          onChange(e) {
                              setQueryString(e.target.value);
                          },
                      }
                    : undefined
            }
            pagination={pagination}
        >
            {infoNotifications && (
                <Notification
                    type={infoNotifications?.type}
                    messages={infoNotifications?.messages}
                    customise="mb-3 border-0 capitalize"
                />
            )}
            <TableComponent
                body={pagination.currentItems}
                loading={{
                    showSpinner: fetchProgress,
                    spinner: { text: "Fetching abouts..." },
                }}
                actionEvents={[
                    {
                        title: "Edit",
                        clickEvent: {
                            icon: PencilIcon,
                            onClick(abt) {
                                setAbout(abt);
                                setModalOpen("update");
                            },
                        },
                    },
                    {
                        title: "Delete",
                        clickEvent: {
                            icon: TrashIcon,
                            className: "text-rose-500",
                            onClick(abt) {
                                deleteAbout(abt);
                            },
                        },
                    },
                ]}
            />
            <ModalComponent
                title={modalOpen == "new" ? `Add About` : `Update About`}
                isOpen={modalOpen != null}
                onClose={() => setModalOpen(null)}
                maxWidthClass="max-w-2xl"
            >
                <form
                    onSubmit={createAbout}
                    className="space-y-1 *:p-1 *:space-y-2"
                >
                    {creationNotifications && (
                        <div>
                            <Notification
                                type={creationNotifications?.type}
                                messages={creationNotifications?.messages}
                            />
                        </div>
                    )}
                    {updateNotifications && (
                        <div>
                            <Notification
                                type={updateNotifications?.type}
                                messages={updateNotifications?.messages}
                            />
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="name"
                            className="flex items-center gap-1"
                        >
                            <InformationCircleIcon className="size-4" />
                            Name for this About
                        </label>
                        <InputComponent
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            onChange={(e) => {
                                setAbout((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }));
                            }}
                            value={about.name}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="summary"
                            className="flex items-center gap-1"
                        >
                            <Bars3BottomLeftIcon className="size-4" /> Summary
                        </label>
                        <TextareaComponent
                            name="summary"
                            id="summary"
                            value={about.summary}
                            placeholder="..."
                            className="px-2"
                            onChange={(e) => {
                                setAbout((prev) => ({
                                    ...prev,
                                    summary: e.target.value,
                                }));
                            }}
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <ActionButton
                            type="submit"
                            text="Confirm"
                            spinner={{
                                loading: actionProgress,
                            }}
                            icon={CheckCircleIcon}
                            className="ms-auto"
                        />
                    </div>
                </form>
            </ModalComponent>
        </SectionLayoutComponent>
    );
}
