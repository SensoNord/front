import ChangeName from './ChangeName';
import SendInvitation from '../../feature/Authentification/SendInvitation';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { useState, useEffect } from 'react';

export default function Profil() {
    const dispatch = useAppDispatch();
    const { connectedUserRole } = useAppSelector(state => state.auth);
    const [isAdministrator, setIsAdministrator] = useState<boolean>(false);

    useEffect(() => {
        setIsAdministrator(connectedUserRole.name === 'Administrator');
    }, [connectedUserRole.name]);

    return (
        <section
            className={`grid grid-cols-1 tablet:grid-cols-2 desktop:gap-1 gap-4 items-stretch mt-10 mb-20 ${
                isAdministrator ? 'desktop:grid-cols-4' : 'desktop:grid-cols-3'
            }`}
        >
            <div className="flex justify-center items-center">
                <ChangeEmail />
            </div>
            <div className="flex justify-center items-center">
                <ChangePassword />
            </div>
            <div className="flex justify-center items-center">
                <ChangeName />
            </div>
            {isAdministrator && (
                <div className="flex justify-center items-center">
                    <SendInvitation />
                </div>
            )}
            ;
        </section>
    );
}
