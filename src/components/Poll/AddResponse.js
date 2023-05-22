import { useState } from 'react';

export default function AddResponse({ data, onClose }) {
    const [affichePopup, setAffichePopup] = useState(false);
    const [nouvelElement, setNouvelElement] = useState('');

    const handleAjouter = () => {
        onClose(nouvelElement);
        setAffichePopup(false);
    };
    const handleClosepopup = () => {
        setAffichePopup(false);
    };
    const handleAddNewElement = event => {
        event.preventDefault();
        setNouvelElement(event.target.value);
    };
    return (
        <div>
            <button onClick={() => setAffichePopup(true)}>
                Ajouter un élément
            </button>
            {affichePopup && (
                <div>
                    <input type="text" onChange={handleAddNewElement} />
                    <button onClick={handleAjouter}>Ajouter</button>
                    <button onClick={handleClosepopup}>Annuler</button>
                </div>
            )}
        </div>
    );
}
