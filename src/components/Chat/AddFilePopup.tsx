import DisplayFiles from '../Files/DisplayFiles';

type Props = {
    getFileFromDrive: Function;
    folderId: string;
    fileRef?: any;
    getFileFromComputer: Function;
    quitPopup: Function;
};

export default function AddFilePopup(props: Props) {
    const { getFileFromDrive, folderId, fileRef, getFileFromComputer, quitPopup } = props;

    return (
        <div className={'alertContainer'}>
            <div
                className={'alertPopup text-center grid grid-rows-[repeat(10,_minmax(0,_1fr))] grid-flow-col'}
                style={{ width: '50%', height: '80vh' }}
            >
                <div className={'row-[span_8_/_span_8] p-8 pb-0'}>
                    <DisplayFiles callbackOnClick={getFileFromDrive} startingFolderId={folderId} compactMode={true} />
                </div>
                <div className={'row-span-2 flex flex-col justify-center items-center'}>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        className={'w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded'}
                        ref={fileRef}
                        onChange={e => getFileFromComputer(e)}
                    />
                    <button
                        className={'bg-red-500 hover:bg-red-700 text-white w-1/2 font-bold py-2 px-4 rounded'}
                        onClick={() => quitPopup()}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}
