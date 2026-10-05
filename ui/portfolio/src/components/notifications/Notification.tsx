export type NotificationProps = {
    type: "success" | "error" | "info";
    messages: string[];
    customise?: string;
};

export default function Notification({
    type,
    messages,
    customise,
}: NotificationProps) {
    return (
        messages.length > 0 && (
            <div
                className={`p-2.5 col-span-full flex flex-row gap-2 items-center dark:text-white text-sm rounded-sm 
                                ${
                                    type == "success"
                                        ? " bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                        : type == "info"
                                          ? " bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                                          : " bg-rose-500/10 text-rose-700 dark:text-rose-400"
                                } ${customise}`}
            >
                <span>{messages.join(", ")}</span>
            </div>
        )
    );
}
