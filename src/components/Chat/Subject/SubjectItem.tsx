import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { setCurrentSubjectDisplay } from '../../../slicers/subject-slice';
import { SubjectType } from '../../../types/Chat/SubjectType';
import { ChatEnum } from '../../../types/Chat/ChatEnum';

type SubjectItemProps = {
    subject: SubjectType;
    selectedChat: ChatEnum;
    setSelectedChat: (selectedChat: ChatEnum) => void;
};

export default function SubjectItem(props: SubjectItemProps) {
    const { subject, setSelectedChat, selectedChat } = props;
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
        setSelectedChat(ChatEnum.SUBJECT);
        dispatch(setCurrentSubjectDisplay(subject));
    };

    return (
        <div
            key={subject.id + 'item'}
            onClick={() => handleChangeSelectedSubject(subject)}
            className={`${
                isCurrentSubject ? 'bg-blue-200' : ''
            } cursor-pointer`}
        >
            <h1>{subject.name}</h1>
        </div>
    );
}
