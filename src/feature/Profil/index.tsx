import ChangeName from "./ChangeName";
import { useState, useEffect } from 'react';
import { directus } from '../../libraries/directus';

export default function Profil() {

    const [userId, setUserId] = useState<string>('');;

    const getUserId = async () => {
        const currentUser = await directus.users.me.read({ fields: ['id'] });
        const userId = currentUser.id;
        setUserId(userId as string);
    };
    
    useEffect(() => {
        getUserId();
    }, []);
    return (
        <>
            <h1 className="">Profil</h1>
            <section>
            <div>

            </div>
            <input type="text"
            placeholder="email"
            name="email"
            id="changeEmail"
            className="w-1/5 bg-blue-100 hover:bg-blue-200 text-white font-bold py-2 px-4 mb-2 rounded"/>
            <ChangeName userId={userId}/>

            </section>
        </>
    );
}
