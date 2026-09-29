import { useState } from "react";
import { RiArrowRightLongFill } from "react-icons/ri";
import type { Project } from "../services/PublicationService";
import AlbumComponent from "./AlbumComponent";
import SectionComponent from "./SectionComponent";
import { BsBoxArrowUpRight } from "react-icons/bs";

type ProjectsComponentProps = {
    projects: (Project & {
        projectId?: string;
    })[];
};

export default function ProjectsComponent({
    projects,
}: ProjectsComponentProps) {
    const [selectedProject, setSelection] = useState<
        | (Project & {
              projectId?: string;
          })
        | null
    >(projects.length > 0 ? projects[0] : null);

    return (
        <SectionComponent title="projects" className="px-12" id="projects">
            <div className="lg:h-125 grid grid-cols-1 lg:grid-cols-2 *:flex *:items-center">
                <div className="text-primary gap-4 flex-col justify-center items-start!">
                    <ul
                        className="
                        space-y-3

                        [&>li>:first-child]:hidden [&>li.active>:first-child]:block
                        [&>.active]:text-current [&>:not(.active)]:text-slate-500 [&>:not(.active)]:text-lg

                        *:hover:text-primary! *:w-full *:transition-all *:duration-150
                        *:cursor-pointer *:flex *:items-center *:gap-1"
                    >
                        {projects.length > 0 ? (
                            projects.map((prj, idx) => {
                                return (
                                    <li
                                        className={`project ${((projects.length == 0 && idx == 0) || selectedProject == prj) && "active"}`}
                                        key={idx}
                                        onClick={() => {
                                            setSelection(prj);
                                        }}
                                    >
                                        <RiArrowRightLongFill />
                                        {` ${prj.title}`}
                                    </li>
                                );
                            })
                        ) : (
                            <>
                                <li
                                    className={`project ${(selectedProject == null || selectedProject.projectId === "cms") && "active"}`}
                                    onClick={() =>
                                        setSelection((prev) =>
                                            prev
                                                ? { ...prev, projectId: "tts" }
                                                : null,
                                        )
                                    }
                                >
                                    <RiArrowRightLongFill /> Text To Speech -
                                    Azure OpenAI
                                </li>
                                <li
                                    className={`project ${selectedProject?.projectId === "cms" && "active"}`}
                                    onClick={() =>
                                        setSelection((prev) =>
                                            prev
                                                ? { ...prev, projectId: "cms" }
                                                : null,
                                        )
                                    }
                                >
                                    <RiArrowRightLongFill /> Content Management
                                    System
                                </li>
                                <li
                                    className={`project ${selectedProject?.projectId === "nalanda" && "active"}`}
                                    onClick={() =>
                                        setSelection((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      projectId: "nalanda",
                                                  }
                                                : null,
                                        )
                                    }
                                >
                                    <RiArrowRightLongFill /> AI Powered
                                    Knowledge & Learning Project{" "}
                                </li>
                                <li
                                    className={`project ${selectedProject?.projectId === "csm" && "active"}`}
                                    onClick={() =>
                                        setSelection((prev) =>
                                            prev
                                                ? { ...prev, projectId: "csm" }
                                                : null,
                                        )
                                    }
                                >
                                    <RiArrowRightLongFill /> Cloud Storage &
                                    Management
                                </li>
                                <li
                                    className={`project ${selectedProject?.projectId === "qoap" && "active"}`}
                                    onClick={() =>
                                        setSelection((prev) =>
                                            prev
                                                ? { ...prev, projectId: "qoap" }
                                                : null,
                                        )
                                    }
                                >
                                    <RiArrowRightLongFill /> Quiz & Online
                                    Assessments System
                                </li>
                                <li
                                    className={`project ${selectedProject?.projectId === "ims" && "active"}`}
                                    onClick={() =>
                                        setSelection((prev) =>
                                            prev
                                                ? { ...prev, projectId: "ims" }
                                                : null,
                                        )
                                    }
                                >
                                    <RiArrowRightLongFill /> Insurance
                                    Management
                                </li>
                            </>
                        )}
                    </ul>
                    <button
                        onClick={() => {
                            window.open(
                                "https://github.com/vkiranjakkapu",
                                "_blank",
                            );
                        }}
                    >
                        Show All
                    </button>
                </div>
                <div className="justify-end! relative lg:pr-12 lg:absolute lg:right-0 lg:w-3/5 h-fit origin-center lg:top-1/2 lg:-translate-y-1/2">
                    <div className="py-6 text-left md:text-right space-y-2 md:space-y-4 flex flex-col">
                        <h3 className="text-primary order-1">
                            {selectedProject?.title ??
                                `Text To Speech - Azure OpenAI`}
                        </h3>
                        <p className="text-md order-3 md:order-2">
                            {selectedProject
                                ? selectedProject.techStack
                                      .map((skill) => skill.name)
                                      .join(" • ")
                                : `Java 25 • Spring Boot • Spring Cloud • React •
                        PostgreSQL • Azure • Microservices • Azure OpenAI`}
                        </p>
                        <AlbumComponent
                            album={selectedProject?.gallery ?? []}
                            projectId={selectedProject?.projectId}
                            className="w-full order-4 md:order-3"
                        />
                        <a
                            href={
                                selectedProject?.gitUrl ??
                                "https://github.com/vkiranjakkapu"
                            }
                            target="_blank"
                            className="text-md cursor-pointer w-fit md:ms-auto gap-2 text-primary flex items-center justify-end order-2 md:order-4"
                        >
                            <span>Github Link</span>
                            <BsBoxArrowUpRight />
                        </a>
                    </div>
                </div>
            </div>
        </SectionComponent>
    );
}
