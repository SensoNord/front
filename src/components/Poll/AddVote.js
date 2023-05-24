import { useState } from 'react';
import { ChartPieIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

export default function AddVote({ dataSondage, ajouterVote, addUserToUserList }) {
    const [showPopup, setShowPopup] = useState(false);
    const [Element, setElement] = useState('');

    const handleSelect = event => {
        setElement(event.target.value);
    };

    const handleAjouter = async () => {
        const isNouveauVote = await addUserToUserList();
        ajouterVote(isNouveauVote, Element);
        setShowPopup(false);
        setElement('');
    };

    return (
        <>
            <div className="flex space-x-4">
                <ChartPieIcon
                    className="h-8 w-8 cursor-pointer hover:text-gray-500"
                    onClick={() => setShowPopup(!showPopup)}
                />
                {showPopup && (
                    <div className="flex space-x-4">
                        <select onBlur={handleSelect} className="rounded-lg">
                            <option value="">Voter</option>
                            {dataSondage.reponses.map((reponses, index) => (
                                <option key={index} value={reponses}>
                                    {reponses}
                                </option>
                            ))}
                        </select>
                        <HandThumbUpIcon
                            className="h-8 w-8 cursor-pointer hover:text-gray-500"
                            onClick={handleAjouter}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
