import "./App.css";

import { useState } from "react";
import AboutComponent from "./components/AboutComponent";
import ContactComponent from "./components/ContactComponent";
import ExperienceComponent from "./components/ExperienceComponent";
import FooterComponent from "./components/FooterComponent";
import ProjectsComponent from "./components/ProjectsComponent";
import SeoComponent from "./components/SeoComponent";
import SkillsComponent from "./components/SkillsComponent";
import type { Publication } from "./services/PublicationService";

function App() {
    const [content] = useState<Publication | null>(null);

    return (
        <div className="relative">
            <SeoComponent content={content} />

            <div
                className="vert-line absolute inset-0 ml-18 w-4 flex justify-between
                before:h-full before:w-1.5 before:bg-[repeating-linear-gradient(135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
                after:h-full after:w-1.5 after:bg-[repeating-linear-gradient(-135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
              text-primary opacity-80"
                aria-hidden="true"
            ></div>
            <div
                className="vert-line absolute inset-0 ml-24 w-4 flex justify-center
                before:h-full before:w-1.5 before:bg-[repeating-linear-gradient(45deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
                after:h-full after:w-1.5 after:bg-[repeating-linear-gradient(-45deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
              text-primary opacity-20"
                aria-hidden="true"
            ></div>
            <div
                className="vert-line absolute inset-0 ml-30 w-4 flex justify-between
                before:h-full before:w-1.5 before:bg-[repeating-linear-gradient(135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
                after:h-full after:w-1.5 after:bg-[repeating-linear-gradient(-135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
              text-primary opacity-80"
                aria-hidden="true"
            ></div>

            <main
                className="relative min-h-screen md:p-6 space-y-6"
                aria-label="Portfolio content"
            >
                {/* About */}
                <AboutComponent
                    profile={content?.profile}
                    summary={content?.about}
                    socialProfiles={content?.socialProfiles}
                    id="about"
                    aria-labelledby="about-title"
                />

                {/* Skills */}
                <SkillsComponent
                    skills={content?.skills ?? new Map()}
                    id="skills"
                    aria-labelledby="skills-title"
                />

                {/* Projects */}
                <ProjectsComponent
                    projects={content?.projects ?? []}
                    id="projects"
                    aria-labelledby="projects-title"
                />

                {/* Experience & Contact */}
                <div className="bg-bg-secondary p-4 backdrop-blur-[2px] rounded-lg shadow-md px-6 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-0">
                    {/* Experience */}
                    <ExperienceComponent
                        experience={content?.experiences ?? []}
                        id="experience"
                        aria-labelledby="experience-title"
                    />

                    {/* Contact */}
                    <ContactComponent />
                </div>
            </main>

            {/* Footer */}
            <FooterComponent
                profile={content?.profile}
                socialProfiles={content?.socialProfiles}
            />
        </div>
    );
}

export default App;
