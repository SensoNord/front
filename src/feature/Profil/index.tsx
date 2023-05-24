import ChangeName from './ChangeName';
import SendInvitation from '../../feature/Authentification/SendInvitation';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';

export default function Profil() {
    return (
        <>
            <section className="flex flex-row items-center mt-10 mb-20 space-y-10 space-x-10 justify-center">
                <div className="h-1/4 w-1/5">
                    <ChangeEmail />
                </div>
                <div className="h-1/2 w-1/5">
                    <ChangePassword />
                </div>

                <div className="h-3/4 w-1/5">
                    <ChangeName />
                </div>

                <div className="w-1/5">
                    <SendInvitation />
                </div>
            </section>
        </>
    );
}
