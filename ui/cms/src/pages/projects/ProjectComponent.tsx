import Landscape from "../../assets/landscape.png";
import ActionButton, {
    type ActionButtonProps,
} from "../../components/ActionButtonComponent";
import type { Project } from "../../services/DtoModels";

type ProjectComponentProps = {
    project: Project;
    actionButtons?: ActionButtonProps[];
};

export default function ProjectComponent({
    project,
    actionButtons,
}: ProjectComponentProps) {
    return (
        <div className="relative p-4 border bg-section-theme rounded shadow-sm">
            <div className="absolute top-0 right-0 m-4 flex gap-2">
                {actionButtons &&
                    actionButtons.map((act, idx) => (
                        <ActionButton key={idx} {...act} />
                    ))}
            </div>
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <hr className="border-t my-2" />
            <div className="flex items-center flex-wrap gap-1">
                <b>Skills: </b>
                {project.techStack.map((sk) => sk.name).join(", ")}
            </div>
            <p>
                <b>Description: </b>
                {project.description}
            </p>
            {project.gallery.length > 0 && (
                <div>
                    <b className="block">Gallary: </b>
                    <div className="flex gap-4 overflow-x-auto border p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                        {project.gallery.map((md) => (
                            <img
                                key={md.id}
                                src={
                                    md.media
                                        ? `data:${md.mediaType};base64,${md.media}`
                                        : Landscape
                                }
                                alt={md.mediaName}
                                className="max-w-80 h-auto object-cover object-center"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
