import { TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ErrorResponse } from "../../api/api";
import type { NotificationProps } from "../../components/notifications/Notification";
import Notification from "../../components/notifications/Notification";
import usePagination from "../../components/pagination/usePagination";
import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import TableComponent from "../../components/TableComponent";
import useAuthContext from "../../context/useAuthContext";
import ContactService from "../../services/ContactService";
import type { Contact } from "../../services/DtoModels";

export default function Dashboard() {
    const { user } = useAuthContext();
    const [allContacts, setAllContacts] = useState<Contact[]>([]);

    const [infoNotifications, setInfoNotifications] =
        useState<NotificationProps | null>(null);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const fetchAllContactReqs = useCallback(() => {
        ContactService.getContactRequests<Contact[]>()
            .then((resp) => {
                setAllContacts(resp.data);
            })
            .catch((e: ErrorResponse) => {
                if (e.errorCode === "500") {
                    setInfoNotifications({
                        type: "error",
                        messages: [
                            `We are facing unexpected issues, Please try again later. [${e.errorCode}]`,
                        ],
                    });
                    return;
                }
                setInfoNotifications({
                    type: "info",
                    messages: [e.errorMessage],
                });
            });
    }, []);

    useEffect(() => {
        fetchAllContactReqs();
    }, [fetchAllContactReqs]);

    const pagination = usePagination(allContacts, 10);

    function deleteContactRequest(contact: Contact) {
        if (
            window.confirm(
                `You sure want to delete @${contact.name}'s message?`,
            )
        ) {
            ContactService.deleteContactReq(contact.id)
                .then(() => {
                    setInfoNotifications({
                        type: "success",
                        messages: [
                            `@${contact.name}'s message has been deleted successfully`,
                        ],
                    });
                })
                .catch((e: ErrorResponse) => {
                    setInfoNotifications({
                        type: "error",
                        messages: [e.errorMessage],
                    });
                })
                .finally(() => {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                        setInfoNotifications(null);
                    }, 7000);
                });
        }
    }

    return (
        <SectionLayoutComponent
            title="Dashboard"
            description={`Welcome back ${user.name}.`}
            pagination={pagination}
        >
            {infoNotifications && (
                <Notification {...infoNotifications} customise="border-b-0" />
            )}
            <TableComponent
                body={pagination.currentItems}
                columns={[
                    { key: "name" },
                    { key: "email" },
                    { key: "message", customiseColumn: "line-clam-3" },
                    { key: "createdAt", alias: "Time" },
                ]}
                actionEvents={[
                    {
                        title: "Delete",
                        clickEvent: {
                            icon: TrashIcon,
                            className: "text-rose-400",
                            onClick: deleteContactRequest,
                        },
                    },
                ]}
            />
        </SectionLayoutComponent>
    );
}
