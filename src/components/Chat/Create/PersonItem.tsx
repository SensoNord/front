import { UserType } from '@directus/sdk';

type PersonItemProps = {
    user: UserType;
    handleSelectUser: (user: UserType) => void;
};

export default function PersonItem(props: PersonItemProps) {
    const { user, handleSelectUser } = props;

    const className = 'my-1 px-2 py-1 cursor-pointer hover:bg-blue-100 rounded-lg w-full flex justify-start text-lg';

    return (
        <div className={className} onClick={() => handleSelectUser(user)}>
            <p>
                {user.first_name} {user.last_name}
            </p>
        </div>
    );
}
