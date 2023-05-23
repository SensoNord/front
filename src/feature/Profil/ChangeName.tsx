import {useState} from 'react';
import { directus } from '../../libraries/directus';

export default function ChangeName({ userId }: { userId: string }){

    const [isChange, setIsChange]=useState(false);
    const [nouveauNom, setNouveauNom]=useState('');

    const handleChangeName = () => {
        setIsChange(true);
    }

    const handleInputNouveauName = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNouveauNom(event.target.value);
    };

    const updateName = async () =>{
        await directus.users.me.update({ first_name: nouveauNom});
    }
    return(
        <div>
            <p>{userId}</p>
            <button onClick={handleChangeName}>changer son Nom</button>
            {isChange && (
                <div>
                    <input type="text"
            placeholder="Nouveau nom"
            name="Nouveau nom"
            id="newName"
            className="w-1/5 bg-blue-100 hover:bg-blue-200 text-white font-bold py-2 px-4 mb-2 rounded"
            onChange={handleInputNouveauName}/>
            <button onClick={updateName}>Valider</button>
                </div>
            
            )}
            
        </div>
    );
}