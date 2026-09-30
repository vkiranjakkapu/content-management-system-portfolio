import { useState } from "react";
import type { Media, MediaTag } from "../services/PublicationService";

const ttsImagesModules = import.meta.glob<{ default: string }>(
    "/src/assets/projects/*.{png,jpg,jpeg,svg}",
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
    const [allImages] = useState<(Media | string)[]>(
        album.length > 0
            ? album
            : (projectId
                  ? localImages.filter((img) => img.includes(projectId))
                  : localImages
              )
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
                  .slice(0, window.innerWidth >= 1024 ? 12 : 6),
    );

    const [selection, setSelection] = useState<(Media | string)[]>(allImages);

    function filterTag(tag: MediaTag | "ALL") {
        if (tag === "ALL") {
            setSelection(allImages);
            return;
        }

        const filtered = selection.filter(
            (md) => (md as Media).tag === (tag as MediaTag),
        );
        setSelection(filtered);
    }

    const getImageName = (img: string | Media) => {
        if (typeof img !== "string") {
            return img.mediaName;
        }

        const fileName = img.split("/").pop() ?? "";

        // Used to remove Vite's production hash:
        // example:
        // tts_7.ai-enhancement-Su2xin.png
        // -> tts_7.ai-enhancement.png
        const cleanName = fileName.replace(/-[A-Za-z0-9_-]+(?=\.[^.]+$)/, "");

        return cleanName.split(".")[1];
    };

    const marginRight = (5 / allImages.length) * 3.5;
    const marginTop = (2 / allImages.length) * 3.5;

    return (
        <>
            <div
                className={`gallery overflow-y-clip overflow-x-visible lg:overflow-visible h-70 lg:h-100 max-w-160 ms-auto relative ${className}`}
            >
                {allImages.map((img, idx) => {
                    const imageName = getImageName(img);
                    return (
                        <div
                            style={
                                window.innerWidth >= 1024
                                    ? {
                                          marginRight: `${idx * marginRight}rem`,
                                      }
                                    : {
                                          marginTop: `${idx * marginTop}rem`,
                                      }
                            }
                            className={`absolute inset-0 ms-auto w-full h-full hover:z-100 [&_.desc]:hidden hover:[&_.desc]:block`}
                            key={idx}
                        >
                            <img
                                src={
                                    typeof img == "object"
                                        ? URL.createObjectURL(img.media)
                                        : String(img)
                                }
                                alt={imageName}
                                loading="eager"
                                decoding="async"
                                className={`border w-full border-primary/50 rounded-lg object-cover hover:shadow-sm hover:scale-105 transition-all duration-150`}
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
                <>
                    <button
                        className="animate-none font-kanchenjunga capitalize outline-none text-xs border border-primary/60 font-semibold bg-bg-primary text-primary"
                        onClick={() => filterTag("ALL")}
                    >
                        All
                    </button>
                    {new Set<MediaTag>(
                        album.map((img) => (img as Media).tag),
                    ).forEach((tag) => {
                        return (
                            <div className="flex flex-wrap justify-end gap-4">
                                <button
                                    className="animate-none font-kanchenjunga capitalize outline-none text-xs border border-primary/60 font-semibold bg-bg-primary text-primary"
                                    onClick={() => filterTag(tag)}
                                >
                                    {tag}
                                </button>
                            </div>
                        );
                    })}
                </>
            )}
        </>
    );
}
