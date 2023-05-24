import ChangeName from './ChangeName';
import SendInvitation from '../../feature/Authentification/SendInvitation';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';

export default function Profil() {
    return (
        <>
            <section className="flex flex-row items-center mt-10 mb-20 ml-2 mr-2 space-x-2 justify-between">
                <div className="w-1/4 h-1/2">
                    <ChangeEmail />
                </div>
                <div className="w-1/4 h-1/2">
                    <ChangePassword />
                </div>

                <div className="w-1/4 h-1/2">
                    <ChangeName />
                </div>

                <div className="w-1/4 h-1/2">
                    <SendInvitation />
                </div>
            </section>
        </>
    );
}
