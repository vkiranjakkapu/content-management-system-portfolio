import type { Experience } from "../services/PublicationService";

type ExperienceComponentProps = {
    experience: Experience[];
    className?: string;
};

export default function ExperienceComponent({
    experience,
    className,
}: ExperienceComponentProps) {
    return (
        <table className={`text-md w-full ${className}`}>
            <tbody>
                {experience.length > 0 ? (
                    experience.map((exp, idx) => {
                        return (
                            <tr className="*:p-3.5 lg:*:px-6" key={idx}>
                                <td className="text-right border-r-2 border-slate-400 relative">
                                    <span
                                        aria-label={`Experience Period ${exp.company ? "at " + exp.company : ""}`}
                                    >{`${exp.startDate} - ${exp.isWorking ? "Present" : exp.endDate}`}</span>
                                    <div className="absolute -right-1.75 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full"></div>
                                </td>
                                <td
                                    aria-label={`Experience Details ${exp.company ? "at " + exp.company : ""}`}
                                >
                                    <p
                                        aria-label={`Designation ${exp.company ? "at " + exp.company : ""}`}
                                    >
                                        {exp.position}
                                    </p>
                                    {exp.company && (
                                        <p
                                            aria-label="Working Company Name"
                                            className="text-primary font-playfair font-semibold"
                                        >
                                            {exp.company}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <>
                        <tr className="*:p-3.5 lg:*:px-6">
                            <td className="text-right border-r-2 border-slate-400 relative">
                                <span aria-label="Experience Period at Labmantix">
                                    2026'July - Present
                                </span>
                                <div className="absolute -right-1.75 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full"></div>
                            </td>
                            <td aria-label="Experience Details at Labmantix">
                                <p aria-label={`Designation at Labmantix`}>
                                    Java Full Stack Development - Intern
                                </p>
                                <p
                                    className="text-primary font-playfair font-semibold"
                                    aria-label="Working Company Name"
                                >
                                    Labmantix
                                </p>
                            </td>
                        </tr>
                        <tr className="*:p-3.5 lg:*:px-6">
                            <td className="text-right border-r-2 border-slate-400 relative">
                                <span aria-label="Experience Period">
                                    2024'Oct - 2026'July
                                </span>
                                <div className="absolute -right-1.75 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full"></div>
                            </td>
                            <td aria-label="Experience at UPSC">
                                <p aria-label={`Designation - UPSC Aspirant`}>
                                    Preparing for UPSC Civil Services
                                </p>
                                {/* <p
                                aria-label="Working Company Name"
                                 className="text-primary font-playfair font-semibold">
                                    Career Break
                                </p> */}
                            </td>
                        </tr>
                        <tr className="*:p-3.5 lg:*:px-6">
                            <td className="text-right border-r-2 border-slate-400 relative">
                                <div className="absolute -right-1.75 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full"></div>
                                <span aria-label="Experience Period at Wipro">
                                    2024'Jun - 2024'Oct
                                </span>
                            </td>
                            <td aria-label="Experience Details at Wipro">
                                <p aria-label={`Designation at Wipro`}>
                                    Backend Engineer - Java MS
                                </p>
                                <p
                                    aria-label="Working Company Name"
                                    className="text-primary font-playfair font-semibold"
                                >
                                    Wipro
                                </p>
                            </td>
                        </tr>
                        <tr className="*:p-3.5 lg:*:px-6">
                            <td className="text-right border-r-2 border-slate-400 relative">
                                <div className="absolute -right-1.75 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full"></div>
                                <span aria-label="Experience Period at Wipro">
                                    2022'Sep - 2024'May
                                </span>
                            </td>
                            <td aria-label="Experience Details at Wipro">
                                <p aria-label={`Designation at Wipro`}>
                                    Jr. DevOps Engineer
                                </p>
                                <p
                                    aria-label="Working Company Name"
                                    className="text-primary font-playfair font-semibold"
                                >
                                    Wipro
                                </p>
                            </td>
                        </tr>
                        <tr className="*:p-3.5 lg:*:px-6">
                            <td className="text-right border-r-2 border-slate-400 relative">
                                <div className="absolute -right-1.75 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full"></div>
                                <span aria-label="Experience Period at RGUKT-SKLM AP IIIT">
                                    2019'Jun - 2022'Aug
                                </span>
                            </td>
                            <td aria-label="Experience Details at RGUKT-SKLM AP IIIT">
                                <p
                                    aria-label={`Designation at RGUKT-SKLM AP IIIT`}
                                >
                                    Fullstack Web Developer
                                </p>
                                <p
                                    aria-label="Working Company Name"
                                    className="text-primary font-playfair font-semibold"
                                >
                                    RGUKT-SKLM AP IIIT
                                </p>
                            </td>
                        </tr>
                    </>
                )}
            </tbody>
        </table>
    );
}
