import type { HTMLAttributes, ReactNode } from "react";

type SectionComponentProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    title?: string;
    className?: string;
    customiseTitle?: string;
};

export default function SectionComponent({
    children,
    title,
    className,
    customiseTitle,
    ...props
}: SectionComponentProps) {
    return (
        <div
            {...props}
            className={`relative bg-bg-secondary p-4 backdrop-blur-[2px] rounded-lg shadow-md ${className}`}
        >
            {title && (
                <h2
                    className={`h1 flex-1 w-full -translate-x-6 pointer-events-none font-normal font-pixelify opacity-20 capitalize ${customiseTitle}`}
                >
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}
