import { useCallback, useEffect, useState, type SubmitEvent } from "react";
import type { ErrorResponse } from "../../api/api";
import InputComponent from "../../components/formelements/InputComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import type { Media, Profile } from "../../services/DtoModels";
import ProfileService from "../../services/ProfileService";

import {
    BackspaceIcon,
    CheckBadgeIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../../assets/avatar.png";
import Landscape from "../../assets/landscape.png";
import ActionButton from "../../components/ActionButtonComponent";
import ModalComponent from "../../components/ModalComponent";
import MediaService from "../../services/MediaService";
import MasonryComponent from "../library/MasonryComponent";

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [draft, setDraft] = useState<Partial<Profile> | null>(null);

    const { notifications, setNotifications } = useNotifications([
        "info",
        "action",
    ]);
    const infoNotifications = notifications["info"] ?? null;
    const actionNotifications = notifications["action"] ?? null;

    const fetchMedia = useCallback(
        async (ids: string[]): Promise<Map<string, Blob>> => {
            try {
                const resp = await MediaService.fetchMediaByList<
                    Map<string, Blob>
                >({ ids });
                return resp.data;
            } catch (error) {
                console.error("Failed to fetch media:", error);
                return new Map<string, Blob>();
            }
        },
        [],
    );

    const [openLibrary, setOpenLibrary] = useState<"dp" | "banner" | null>(
        null,
    );

    const [allMedia, setAllMedia] = useState<Media[]>([]);
    const [fetchProgress, setFetchProgress] = useState<boolean>(true);

    const fetchLibrary = useCallback(() => {
        MediaService.getMedia<Media[]>()
            .then((resp) => {
                const allMedia = resp.data;
                fetchMedia(allMedia.map((md) => md.id))
                    .then((mediaMap) => {
                        setAllMedia(
                            allMedia.map((md) => ({
                                ...md,
                                media: mediaMap.get(md.id)!,
                            })),
                        );
                    })
                    .finally(() => {
                        setFetchProgress(false);
                    });
            })
            .finally(() => {
                setFetchProgress(false);
            });
    }, [fetchMedia]);

    const fetchProfile = useCallback(() => {
        ProfileService.getAllProfiles<Profile>()
            .then((resp) => {
                const profile = resp.data;
                setProfile(profile);

                if (!profile.dp && !profile.banner) {
                    return;
                }

                const ids = [profile.dp.id, profile.banner.id].filter(
                    (id) => id != null,
                );
                if (ids.length == 0) {
                    return;
                }
                fetchMedia(ids).then((mediaMap) => {
                    setProfile((prev) => {
                        if (!prev) return null;

                        const updatedProfile = {
                            ...prev,
                            dp: {
                                ...prev.dp,
                                media: mediaMap.get(prev.dp.id)!,
                            },
                            banner: {
                                ...prev.banner,
                                media: mediaMap.get(prev.banner.id)!,
                            },
                        };
                        return updatedProfile;
                    });
                });
            })
            .catch((e: ErrorResponse) => {
                console.log(e);

                setNotifications("info", {
                    type: "info",
                    messages: [e.errorMessage],
                });
            });
    }, [setNotifications, fetchMedia]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    function handleFormSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        ProfileService.createProfile<Profile>(formData)
            .then((resp) => {
                setProfile(resp.data);
                setDraft(null); // Clear draft on successful save
            })
            .catch((e: ErrorResponse) => {
                setNotifications("action", {
                    type: "error",
                    messages:
                        e.validationErrors.length > 0
                            ? e.validationErrors.map(
                                  (ve) => `${ve.field} ${ve.message}`,
                              )
                            : [e.errorMessage],
                });
            });
    }

    return (
        <>
            <SectionLayoutComponent
                title="Profile"
                description="You can Manage Profiles from this page"
            >
                <div className="space-y-3">
                    {infoNotifications && (
                        <Notification
                            type={infoNotifications?.type}
                            messages={infoNotifications.messages}
                        />
                    )}
                    {actionNotifications && (
                        <Notification
                            type={actionNotifications?.type}
                            messages={actionNotifications.messages}
                        />
                    )}

                    <form
                        onSubmit={handleFormSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {/* Profile Picture Box */}
                        <div className="flex justify-center md:row-span-2">
                            <div
                                className="w-48 h-48 rounded-3xl shadow-lg overflow-hidden cursor-pointer relative border shrink-0"
                                onClick={() => {
                                    fetchLibrary();
                                    setOpenLibrary("dp");
                                }}
                                title="Click to change profile picture"
                            >
                                <img
                                    src={
                                        profile?.dp?.media
                                            ? URL.createObjectURL(
                                                  profile.dp.media,
                                              )
                                            : Avatar
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <input type="file" className="hidden" />
                            </div>
                        </div>

                        {/* Banner Image Box */}
                        <div className="md:row-span-2 md:col-span-2 flex flex-col justify-between">
                            <div
                                className={`h-48 w-full rounded-3xl shadow-lg overflow-hidden cursor-pointer relative border ${
                                    !profile?.banner && "opacity-60"
                                }`}
                                onClick={() => {
                                    fetchLibrary();
                                    setOpenLibrary("banner");
                                }}
                                title="Click to change banner image"
                            >
                                <img
                                    src={
                                        profile?.banner?.media
                                            ? URL.createObjectURL(
                                                  profile.banner.media,
                                              )
                                            : Landscape
                                    }
                                    alt="Banner"
                                    className="w-full h-full object-cover"
                                />
                                <input type="file" className="hidden" />
                            </div>
                            <div className="flex items-center gap-1 justify-center mt-2 text-slate-500">
                                <InformationCircleIcon className="size-4" />
                                <span className="capitalize text-sm">
                                    Will be Used as background for location
                                </span>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="capitalize block text-sm font-medium mb-1"
                            >
                                email :
                            </label>
                            <InputComponent
                                id="email"
                                name="email"
                                value={draft?.email ?? profile?.email ?? ""}
                                placeholder="Enter email"
                                onChange={(e) => {
                                    setDraft((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }));
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="name"
                                className="capitalize block text-sm font-medium mb-1"
                            >
                                name :
                            </label>
                            <InputComponent
                                id="name"
                                name="name"
                                value={draft?.name ?? profile?.name ?? ""}
                                placeholder="Enter name"
                                onChange={(e) => {
                                    setDraft((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }));
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="capitalize block text-sm font-medium mb-1"
                            >
                                phone :
                            </label>
                            <InputComponent
                                id="phone"
                                name="phone"
                                value={draft?.phone ?? profile?.phone ?? ""}
                                placeholder="Enter phone"
                                onChange={(e) => {
                                    setDraft((prev) => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }));
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="designation"
                                className="capitalize block text-sm font-medium mb-1"
                            >
                                designation :
                            </label>
                            <InputComponent
                                id="designation"
                                name="designation"
                                value={
                                    draft?.designation ??
                                    profile?.designation ??
                                    ""
                                }
                                placeholder="Enter designation"
                                onChange={(e) => {
                                    setDraft((prev) => ({
                                        ...prev,
                                        designation: e.target.value,
                                    }));
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="location"
                                className="capitalize block text-sm font-medium mb-1"
                            >
                                location :
                            </label>
                            <InputComponent
                                id="location"
                                name="location"
                                value={
                                    draft?.location ?? profile?.location ?? ""
                                }
                                placeholder="Enter location"
                                onChange={(e) => {
                                    setDraft((prev) => ({
                                        ...prev,
                                        location: e.target.value,
                                    }));
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="availability"
                                className="capitalize block text-sm font-medium mb-1"
                            >
                                availability :
                            </label>
                            <InputComponent
                                id="availability"
                                name="availability"
                                value={
                                    draft?.availability ??
                                    profile?.availability ??
                                    ""
                                }
                                placeholder="Enter availability"
                                onChange={(e) => {
                                    setDraft((prev) => ({
                                        ...prev,
                                        availability: e.target.value,
                                    }));
                                }}
                                required
                            />
                            <div className="flex items-center gap-1 text-sm mt-1 text-slate-500">
                                <InformationCircleIcon className="size-4" />
                                <span className="capitalize">
                                    Status -{" "}
                                    {draft?.availability ??
                                        profile?.availability}
                                </span>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="col-span-full flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
                            <div className="flex-1">
                                {draft != null &&
                                    Object.keys(draft).length > 0 && (
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs uppercase rounded w-fit animate-pulse">
                                                UnSaved Draft
                                            </span>
                                            <ActionButton
                                                text="Reset"
                                                icon={BackspaceIcon}
                                                className="bg-yellow-200 outline-yellow-200 text-yellow-600"
                                                onClick={() => setDraft(null)}
                                            />
                                        </div>
                                    )}
                            </div>
                            <ActionButton
                                className="ml-auto"
                                text={profile ? `Update` : `Create`}
                                icon={CheckBadgeIcon}
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
            </SectionLayoutComponent>
            <ModalComponent
                title="Choose Profile"
                isOpen={openLibrary != null}
                onClose={() => {
                    setOpenLibrary(null);
                }}
                maxWidthClass="max-w-6xl"
            >
                <MasonryComponent
                    resources={allMedia}
                    spinner={{
                        text: "Fetching library...",
                        isLoading: fetchProgress,
                    }}
                />
            </ModalComponent>
        </>
    );
}
