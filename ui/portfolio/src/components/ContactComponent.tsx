import { useState, type SubmitEvent } from "react";
import { PiPaperPlaneTilt } from "react-icons/pi";
import PublicationService from "../services/PublicationService";
import type { NotificationProps } from "./notifications/Notification";
import Notification from "./notifications/Notification";
import SectionComponent from "./SectionComponent";

export default function ContactComponent({ email }: { email: string }) {
    const [inProgress, setInprogress] = useState<boolean>(false);
    const [notification, setNotification] = useState<NotificationProps | null>(
        null,
    );

    function sendQuote(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setInprogress(true);
        const formData = new FormData(e.currentTarget);

        const message = String(formData.get("message"));

        if (message.length > 250) {
            setNotification({
                type: "info",
                messages: [
                    `Perhaps you should email me directly on ${email}. Or send a shorter message, I will contact you myself.`,
                ],
            });
            return;
        }

        const payload = {
            name: String(formData.get("name")),
            email: String(formData.get("email")),
            message,
        };

        PublicationService.sendQuote(payload)
            .then(() => {
                setNotification({
                    type: "success",
                    messages: [
                        `Hi ${formData.get("name")}! I just recieved your message. Thank you.`,
                    ],
                });
            })
            .catch(() => {
                setNotification({
                    type: "error",
                    messages: [
                        `Hmmm... Seems this page wants my attention. Please contact me directly on ${email}.`,
                    ],
                });
            })
            .finally(() => {
                setInprogress(false);
                const timeout = setTimeout(() => {
                    setNotification(null);
                }, 7000);

                return clearTimeout(timeout);
            });
    }

    return (
        <SectionComponent
            id="contact"
            aria-labelledby="contact-title"
            sectionTitle="Contact"
            className="lg:*:px-6 space-y-3 shadow-none! bg-bg-primary! backdrop-blur-none!"
        >
            <p>Send your quote here.</p>
            {notification && <Notification {...notification} />}
            <form onSubmit={sendQuote} className="grid gap-3 text-md">
                <label htmlFor="name">
                    <span>Name</span>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-bg-secondary px-2 py-1 w-full border border-primary/50 focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Your Name"
                        required
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
                        required
                    />
                </label>
                <label htmlFor="message">
                    <span>Quote or Message</span>
                    <textarea
                        name="message"
                        id="message"
                        placeholder="Your Quote or Message"
                        required
                        className="bg-bg-secondary px-2 py-1 w-full border border-primary/50 focus:ring-1 focus:ring-primary focus:outline-none"
                    ></textarea>
                </label>
                <button
                    type="submit"
                    className="ms-auto flex items-center gap-1 -translate-x-0.5"
                    disabled={inProgress}
                >
                    {inProgress ? (
                        <span className="animate-spin border-2 rounded-full border-t-slate-300 border-primary size-5"></span>
                    ) : (
                        <span>
                            <PiPaperPlaneTilt />
                        </span>
                    )}
                    Confirm Quote
                </button>
            </form>
        </SectionComponent>
    );
}
