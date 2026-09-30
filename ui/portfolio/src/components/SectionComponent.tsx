import type { HTMLAttributes, ReactNode } from "react";

type SectionComponentProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    sectionTitle?: string;
    className?: string;
    customiseTitle?: string;
};

export default function SectionComponent({
    children,
    sectionTitle,
    className,
    customiseTitle,
    ...props
}: SectionComponentProps) {
    return (
        <section
            {...props}
            className={`relative bg-bg-secondary p-4 backdrop-blur-[2px] rounded-lg shadow-md ${className}`}
        >
            {sectionTitle && (
                <h2
                    id={props["aria-labelledby"]}
                    className={`h1 flex-1 w-full -translate-x-6 pointer-events-none font-normal font-pixelify opacity-20 capitalize ${customiseTitle}`}
                >
                    {sectionTitle}
                </h2>
            )}
            {children}
        </section>
    );
}
