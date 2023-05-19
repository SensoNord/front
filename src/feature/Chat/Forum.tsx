import {useAppSelector} from '../../App/hooks';
import SubjectNavbar from '../../components/Subject/SubjectNavbar';
import Subject from './Subject';

export default function Forum() {
    const {currentSubjectDisplayWithAllRelatedData} = useAppSelector(
        state => state.subject,
    );

    return (
        <>
            <div className="grid grid-cols-12">
                <div className="col-span-2">
                    <SubjectNavbar/>
                </div>
                {currentSubjectDisplayWithAllRelatedData && (
                    <div className="col-span-10">
                        <div style={{height: '800px', width: '80%'}} className={"mx-auto my-16 border-2 border-black"}>
                            <Subject/>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
