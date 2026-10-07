import { useMemo, useState } from "react";

import type { Media, MediaTag } from "../services/PublicationService";

const ttsImagesModules = import.meta.glob<{ default: string }>(
    "/src/assets/projects/*.{webp,png,jpg,jpeg,svg}",
    { eager: true },
);

const localImages = Object.values(ttsImagesModules).map(
    (module) => module.default,
);

type AlbumComponentProps = {
    album: Media[] | string[];
    projectId?: string;
    className?: string;
};

export default function AlbumComponent({
    album,
    projectId,
    className,
}: AlbumComponentProps) {
    const [selectedTag, setSelectedTag] = useState<MediaTag | "ALL">("ALL");

    const allImages = useMemo<(Media | string)[]>(() => {
        const images =
            album.length > 0
                ? album
                : projectId
                  ? localImages.filter((img) => img.includes(projectId))
                  : localImages;

        return [...images]
            .sort((a, b) => {
                const getOrder = (value: string | Media) => {
                    if (typeof value !== "string") {
                        return 0;
                    }

                    const fileName = value.split("/").pop() ?? "";
                    const match = fileName.match(/_(\d+)\./);

                    return match ? Number(match[1]) : 0;
                };

                return getOrder(b) - getOrder(a);
            })
            .slice(0, window.innerWidth >= 1024 ? 12 : 6);
    }, [album, projectId]);

    const selection =
        selectedTag === "ALL"
            ? allImages
            : allImages.filter(
                  (img): img is Media =>
                      typeof img !== "string" && img.tag === selectedTag,
              );

    function filterTag(tag: MediaTag | "ALL") {
        setSelectedTag(tag);
    }

    const getImageName = (img: string | Media) => {
        if (typeof img !== "string") {
            return img.mediaName;
        }

        const fileName = img.split("/").pop() ?? "";

        // Used to remove Vite's production hash:
        // tts_7.ai-enhancement-Su2xin.png
        // -> tts_7.ai-enhancement.png
        const cleanName = fileName.replace(/-[A-Za-z0-9_-]+(?=\.[^.]+$)/, "");

        return cleanName.split(".")[1];
    };

    const marginRight = allImages.length ? (5 / allImages.length) * 3.5 : 0;

    const marginTop = allImages.length ? (2 / allImages.length) * 3.5 : 0;

    const tags = [
        ...new Set(
            album
                .filter((img): img is Media => typeof img !== "string")
                .map((img) => img.tag),
        ),
    ];

    return (
        <>
            <div
                className={`gallery overflow-y-clip overflow-x-visible lg:overflow-visible h-70 lg:h-100 max-w-160 ms-auto relative ${className ?? ""}`}
            >
                {selection.map((img, idx) => {
                    const imageName = getImageName(img);

                    return (
                        <div
                            key={typeof img === "string" ? img : img.id}
                            style={
                                window.innerWidth >= 1024
                                    ? {
                                          marginRight: `${
                                              idx * marginRight
                                          }rem`,
                                      }
                                    : {
                                          marginTop: `${idx * marginTop}rem`,
                                      }
                            }
                            className="absolute inset-0 ms-auto w-md lg:w-160 h-full hover:z-100 [&_.desc]:hidden hover:[&_.desc]:block"
                        >
                            <img
                                src={
                                    typeof img === "object"
                                        ? `data:${img.mediaType};base64,${img.media}`
                                        : img
                                }
                                alt={imageName}
                                loading="eager"
                                decoding="async"
                                className="w-full h-full border object-scale-down border-primary/50 rounded-lg hover:shadow-sm hover:scale-105 transition-all duration-150"
                            />

                            <div className="desc absolute inset-0 pointer-events-none">
                                <p className="capitalize font-playfair text-center w-fit px-4 py-1 mt-4 outline outline-offset-2 outline-primary rounded-full bg-primary text-white text-md">
                                    {imageName}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {album.length > 0 && (
                <div className="flex flex-wrap justify-end gap-4 order-4">
                    <button
                        className="animate-none font-kanchenjunga capitalize outline-none text-xs border border-primary/60 font-semibold bg-bg-primary text-primary"
                        onClick={() => filterTag("ALL")}
                    >
                        All
                    </button>

                    {tags.map((tag) => (
                        <button
                            key={tag}
                            className="animate-none font-kanchenjunga capitalize outline-none text-xs border border-primary/60 font-semibold bg-bg-primary text-primary"
                            onClick={() => filterTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
