import InputComponent from "../../../components/formelements/InputComponent";
import type { About } from "../../../services/DtoModels";
import { DateFormatter } from "../../../utils/DateFormatter";

export default function AboutComponent({
    about,
    checked,
    onClick,
}: {
    about: About;
    checked: boolean;
    onClick: (about: About) => void;
}) {
    return (
        <div
            className="relative rounded shadow-sm border p-3 space-y-2 hover:bg-slate-50 hover:dark:bg-slate-950 hover:shadow-md cursor-pointer"
            onClick={() => {
                onClick(about);
            }}
        >
            <div className="absolute top-0 right-0 m-3">
                <InputComponent
                    type="checkbox"
                    className="size-5"
                    checked={checked}
                    readOnly
                />
            </div>
            <h3 className="text-lg font-semibold">{about.name}</h3>
            <hr className="border-t" />
            <p>
                <b className="mr-1 capitalize">CreatedOn: </b>
                {DateFormatter.toFormattedDate(about.createdAt)}
            </p>
            <p>
                <b className="mr-1">summary: </b>
                <q>{about.summary}</q>
            </p>
        </div>
    );
}
