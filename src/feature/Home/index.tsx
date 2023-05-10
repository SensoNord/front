// For testing purposes

import { useEffect } from 'react';
import { useAppDispatch } from '../../App/hooks';
import { fetchSubject } from '../../slicers/subject-slice';
import InvitationMenu from '../Authentification/SendInvitation';

export default function Home() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchSubject('28730aa8-275a-4b16-9ff2-1494f5342243'));
    }, [dispatch]);

    return (
        <>
            <h1 className="">Home</h1>
        </>
    );
}
