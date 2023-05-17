import { useAppSelector } from '../../App/hooks';
import SubjectNavbar from '../../components/Subject/SubjectNavbar';
import Subject from './Subject';

export default function Forum() {
    const { currentSubjectDisplay } = useAppSelector(state => state.subject);

    return (
        <>
            <div className="flex">
                <div className="w-1/4">
                    <SubjectNavbar />
                </div>
                {currentSubjectDisplay && (
                    <div className="w-3/4">
                        <Subject />
                    </div>
                )}
            </div>
        </>
    );
}
