import "./App.css";
import ProfileComponent from "./components/ProfileComponent";
import SectionComponent from "./components/SectionComponent";

import { useState } from "react";
import {
    BsGithub,
    BsLinkedin
} from "react-icons/bs";
import Banner from "./assets/banner.jpg";
import Img from "./assets/profile.png";
import ProjectsComponent from "./components/ProjectsComponent";
import SkillsComponent from "./components/SkillsComponent";
import type { Publication } from "./services/PublicationService";

function App() {
    const [content] = useState<Publication | null>(null);

    return (
        <main className="relative min-h-screen md:p-6 space-y-3">
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

            {/* About */}
            <SectionComponent>
                <div className="relative">
                    <div className="absolute font-semibold inset-0 text-primary font-pixelify grid gap-4">
                        <div className="flex flex-wrap items-center justify-between ms-3 *:inline-flex *:items-center *:gap-4">
                            <div className="pointer-events-none">
                                <div className="size-4 bg-primary text-primary font-pixelify rounded-full"></div>
                                <span>
                                    {content?.profile.availability ??
                                        "STATUS - Available Immediatley"}
                                </span>
                            </div>
                            <div className="ms-auto mx-10 *:cursor-pointer *:hover:opacity-80 *:transition-opacity *:duration-75">
                                <span>
                                    <BsLinkedin />
                                </span>
                                <span>
                                    <BsGithub />
                                </span>
                            </div>
                        </div>
                        <span className="pointer-events-none -rotate-90 -translate-x-21 lg:-translate-x-24 w-fit mt-21 lg:mt-24">
                            {content?.profile.name ?? "Venkata Kiran Jakkapu"}
                        </span>
                    </div>
                </div>
                <div className="p-8 md:p-10 pb-3!">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-1.5 lg:gap-y-3 font-playfair">
                        {/*  items-center-safe  */}
                        <div className="lg:row-span-2 flex flex-col items-center lg:translate-y-6 order-1">
                            <ProfileComponent
                                image={
                                    content
                                        ? content?.profile.dp.media + ""
                                        : Img
                                }
                                position={
                                    content?.profile.designation ??
                                    "~ Full Stack Developer ~ Java ~ React ~ AI"
                                }
                                className="size-50!"
                            />
                        </div>
                        <div className="hidden lg:block order-2 lg:col-span-2"></div>

                        {/* Banner */}
                        <div className="lg:row-span-2 lg:col-span-2 flex items-end order-3">
                            <div className="relative w-full">
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1.5px]"></div>
                                <img
                                    src={
                                        content
                                            ? content?.profile.banner.media + ""
                                            : Banner
                                    }
                                    alt="Banner Image - West Godavari, AP"
                                    className="w-full h-32 lg:h-40 object-cover"
                                />
                                <div className="absolute inset-0 p-2 flex items-end">
                                    <h2 className="tracking-wider text-white">
                                        {`Based in - ${content?.profile.location ?? "West Godavari, AP"}`}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <h1 className="mt-auto order-4 lg:col-span-2">
                            Hello!
                        </h1>

                        {/* Contact Me */}
                        <div className="mt-auto text-center order-2 lg:order-5 -translate-y-2">
                            <a href="#contact" className="btn-primary">
                                Contact
                            </a>
                        </div>

                        <h1 className="lg:col-span-4 mt-auto order-5 translate-y-1">
                            {`I'm ${content?.profile.name ?? "Venkata Kiran J"}.`}
                        </h1>

                        {/* About Me */}
                        <div className="col-span-full order-6">
                            <p className="font-pixelify text-primary text-2xl my-2 mt-3 italic">
                                (About me)
                            </p>
                            <p className="font-kanchenjunga">
                                <span className="me-[6ch] lg:me-[18ch]"></span>
                                {content?.about.summary ??
                                    `I am a Java Full Stack Engineer with 5+ years of
                                software development experience, currently
                                focused on Java, Spring Boot, React,
                                microservices, REST APIs, PostgreSQL, and
                                cloud-native application development. My
                                experience spans modern full-stack development,
                                enterprise Java backend engineering, DevOps, and
                                software delivery. At Wipro, I worked with Java,
                                Spring Boot, REST APIs, microservices,
                                production support, CI/CD, and enterprise
                                deployment processes. I began my career in
                                full-stack web development, building a strong
                                foundation across application development and
                                delivery. I also have hands-on exposure to
                                AI-assisted software engineering and AI
                                application integration, with personal
                                experience exploring LLMs, RAG, vector
                                databases, and Spring AI.`}
                            </p>
                        </div>
                        <div className="col-span-full order-7 w-fit mx-auto mt-4">
                            <div className="font-playfair text-md p-1 rounded-full lg:outline lg:outline-offset-2 lg:outline-primary lg:border border-primary flex flex-wrap justify-center gap-1.5 *:shadow-sm *:lg:shadow-none *:bg-bg-primary *:lg:bg-transparent *:px-2.5 *:py-1.5 *:rounded-full *:hover:bg-primary *:hover:text-white *:focus:bg-primary *:focus:text-white *:active:bg-primary *:active:text-white *:transition-colors *:duration-100">
                                <a href="#skills">Skills</a>
                                <a href="#projects">Projects</a>
                                <a href="#experience">Experience</a>
                                <a href="#contact">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionComponent>

            {/* Skills */}
            <SkillsComponent skills={content?.skills ?? new Map()} />

            {/* Projects */}
            <ProjectsComponent projects={content?.projects ?? []} />

            {/* Experience & Contact */}
            <SectionComponent
                className="px-6 flex flex-wrap gap-2 *:flex-1"
                id="experience"
            >
                <SectionComponent
                    title="Experience"
                    id="contact"
                    className="shadow-none! bg-transparent! backdrop-blur-none!"
                >
                    <p>01</p>
                </SectionComponent>
                <SectionComponent
                    title="Contact"
                    id="contact"
                    className="shadow-none! bg-bg-primary! backdrop-blur-none!"
                    customiseTitle="-ms-3_"
                >
                    <p>01</p>
                </SectionComponent>
            </SectionComponent>
        </main>
    );
}

export default App;
