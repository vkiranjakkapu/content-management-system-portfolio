import type { HTMLAttributes } from "react";
import type { ActionButtonProps } from "../../components/ActionButtonComponent";
import ActionButton from "../../components/ActionButtonComponent";
import type { Skill } from "../../services/DtoModels";

export type SkillComponentProps = HTMLAttributes<HTMLDivElement> & {
    skill: Skill;
    hideTech?: boolean;
    actionBtns?: ActionButtonProps[];
};

export function SkillComponent({
    skill,
    hideTech = false,
    actionBtns,
    ...props
}: SkillComponentProps) {
    return (
        <div
            {...props}
            className={`border rounded-md p-2 flex items-center justify-between gap-3 ${props.className}`}
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
                        <ActionButton key={idx} {...btn} />
                    ))}
                </div>
            )}
        </div>
    );
}
