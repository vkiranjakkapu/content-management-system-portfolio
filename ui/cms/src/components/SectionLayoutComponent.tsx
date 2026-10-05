import type { HTMLAttributes, ReactNode } from "react";
import ActionButton, { type ActionButtonProps } from "./ActionButtonComponent";
import type { InputComponentProps } from "./formelements/InputComponent";
import InputComponent from "./formelements/InputComponent";
import {
    PaginationButtons,
    type PaginationButtonsProps,
} from "./pagination/PaginationButtons";
import SpinnerComponent, {
    type SpinnerComponentProps,
} from "./SpinnerComponent";
import type { SelectComponentProps } from "./formelements/SelectComponent";
import SelectComponent from "./formelements/SelectComponent";

type SectionLayoutComponentProps<T> = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    title?: string;
    description?: string;
    actionEvents?: ActionButtonProps[];
    search?: InputComponentProps;
    categorySearch?: SelectComponentProps;
    pagination?: PaginationButtonsProps<T>;
    spinner?: SpinnerComponentProps;
};

export default function SectionLayoutComponent<T>({
    children,
    title,
    description,
    actionEvents,
    search,
    categorySearch,
    pagination,
    spinner,
    ...props
}: SectionLayoutComponentProps<T>) {
    return (
        <section
            {...props}
            className={`section-component space-y-3 divide-y p-6 bg-section-theme shadow-lg rounded-md ${props.className}`}
            aria-labelledby={title}
        >
            {(title ||
                description ||
                (actionEvents && actionEvents.length > 0)) && (
                <div className="flex items-center justify-between pb-3">
                    {(title || description) && (
                        <div>
                            {title && <h1 className="text-xl">{title}</h1>}
                            {description && (
                                <span className="capitalize text-sm">
                                    {description}
                                </span>
                            )}
                        </div>
                    )}
                    {actionEvents && actionEvents.length > 0 && (
                        <div className="flex gap-1 items-center p-px">
                            {actionEvents?.map((act, idx) => (
                                <ActionButton {...act} key={idx} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(search ||
                categorySearch ||
                (pagination && pagination.totalPages > 1)) && (
                <div className="flex flex-wrap items-center justify-between pb-3">
                    <div className="flex-1">
                        {search && (
                            <InputComponent
                                {...search}
                                className={`w-full md:w-3/5 ${search?.className}`}
                            />
                        )}
                        {categorySearch && (
                            <SelectComponent
                                {...categorySearch}
                                className={`w-full md:w-3/5 ${categorySearch?.className}`}
                            />
                        )}
                    </div>
                    <div className="flex-1">
                        {pagination && pagination.totalPages > 1 && (
                            <PaginationButtons {...pagination} />
                        )}
                    </div>
                </div>
            )}
            {spinner && spinner.isLoading ? (
                <SpinnerComponent {...spinner} />
            ) : (
                children
            )}
        </section>
    );
}
