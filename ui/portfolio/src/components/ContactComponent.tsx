import { PiPaperPlaneTilt } from "react-icons/pi";
import SectionComponent from "./SectionComponent";

export default function ContactComponent() {
    return (
        <SectionComponent
            id="contact"
            aria-labelledby="contact-title"
            sectionTitle="Contact"
            className="lg:*:px-6 space-y-3 shadow-none! bg-bg-primary! backdrop-blur-none!"
        >
            <p>Send your quote here.</p>
            <form onSubmit={() => {}} className="grid gap-3 text-md">
                <label htmlFor="name">
                    <span>Name</span>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-bg-secondary px-2 py-1 w-full border border-primary/50 focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Your Name"
                    />
                </label>
                <label htmlFor="email">
                    <span>Email</span>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-bg-secondary px-2 py-1 w-full border border-primary/50 focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Your Email"
                    />
                </label>
                <label htmlFor="message">
                    <span>Quote or Message</span>
                    <textarea
                        name="message"
                        id="message"
                        placeholder="Your Quote or Message"
                        className="bg-bg-secondary px-2 py-1 w-full border border-primary/50 focus:ring-1 focus:ring-primary focus:outline-none"
                    ></textarea>
                </label>
                <button
                    type="submit"
                    className="w-fit ms-auto flex items-center gap-1"
                >
                    <PiPaperPlaneTilt />
                    Confirm Send
                </button>
            </form>
        </SectionComponent>
    );
}
