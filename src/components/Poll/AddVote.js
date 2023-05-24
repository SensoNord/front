import { useState } from 'react';

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
            <button onClick={() => setShowPopup(true)}>voter</button>
            {showPopup && (
                <div>
                    <select onBlur={handleSelect}>
                        <option value="">Sélectionner une option</option>
                        {dataSondage.reponses.map((reponses, index) => (
                            <option key={index} value={reponses}>
                                {reponses}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAjouter}>Ajouter</button>
                    <button onClick={() => setShowPopup(false)}>Fermer</button>
                </div>
            )}
        </>
    );
}
