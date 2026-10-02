import type { HTMLAttributes, ReactNode } from "react";
import type { InputComponentProps } from "./formelements/InputComponent";
import {
    PaginationButtons,
    type PaginationButtonsProps,
} from "./pagination/PaginationButtons";
import InputComponent from "./formelements/InputComponent";
import ActionButton, { type ActionButtonProps } from "./ActionButtonComponent";

type SectionLayoutComponentProps<T> = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    title?: string;
    description?: string;
    actionEvents?: ActionButtonProps[];
    search?: InputComponentProps;
    pagination?: PaginationButtonsProps<T>;
};

export default function SectionLayoutComponent<T>({
    children,
    title,
    description,
    actionEvents,
    search,
    pagination,
    ...props
}: SectionLayoutComponentProps<T>) {
    return (
        <section
            {...props}
            className={`space-y-3 bg-background-secondary p-3 shadow-sm rounded-md ${props.className}`}
        >
            {title ||
                description ||
                (actionEvents && actionEvents.length > 0 && (
                    <div className="flex items-center justify-between">
                        {title ||
                            (description && (
                                <div className="">
                                    {title && (
                                        <h1 className="text-lg">{title}</h1>
                                    )}
                                    {description && (
                                        <span className="text-sm">
                                            {description}
                                        </span>
                                    )}
                                </div>
                            ))}
                        {actionEvents && actionEvents.length > 0 && (
                            <div className="">
                                {actionEvents?.map((act, idx) => (
                                    <ActionButton {...act} key={idx} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}

            {(search || pagination) && (
                <div className="flex items-center justify-between">
                    {search && (
                        <InputComponent
                            {...search}
                            className={`${search?.className}`}
                        />
                    )}
                    {pagination && <PaginationButtons {...pagination} />}
                </div>
            )}
            {children}
        </section>
    );
}
