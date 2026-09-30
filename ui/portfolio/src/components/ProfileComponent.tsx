import { useEffect, useRef, useState, type HTMLAttributes } from "react";

import profileDp from "/profile.png";

type ProfileComponentProps = HTMLAttributes<HTMLDivElement> & {
    image?: Blob;
    position?: string;
    customiseText?: string;
};

export default function ProfileComponent({
    image,
    position = "~ Full Stack Developer ~ Java ~ React ~ AI",
    customiseText,
    ...props
}: ProfileComponentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(96);

    useEffect(() => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setRadius(width / 2);
        }
    }, []);

    return (
        <div
            {...props}
            className={`relative size-48 rounded-full text-primary ${props.className}`}
        >
            <img
                src={image ? URL.createObjectURL(image) : profileDp}
                alt="Venkata Kiran Jakkapu"
                className="absolute top-1/2 left-1/2 -translate-1/2 mx-auto size-3/4 border border-primary/30 bg-black/12 object-cover rounded-full"
            />
            <div
                className="absolute inset-0 font-semibold font-playfair *:absolute *:left-1/2 animate-spin origin-center lowercase [animation-direction:reverse] [animation-duration:15s]"
                ref={containerRef}
            >
                {position?.split("").map((char, i) => (
                    <span
                        key={i}
                        style={{
                            transform: `rotate(${i * 8.54}deg)`,
                            transformOrigin: `0 ${radius}px`,
                        }}
                        className={customiseText}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
}
