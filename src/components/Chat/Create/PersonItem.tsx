import { UserType } from '@directus/sdk';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

type PersonItemProps = {
    user: UserType;
    handleSelectUser: (user: UserType) => void;
    type: 'selected' | 'matched';
};

export default function PersonItem(props: PersonItemProps) {
    const { user, handleSelectUser, type } = props;

    return (
        <div
            className={`flex items-center justify-between my-1 px-2 py-1 cursor-pointer group ${
                type === 'matched' ? 'hover:bg-blue-100' : 'hover:bg-red-100'
            } rounded-lg w-full text-lg`}
            onClick={() => handleSelectUser(user)}
        >
            <p>
                {user.first_name} {user.last_name}
            </p>
            <div className="opacity-0 group-hover:opacity-100">
                {type === 'selected' ? <MinusIcon className="h-6 w-6" /> : <PlusIcon className="h-6 w-6" />}
            </div>
        </div>
    );
}
