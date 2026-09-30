import {
    SocialIconMap,
    type Profile,
    type SocialProfile,
} from "../services/PublicationService";
import ProfileComponent from "./ProfileComponent";

type FooterComponentProps = {
    profile?: Profile;
    socialProfiles?: SocialProfile[];
};

export default function FooterComponent({
    profile,
    socialProfiles,
}: FooterComponentProps) {
    return (
        <>
            <footer className="bg-primary text-white flex flex-wrap justify-between gap-3 p-6 pb-0 lg:*:pb-4">
                <div className="flex flex-wrap justify-center items-center gap-6">
                    <ProfileComponent
                        image={profile?.dp.media}
                        position={profile?.designation}
                        customiseText="text-white font-normal"
                    />
                    <div className="space-y-3">
                        <h2 className="font-playfair">
                            {profile?.name ?? "Venkata Kiran Jakkapu"}
                        </h2>
                        <p className="text-md">
                            {profile?.email ?? "venkatakiran.jakkapu@gmail.com"}
                        </p>
                        <p className="text-md">
                            {profile?.phone ?? "+91 9493660145"}
                        </p>
                        <div className="flex gap-3">
                            {socialProfiles &&
                                socialProfiles.length > 0 &&
                                socialProfiles.map((socPrf, idx) => {
                                    const Icon = SocialIconMap[socPrf.name];

                                    return (
                                        <a
                                            key={idx}
                                            href="#"
                                            className="hover:opacity-80 transition-opacity duration-100"
                                        >
                                            <Icon />
                                        </a>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className="font-pixelify flex gap-3 justify-center flex-1 lg:flex-col lg:flex-none p-3 lg:w-2/5">
                    <a href="#about" className="w-fit hover:[&>span]:w-3/4">
                        About
                        <span className="block w-0 border-t transition-all duration-100"></span>
                    </a>
                    <a href="#skills" className="w-fit hover:[&>span]:w-3/4">
                        Skills
                        <span className="block w-0 border-t transition-all duration-100"></span>
                    </a>
                    <a href="#projects" className="w-fit hover:[&>span]:w-3/4">
                        Projects
                        <span className="block w-0 border-t transition-all duration-100"></span>
                    </a>
                    <a
                        href="#experience"
                        className="w-fit hover:[&>span]:w-3/4"
                    >
                        Experience
                        <span className="block w-0 border-t transition-all duration-100"></span>
                    </a>
                </div>
            </footer>
            <hr className="border-primary/70" />
            <div className="bg-primary text-white p-3 w-full text-center text-sm capitalize">
                &#xA9; 2026. Created for Myself with ❤️ for learining.
            </div>
        </>
    );
}
