import type { HTMLAttributes } from "react";
import type { ActionButtonProps } from "../../components/ActionButtonComponent";
import ActionButton from "../../components/ActionButtonComponent";
import InputComponent, { type InputComponentProps } from "../../components/formelements/InputComponent";
import type { Skill } from "../../services/DtoModels";

export type SkillComponentProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "onClick"
> & {
    onClick?: (skill: Skill) => void;
    skill: Skill;
    hideTech?: boolean;
    actionBtns?: (Omit<ActionButtonProps, "onClick"> & {
        onClick?: (skill: Skill) => void;
    })[];
    input?: InputComponentProps;
};

export function SkillComponent({
    skill,
    hideTech = false,
    actionBtns,
    input,
    onClick,
    ...props
}: SkillComponentProps) {
    return (
        <div
            {...props}
            className={`relative border rounded-md p-2 flex items-center justify-between gap-3 ${props.className}`}
            onClick={() => {
                onClick?.(skill);
            }}
        >
            <div className="min-w-0">
                <p className="font-medium truncate">{skill.name}</p>
                {!hideTech && (
                    <p className="text-sm opacity-70 truncate">
                        {skill.tech.name}
                    </p>
                )}
            </div>

            {actionBtns && actionBtns.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {actionBtns.map((btn, idx) => (
                        <ActionButton
                            key={idx}
                            {...btn}
                            onClick={(event) => {
                                event.stopPropagation();
                                btn.onClick?.(skill);
                            }}
                        />
                    ))}
                </div>
            )}
            {input && <InputComponent {...input} />}
        </div>
    );
}
