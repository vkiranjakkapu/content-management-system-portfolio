import type { SelectHTMLAttributes } from "react";

export type SelectComponentProps = SelectHTMLAttributes<HTMLSelectElement> & {
    options: {
        value: string;
        text?: string;
        disabled?: boolean;
    }[];
    emptyOption?: string;
};

export default function SelectComponent({
    options,
    emptyOption,
    ...props
}: SelectComponentProps) {
    return (
        <select
            {...props}
            className={`${props.className} ${props.disabled && `opacity-60 pointer-events-none cursor-not-allowed`}`}
        >
            <option value="">{emptyOption ?? "Select"}</option>
            {options.map((opt, idx) => {
                return (
                    <option key={"Option" + idx + opt.value} {...opt}>
                        {(opt.text ?? opt.value).split("_").join(" ")}
                    </option>
                );
            })}
        </select>
    );
}
