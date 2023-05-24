import { useState } from 'react';
import { PlusIcon, ListBulletIcon } from '@heroicons/react/24/outline';

export default function AddResponse({ data, onClose }) {
    const [affichePopup, setAffichePopup] = useState(false);
    const [nouvelElement, setNouvelElement] = useState('');

    const handleAjouter = () => {
        onClose(nouvelElement);
        setAffichePopup(false);
    };

    const handleAddNewElement = event => {
        event.preventDefault();
        setNouvelElement(event.target.value);
    };
    return (
        <div className="flex space-x-4 items-center justify-between">
            <ListBulletIcon
                className="h-8 w-8 cursor-pointer hover:text-gray-500"
                onClick={() => setAffichePopup(!affichePopup)}
            />
            {affichePopup && (
                <div className="flex space-x-4">
                    <input className="pl-2 rounded-lg" type="text" onChange={handleAddNewElement} />
                    <PlusIcon className="h-8 w-8 cursor-pointer hover:text-gray-500" onClick={handleAjouter} />
                </div>
            )}
        </div>
    );
}
