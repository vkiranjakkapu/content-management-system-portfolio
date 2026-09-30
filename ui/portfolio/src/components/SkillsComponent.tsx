import type { HTMLAttributes } from "react";
import type { Skill } from "../services/PublicationService";
import SectionComponent from "./SectionComponent";

type SkillsComponentProps = HTMLAttributes<HTMLDivElement> & {
    skills: Map<string, Skill[]>;
};

export default function SkillsComponent({
    skills,
    ...props
}: SkillsComponentProps) {
    return (
        <SectionComponent
            sectionTitle="Skills"
            className="p-6 px-12"
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-3">
                {skills.size > 0 ? (
                    Array.from(skills.entries()).map(([tech, skills]) => {
                        return (
                            <div className="p-2 space-y-2">
                                <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                    {tech}
                                </h3>
                                <p>{skills.map((sk) => sk.name).join(", ")}</p>
                            </div>
                        );
                    })
                ) : (
                    <>
                        <div className="p-2 space-y-2">
                            <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                Languages
                            </h3>
                            <p>Java, JavaScript, SQL, Python, PHP</p>
                        </div>
                        <div className="p-2 space-y-2">
                            <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                Frontend Skills
                            </h3>
                            <p>React, Typescript, Tailwind Css</p>
                        </div>
                        <div className="p-2 space-y-2">
                            <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                Backend Skills
                            </h3>
                            <p>
                                Spring Boot, Spring Security, Spring Data JPA,
                                Hibernate, REST API's
                            </p>
                        </div>
                        <div className="p-2 space-y-2">
                            <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                Cloud & DevOps
                            </h3>
                            <p>Docker, Azure, Git, Kubernetes, CI/CD, Linux</p>
                        </div>
                        <div className="p-2 space-y-2">
                            <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                Databases
                            </h3>
                            <p>PostgreSQL, MySQL, Vector Databases</p>
                        </div>
                        <div className="p-2 space-y-2">
                            <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                Architecture
                            </h3>
                            <p>
                                Micro services, Distributed Systems, Reusable
                                Platform Components
                            </p>
                        </div>
                        <div className="p-2 space-y-2">
                            <h3 className="text-primary font-playfair font-semibold lg:font-normal">
                                AI & AI-Assisted Engineering
                            </h3>
                            <p>
                                Spring AI, ChatGPT, LLMs, RAG, AI-assisted
                                Software Engineering
                            </p>
                        </div>
                    </>
                )}
            </div>
        </SectionComponent>
    );
}
