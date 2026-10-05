import type { InputHTMLAttributes } from "react";

export type InputComponentProps = InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
};

export default function InputComponent({
    className,
    ...props
}: InputComponentProps) {
    return (
        <input
            {...props}
            type={props.type ?? "text"}
            className={`${className} ${props.disabled ? `pointer-events-none cursor-not-allowed opacity-70` : ``}`}
        />
    );
}
