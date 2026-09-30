import "./App.css";
import SectionComponent from "./components/SectionComponent";

import { useState } from "react";
import AboutComponent from "./components/AboutComponent";
import ContactComponent from "./components/ContactComponent";
import ExperienceComponent from "./components/ExperienceComponent";
import FooterComponent from "./components/FooterComponent";
import ProjectsComponent from "./components/ProjectsComponent";
import SkillsComponent from "./components/SkillsComponent";
import type { Publication } from "./services/PublicationService";

function App() {
    const [content] = useState<Publication | null>(null);

    return (
        <div className="relative">
            <div
                className="vert-line absolute inset-0 ml-18 w-4 flex justify-between
				before:h-full before:w-1.5 before:bg-[repeating-linear-gradient(135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
				after:h-full after:w-1.5 after:bg-[repeating-linear-gradient(-135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
				text-primary opacity-80"
            ></div>
            <div
                className="vert-line absolute inset-0 ml-24 w-4 flex justify-center
				before:h-full before:w-1.5 before:bg-[repeating-linear-gradient(45deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
				after:h-full after:w-1.5 after:bg-[repeating-linear-gradient(-45deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
				text-primary opacity-20"
            ></div>
            <div
                className="vert-line absolute inset-0 ml-30 w-4 flex justify-between
				before:h-full before:w-1.5 before:bg-[repeating-linear-gradient(135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
				after:h-full after:w-1.5 after:bg-[repeating-linear-gradient(-135deg,currentColor,currentColor_10px,transparent_4px,transparent_18px)]
				text-primary opacity-80"
            ></div>
            <main className="relative min-h-screen md:p-6 space-y-6">
                {/* About */}
                <SectionComponent id="about">
                    <AboutComponent
                        profile={content?.profile}
                        about={content?.about}
                        socialProfiles={content?.socialProfiles}
                    />
                </SectionComponent>

                {/* Skills */}
                <SkillsComponent skills={content?.skills ?? new Map()} />

                {/* Projects */}
                <ProjectsComponent projects={content?.projects ?? []} />

                {/* Experience & Contact */}
                <SectionComponent className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-0">
                    {/* Experience */}
                    <SectionComponent
                        title="Experience"
                        id="experience"
                        className="shadow-none! bg-transparent! backdrop-blur-none!"
                    >
                        <ExperienceComponent
                            experience={content?.experiences ?? []}
                        />
                    </SectionComponent>

                    {/* Contact */}
                    <SectionComponent
                        title="Contact"
                        id="contact"
                        className="lg:*:px-6 space-y-3 shadow-none! bg-bg-primary! backdrop-blur-none!"
                    >
                        <ContactComponent />
                    </SectionComponent>
                </SectionComponent>
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
