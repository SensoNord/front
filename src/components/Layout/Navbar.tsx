import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../App/hooks';
import { logout } from '../../slicers/authentification/auth-slice';

export default function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav>
            <div>
                <Link to="/home">Home</Link>
            </div>
            <div>
                <Link to="/home2">Home2</Link>
            </div>
            <div>
                <Link to="/send-invitation">Send Invitation</Link>
            </div>
            <div>
                <Link to="/drive">Drive</Link>
            </div>
            <div>
                <Link to="/chat">Chat</Link>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}
