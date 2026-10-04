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
    CameraIcon,
    CheckBadgeIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Landscape from "../../assets/landscape.png";
import ActionButton from "../../components/ActionButtonComponent";
import ModalComponent from "../../components/ModalComponent";
import ProfileComponent from "../../components/ProfileComponent";
import MediaService from "../../services/MediaService";
import MasonryComponent from "../library/MasonryComponent";

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [draft, setDraft] = useState<Partial<Profile> | null>(null);

    const [emptyProfile, setEmptyProfile] = useState<boolean>(false);

    const { notifications, setNotifications, resetNotifications } =
        useNotifications(["info", "action"]);
    const infoNotifications = notifications["info"] ?? null;
    const actionNotifications = notifications["action"] ?? null;

    const fetchMedia = useCallback(
        async (ids: string[]): Promise<Record<string, Blob>> => {
            try {
                const resp = await MediaService.fetchMediaByList<
                    Record<string, Blob>
                >({ ids });
                return resp.data;
            } catch (error) {
                console.error("Failed to fetch media:", error);
                return {};
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
                                media: mediaMap[md.id]!,
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
                setDraft(profile);

                if (!profile.dp && !profile.banner) {
                    return;
                }

                const ids = [
                    ...[profile.dp ? profile.dp.id : null],
                    ...[profile.banner ? profile.banner.id : null],
                ].filter((id) => id != null);
                if (ids.length == 0) {
                    return;
                }
                fetchMedia(ids).then((mediaMap) => {
                    setProfile((prev) => {
                        if (!prev) return null;

                        const updatedProfile = {
                            ...prev,
                            ...(prev.dp
                                ? {
                                      dp: {
                                          ...prev.dp,
                                          media: mediaMap[prev.dp.id]!,
                                      },
                                  }
                                : {}),
                            ...(prev.banner
                                ? {
                                      banner: {
                                          ...prev.banner,
                                          media: mediaMap[prev.banner.id]!,
                                      },
                                  }
                                : {}),
                        };
                        return updatedProfile;
                    });
                });
            })
            .catch((e: ErrorResponse) => {
                console.log(e);
                if (e.errorCode === "BUS-2001") {
                    setEmptyProfile(true);
                }
                setNotifications("info", {
                    type: "info",
                    messages: [e.errorMessage],
                });
            });
    }, [setNotifications, fetchMedia]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const [actionProgress, setActionProgress] = useState<boolean>(false);

    function handleFormSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        setActionProgress(true);

        const promise = emptyProfile
            ? ProfileService.createProfile<Profile>(formData)
            : ProfileService.updateProfile<Profile>(formData);

        promise
            .then((resp) => {
                setProfile(resp.data);
                setDraft(resp.data);
                setNotifications("action", {
                    type: "success",
                    messages: [
                        `Profile ${emptyProfile ? "Created" : "Updated"} Successfully.`,
                    ],
                });
                resetNotifications("info");
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
            })
            .finally(() => {
                setActionProgress(false);
            });
    }

    return (
        <>
            <SectionLayoutComponent
                title="Profile"
                description="You can Manage Profile from this page"
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
                        className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4"
                    >
                        {/* Profile Picture Box */}
                        <div className="flex flex-col items-center justify-center md:row-span-2 order-1">
                            <ProfileComponent
                                onClick={() => {
                                    fetchLibrary();
                                    setOpenLibrary("dp");
                                }}
                                className="cursor-pointer"
                                title="Click to update profile"
                                image={undefined}
                                position={
                                    draft?.designation ??
                                    profile?.designation ??
                                    "~ Full Stack Developer ~ Java ~ React ~ AI"
                                }
                            />
                            <span
                                className={`uppercase text-xs ${profile?.dp != draft?.dp ? "block" : "hidden"}`}
                            >
                                (Edited)
                            </span>
                            <span
                                className={`flex items-center gap-1 uppercase text-xs ${!profile?.dp || !draft?.dp ? "block" : "hidden"}`}
                            >
                                <InformationCircleIcon className="size-4" />
                                <span>Showing default</span>
                            </span>
                        </div>
                        <div className="order-2 md:order-3">
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
                            <span
                                className={`uppercase text-xs ${profile?.designation != draft?.designation ? "block" : "hidden"}`}
                            >
                                (Edited)
                            </span>
                        </div>
                        <hr className="md:hidden border-t order-3" />

                        {/* Banner Image Box */}
                        <div className="md:row-span-2 md:col-span-2 flex flex-col justify-between order-4 md:order-2">
                            <div
                                className={`h-48 w-full rounded-3xl shadow-lg overflow-hidden cursor-pointer relative border hover:[&>.camIcon]:visible`}
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
                                            : draft?.banner?.media
                                              ? URL.createObjectURL(
                                                    draft.banner.media,
                                                )
                                              : Landscape
                                    }
                                    alt="Banner"
                                    className={`w-full h-full object-cover ${
                                        !profile?.banner && "opacity-60"
                                    }`}
                                />
                                <div className="camIcon absolute pointer-events-none invisible top-0 right-0 bg-section-theme m-2 p-2 rounded-full">
                                    <CameraIcon className="size-4" />
                                </div>
                                <div className="absolute bottom-0 p-2 pl-6 bg-section-theme w-full font-playfair text-primary text-lg">
                                    {draft?.location ??
                                        profile?.location ??
                                        "West Godavari, AP"}
                                </div>
                                <div className="absolute top-0 p-2 pl-6 flex items-center gap-1 justify-center mt-2 text-slate-500">
                                    <InformationCircleIcon className="size-4" />
                                    <span className="capitalize text-sm">
                                        Will be Used as background for location
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`uppercase text-xs ${profile?.banner != draft?.banner ? "block" : "hidden"}`}
                            >
                                (Edited)
                            </span>
                        </div>
                        <div className="order-5">
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
                            <span
                                className={`uppercase text-xs ${profile?.location != draft?.location ? "block" : "hidden"}`}
                            >
                                (Edited)
                            </span>
                        </div>
                        <hr className="md:hidden border-t order-6" />

                        {/* Availability */}
                        <div className="order-7">
                            <label
                                htmlFor="availability"
                                className="capitalize block text-sm font-medium mb-1"
                            >
                                work status :
                                <span
                                    className={`uppercase text-xs ml-1 ${profile?.availability != draft?.availability ? "block" : "hidden"}`}
                                >
                                    (Edited)
                                </span>
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

                        <hr className="hidden md:block col-span-full border-t order-8" />

                        {/* Name */}
                        <div className="order-9">
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
                            <span
                                className={`uppercase text-xs ${profile?.name != draft?.name ? "block" : "hidden"}`}
                            >
                                (Edited)
                            </span>
                        </div>

                        {/* Email */}
                        <div className="order-10">
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
                            <span
                                className={`uppercase text-xs ${profile?.email != draft?.email ? "block" : "hidden"}`}
                            >
                                (Edited)
                            </span>
                        </div>

                        {/* Phone */}
                        <div className="order-11">
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
                            <span
                                className={`uppercase text-xs ${profile?.phone != draft?.phone ? "block" : "hidden"}`}
                            >
                                (Edited)
                            </span>
                        </div>

                        {/* Form Actions */}
                        <div className="order-12 col-span-full flex items-center justify-between gap-2 pt-4 border-t">
                            <div className="flex-1">
                                {JSON.stringify(draft) !==
                                    JSON.stringify(profile) && (
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs uppercase rounded w-fit animate-pulse">
                                            UnSaved Draft
                                        </span>
                                        <ActionButton
                                            text="Reset"
                                            icon={BackspaceIcon}
                                            className="bg-yellow-200 outline-yellow-200 text-yellow-600"
                                            onClick={() => setDraft(profile)}
                                        />
                                    </div>
                                )}
                            </div>
                            <ActionButton
                                className="ml-auto"
                                text={!emptyProfile ? `Update` : `Create`}
                                icon={CheckBadgeIcon}
                                type="submit"
                                spinner={{
                                    isLoading: actionProgress,
                                }}
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
