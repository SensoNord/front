import { UserType } from "@directus/sdk";

type NameAndDateProps = {
    date_created: Date,
    user_created: UserType
}

export default function NameAndDate(props: NameAndDateProps) {
    const { date_created, user_created } = props;

    return (
        <>
            <div>
                <b>
                    {user_created.first_name + ' ' + user_created.last_name}
                </b>
                &nbsp;&nbsp;
                <span>
                    {(new Date(date_created)).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) + ', ' + (new Date(date_created)).toLocaleTimeString()}
                </span>
            </div>
        </>
    )
}