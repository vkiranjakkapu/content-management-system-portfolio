import type { ButtonHTMLAttributes } from "react";
import SpinnerComponent, {
    type SpinnerComponentProps,
} from "./SpinnerComponent";
import type { IconProps } from "./commons";

export type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: IconProps;
    customiseIcon?: string;
    customiseText?: string;
    text?: string;
    spinner?: SpinnerComponentProps
};

export default function ActionButton({
    icon: Icon,
    customiseIcon,
    customiseText,
    text,
    spinner,
    ...props
}: ActionButtonProps) {
    return (
        <button
            {...props}
            className={`flex items-center gap-1 text-md ${props.disabled && `pointer-events-none opacity-70`} ${props.className}`}
            type={props.type ?? "button"}
        >
            {spinner && spinner.isLoading ? (
                <SpinnerComponent
                    {...spinner}
                    customize={`w-fit ${spinner.customize}`}
                />
            ) : (
                Icon && <Icon className={`size-4 ${customiseIcon}`} />
            )}
            {text && <span className={customiseText}>{text}</span>}
        </button>
    );
}
