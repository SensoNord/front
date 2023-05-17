import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { setCurrentSubjectDisplay } from '../../slicers/subject-slice';
import { SubjectType } from '../../type/SubjectType';

type SubjectItemProps = {
    subject: SubjectType;
    index: number;
};

export default function SubjectItem(props: SubjectItemProps) {
    const { subject, index } = props;
    const dispatch = useAppDispatch();
    const { currentSubjectDisplay } = useAppSelector(state => state.subject);
    const [isCurrentSubject, setIsCurrentSubject] = useState<boolean>(false);

    useEffect(() => {
        if (currentSubjectDisplay && currentSubjectDisplay.id === subject.id) {
            setIsCurrentSubject(true);
        } else {
            setIsCurrentSubject(false);
        }
    }, [currentSubjectDisplay, subject]);

    const handleChangeSelectedSubject = (subject: SubjectType) => {
        dispatch(setCurrentSubjectDisplay(subject));
    };

    return (
        <div
            key={index}
            onClick={() => handleChangeSelectedSubject(subject)}
            className={`${
                isCurrentSubject ? 'bg-blue-200' : ''
            } cursor-pointer`}
        >
            <h1>{subject.name}</h1>
        </div>
    );
}
