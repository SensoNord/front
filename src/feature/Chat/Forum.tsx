import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import SubjectNavbar from '../../components/Subject/SubjectNavbar';
import Subject from './Subject';
import {
    fetchConnectedUser,
    fetchConnectedUserRole,
} from '../../slicers/auth-slice';

export default function Forum() {
    const { currentSubjectDisplayWithAllRelatedData } = useAppSelector(
        state => state.subject,
    );
    const dispatch = useAppDispatch();

    return (
        <>
            <div className="flex">
                <div className="w-1/4">
                    <SubjectNavbar />
                </div>
                {currentSubjectDisplayWithAllRelatedData && (
                    <div className="w-3/4">
                        <Subject />
                    </div>
                )}
            </div>
        </>
    );
}
