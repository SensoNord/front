import React from "react";

type NameAndDateProps = {
    date_created: Date,
    user_created: {
        first_name: string,
        last_name: string
    }
}

export default function NameAndDate(props: NameAndDateProps) {
    return (
        <>
            <div>
                <b>
                    {props.user_created.first_name + ' ' + props.user_created.last_name}
                </b>
                &nbsp;&nbsp;
                <span>
                {(new Date(props.date_created)).toLocaleDateString('fr-FR', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}) + ', ' + (new Date(props.date_created)).toLocaleTimeString()}
                </span>
            </div>
        </>
    )
}