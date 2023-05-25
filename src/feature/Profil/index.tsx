import ChangeName from './ChangeName';
import SendInvitation from '../../feature/Authentification/SendInvitation';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';

export default function Profil() {
    return (
        <section className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 desktop:gap-1 gap-4 items-stretch mt-10 mb-20">
            <div className="flex justify-center items-center">
                <ChangeEmail />
            </div>
            <div className="flex justify-center items-center">
                <ChangePassword />
            </div>
            <div className="flex justify-center items-center">
                <ChangeName />
            </div>
            <div className="flex justify-center items-center">
                <SendInvitation />
            </div>
        </section>
    );
}
