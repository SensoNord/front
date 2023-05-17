import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {
    fetchAllVisibleSubjectAndRelatedPost,
    setCurrentSubjectDisplay,
} from '../../slicers/subject-slice';
import SubjectItem from './SubjectItem';

export default function SubjectNavbar() {
    const dispatch = useAppDispatch();
    const { subjectListDisplay } = useAppSelector(state => state.subject);

    useEffect(() => {
        const fetchAllSubject = async () => {
            // TODO:
            // Pour l'instant on fetch tout les subjects et tout les posts
            // Probablement vouer à disparaitre, plutot faire d'abord un fetchAllSubject (sans les posts)
            // puis quand on click sur un subject, on fetchAllPostBySubjectId
            await dispatch(fetchAllVisibleSubjectAndRelatedPost());
        };

        fetchAllSubject();
    }, [dispatch]);

    return (
        <>
            <div className="flex flex-col">
                {subjectListDisplay.map((subject, index) => {
                    return <SubjectItem subject={subject} index={index} />;
                })}
            </div>
        </>
    );
}
