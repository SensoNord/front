import ChangeName from "./ChangeName";
import { useState, useEffect } from 'react';
import { directus } from '../../libraries/directus';
import SendInvitation from '../../feature/Authentification/SendInvitation';
import ChangePassword from "./ChangePassword";
import ChangeEmail
 from "./ChangeEmail";
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
            <section className="flex flex-col items-center mt-10 mb-20 space-y-10">
                <div className="h-1/4 w-1/3">
                <ChangeEmail/>
                </div>
                <div className="h-1/2 w-1/3">
                    <ChangePassword userId={userId} />
                </div>

                <div className="h-3/4 w-1/3">
                    <ChangeName />
                </div>

                <div className='w-1/3'><SendInvitation /></div>

            </section>
        </>
    );
}
