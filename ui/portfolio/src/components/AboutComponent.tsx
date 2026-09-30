import {
    SocialIconMap,
    SocialMediaType,
    type About,
    type Profile,
    type SocialProfile,
} from "../services/PublicationService";
import ProfileComponent from "./ProfileComponent";

import Banner from "../assets/banner.jpg";

type AboutComponentProps = {
    profile?: Profile;
    about?: About;
    socialProfiles?: SocialProfile[];
};

export default function AboutComponent({
    profile,
    about,
    socialProfiles,
}: AboutComponentProps) {
    return (
        <>
            <div className="relative">
                <div className="absolute font-semibold inset-0 text-primary font-pixelify grid gap-4">
                    <div className="flex flex-wrap items-center justify-between ms-3 *:inline-flex *:items-center *:gap-4">
                        <div className="pointer-events-none">
                            <div className="size-4 bg-primary text-primary font-pixelify rounded-full"></div>
                            <span>
                                {profile?.availability ??
                                    "STATUS - Open to work"}
                            </span>
                        </div>
                        <div className="ms-auto mx-10 *:cursor-pointer *:hover:opacity-80 *:transition-opacity *:duration-75">
                            {socialProfiles && socialProfiles.length > 0 ? (
                                socialProfiles.map((socPrf, idx) => {
                                    const Icon = SocialIconMap[socPrf.name];
                                    return (
                                        <a
                                            key={idx}
                                            aria-label={`${socPrf.name} profile`}
                                            href={socPrf.url}
                                            target="_blank" rel="noopener noreferrer"
                                        >
                                            <Icon />
                                        </a>
                                    );
                                })
                            ) : (
                                <>
                                    <a
                                        aria-label="GitHub profile"
                                        href="https://github.com/vkiranjakkapu"
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {(() => {
                                            const Icon =
                                                SocialIconMap[
                                                    SocialMediaType.GITHUB
                                                ];
                                            return <Icon />;
                                        })()}
                                    </a>
                                    <a
                                        aria-label="LinkedIn profile"
                                        href="https://www.linkedin.com/in/venkata-kiran-jakkapu-a2209415a/"
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {(() => {
                                            const Icon =
                                                SocialIconMap[
                                                    SocialMediaType.LINKEDIN
                                                ];
                                            return <Icon />;
                                        })()}
                                    </a>
                                    <a
                                        aria-label="WhatsApp profile"
                                        href="https://wa.me/qr/KTFQWZZGJCARP1"
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {(() => {
                                            const Icon =
                                                SocialIconMap[
                                                    SocialMediaType.WHATSAPP
                                                ];
                                            return <Icon />;
                                        })()}
                                    </a>
                                    <a
                                        aria-label="Spotify profile"
                                        href="https://open.spotify.com/user/31ecwujtmcg7jg6jylbnf3qktlfi?si=a0688b479bf141fe"
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {(() => {
                                            const Icon =
                                                SocialIconMap[
                                                    SocialMediaType.SPOTIFY
                                                ];
                                            return <Icon />;
                                        })()}
                                    </a>
                                    <a
                                        aria-label="Instagram profile"
                                        href="https://www.instagram.com/jvkiran_/"
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {(() => {
                                            const Icon =
                                                SocialIconMap[
                                                    SocialMediaType.INSTAGRAM
                                                ];
                                            return <Icon />;
                                        })()}
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                    <span className="pointer-events-none -rotate-90 -translate-x-24 w-fit mt-21 lg:mt-24">
                        {profile?.name ?? "Venkata Kiran Jakkapu"}
                    </span>
                </div>
            </div>
            <div className="p-8 md:p-10 pb-3!">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-1.5 lg:gap-y-3 font-playfair">
                    {/*  items-center-safe  */}
                    <div className="lg:row-span-2 flex flex-col items-center lg:translate-y-6 order-1">
                        <ProfileComponent
                            image={profile?.dp.media}
                            position={profile?.designation}
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
                                    profile?.banner.media
                                        ? URL.createObjectURL(
                                              profile?.banner.media,
                                          )
                                        : Banner
                                }
                                alt="Banner Image - West Godavari, AP"
                                className="w-full h-32 lg:h-40 object-cover"
                            />
                            <div className="absolute inset-0 p-2 flex items-end">
                                <h2 className="tracking-wider text-white">
                                    {`Based in - ${profile?.location ?? "West Godavari, AP"}`}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <p className="h1 mt-auto order-4 lg:col-span-2 font-playfair">Hello!</p>

                    {/* Contact Me */}
                    <div className="mt-auto text-center order-2 lg:order-5 -translate-y-2">
                        <a href="#contact" className="btn-primary">
                            Contact
                        </a>
                    </div>

                    <h1 className="lg:col-span-4 mt-auto order-5 translate-y-1">
                        {`I'm ${profile?.name ?? "Venkata Kiran J"}.`}
                    </h1>

                    {/* About Me */}
                    <div className="col-span-full order-6">
                        <p className="font-pixelify text-primary text-2xl my-2 mt-3 italic">
                            (About me)
                        </p>
                        <p className="font-kanchenjunga">
                            <span className="me-[6ch] lg:me-[18ch]"></span>
                            {about?.summary ??
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
                        <div className="font-playfair text-md p-1 rounded-full lg:outline lg:outline-offset-2 lg:outline-primary lg:border border-primary flex flex-wrap justify-center gap-1.5 *:shadow-sm *:lg:shadow-none *:text-white lg:*:text-current *:bg-primary *:lg:bg-transparent *:px-2.5 *:py-1.5 *:rounded-full *:hover:bg-primary *:hover:text-white *:focus:bg-primary *:focus:text-white *:active:bg-primary *:active:text-white *:transition-colors *:duration-100">
                            <a href="#skills">Skills</a>
                            <a href="#projects">Projects</a>
                            <a href="#experience">Experience</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
