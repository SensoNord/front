// For testing purposes

import { useEffect } from 'react';
import { useAppDispatch } from '../../App/hooks';
import CreerSondage from '../../components/Sondage/creerSondage';
import Sondage from '../../components/Sondage/Sondage';
import { fetchSubject } from '../../slicers/subject-slice';


export default function Home() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchSubject('28730aa8-275a-4b16-9ff2-1494f5342243'));
    }, [dispatch]);

    return (
        <>
            <h1 className="">Home</h1>

            <Sondage sondage_id={10} />
            
        </>
    );
}
