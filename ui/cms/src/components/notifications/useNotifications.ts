import { useState, useCallback, type SetStateAction } from "react";
import type { NotificationProps } from "./Notification";

export type AllNotifications = Record<string, NotificationProps | null>;

export function useNotifications<T extends string>(services: T[]) {
    const [notifications, updateNotifications] = useState<AllNotifications>(() =>
        services.reduce((acc, service) => {
            acc[service] = null;
            return acc;
        }, {} as AllNotifications)
    );

    const setNotifications = useCallback(
        <K extends T>(
            belongs: K,
            value: SetStateAction<NotificationProps | null>
        ) => {
            updateNotifications((prev) => {
                const currentVal = prev[belongs] ?? ({} as NotificationProps);

                const nextValue =
                    typeof value === "function"
                        ? (value as (prevVal: NotificationProps | null) => NotificationProps | null)(
                              currentVal
                          )
                        : value;

                return {
                    ...prev,
                    [belongs]: nextValue,
                };
            });
        },
        []
    );

    const resetNotifications = useCallback((item?: T) => {
        if (!item) {
            updateNotifications((prev) =>
                Object.keys(prev).reduce((acc, key) => {
                    acc[key] = null;
                    return acc;
                }, {} as AllNotifications)
            );
        } else {
            updateNotifications((prev) => ({
                ...prev,
                [item]: null,
            }));
        }
    }, []);

    return { notifications, setNotifications, resetNotifications } as const;
}