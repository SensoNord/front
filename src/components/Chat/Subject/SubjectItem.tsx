import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { setCurrentSubjectDisplay } from '../../../slicers/chat/subject-slice';
import { SubjectType } from '../../../types/Chat/SubjectType';
import { ChatEnum } from '../../../types/Chat/ChatEnum';

type SubjectItemProps = {
    subject: SubjectType;
    selectedChat: ChatEnum;
    handleSetSelectedChat: (selectedChat: ChatEnum) => void;
    className: string;
};

export default function SubjectItem(props: SubjectItemProps) {
    const { subject, handleSetSelectedChat, selectedChat, className } = props;
    const dispatch = useAppDispatch();
    const { currentSubjectDisplayWithAllRelatedData } = useAppSelector(
        state => state.subject,
    );
    const [isCurrentSubject, setIsCurrentSubject] = useState<boolean>(false);

    useEffect(() => {
        if (
            currentSubjectDisplayWithAllRelatedData &&
            currentSubjectDisplayWithAllRelatedData.id === subject.id &&
            selectedChat === ChatEnum.SUBJECT
        ) {
            setIsCurrentSubject(true);
        } else {
            setIsCurrentSubject(false);
        }
    }, [currentSubjectDisplayWithAllRelatedData, subject, selectedChat]);

    const handleChangeSelectedSubject = (subject: SubjectType) => {
        handleSetSelectedChat(ChatEnum.SUBJECT);
        dispatch(setCurrentSubjectDisplay(subject));
    };

    return (
        <div
            key={subject.id + 'item'}
            onClick={() => handleChangeSelectedSubject(subject)}
            className={`${
                isCurrentSubject ? 'bg-blue-200' : ''
            } cursor-pointer ${className}`}
        >
            <h1>{subject.name}</h1>
        </div>
    );
}
