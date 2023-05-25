import React, { useEffect } from 'react';
import { useState } from 'react';
import { directus } from '../../libraries/directus';
import moment from 'moment';
import { Switch } from '@headlessui/react';
import { ChartBarIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type CreatPollProps = {
    setSondageId: (id: number) => void;
    nomSondage: string;
    setNomSondage: (nom: string) => void;
};

export default function CreatePoll(props: CreatPollProps) {
    const { setSondageId, nomSondage, setNomSondage } = props;
    const [showPopup, setShowPopup] = useState(false);
    const [typeSondage, setTypeSondage] = useState('');
    const [idSondage, setIdSondage] = useState(0);
    const [reponseSondage, setReponseSondage] = useState<string[]>([]);
    const [enabled, setEnabled] = useState(false);

    const responseRef = React.useRef<HTMLInputElement>(null);

    const getUserId = async () => {
        const currentUser = await directus.users.me.read({ fields: ['id'] });
        const userId = currentUser.id;
        return userId;
    };

    const createSondage = async (typeSondage: string, nomSondage: string) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            const listeSondageItem = await directus.items('liste_sondage').createOne({
                typeSondage: typeSondage,
                nomSondage: nomSondage,
                date_creation: now,
                user_list: [],
                choix_user_list: [],
                user_created: await getUserId(),
                isEditable: enabled,
            });

            if (listeSondageItem !== null && typeof listeSondageItem === 'object' && 'id' in listeSondageItem) {
                const parentId = listeSondageItem.id as number;
                await directus.items('sondage').createOne({
                    sondage_id: parentId,
                    reponses: reponseSondage,
                    nombre_vote: [0],
                });

                setIdSondage(parentId);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'élément:", error);
            throw error;
        }
    };

    const initialisationPopup = () => {
        setShowPopup(true);
        setNomSondage('');
        setTypeSondage('');
        setReponseSondage([]);
    };

    const handleInputNomSondage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomSondage(event.target.value);
    };

    const handleAddReponseSondage = () => {
        if (responseRef.current !== null) {
            const value = responseRef.current.value;
            setReponseSondage([...reponseSondage, value]);
            responseRef.current.value = '';
        }
    };

    const handleDeleteReponseSondage = (index: number) => {
        const newReponseSondage = [...reponseSondage];
        newReponseSondage.splice(index, 1);
        setReponseSondage(newReponseSondage);
    };

    const handleInputTypeSondage = (type: string) => {
        setTypeSondage(type);
    };

    const handleSubmit = async (typeSondage: string, nomSondage: string) => {
        setShowPopup(false);
        await createSondage(typeSondage, nomSondage);
        setReponseSondage([]);
    };

    useEffect(() => {
        setSondageId(idSondage);
    }, [idSondage, setSondageId]);

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <button onClick={initialisationPopup} type={'button'} className={'mx-2 px-1 my-1 py-1 cursor-pointer'}>
                <ChartBarIcon className="h-7 w-7 hover:text-gray-500" />
            </button>
            {showPopup && (
                <div className="alertContainer">
                    <div className="alertPopup" style={{ minWidth: '600px', minHeight: '480px', padding: '0.5rem' }}>
                        <h1 className={'font-bold text-xl'}>Créer votre sondage</h1>
                        <div>
                            <label htmlFor={'namePoll'} className={'cursor-pointer'}>
                                Quel est l'intitulé de votre sondage ?
                            </label>
                            <input
                                id={'namePoll'}
                                type="text"
                                placeholder="Nom du sondage"
                                value={nomSondage}
                                onChange={handleInputNomSondage}
                                className={'border-2 border-gray-300 py-2 mt-2 px-3 rounded-md w-8/12 mx-auto'}
                            />
                        </div>
                        <div>
                            <p>Quel type de sondage voulez-vous ?</p>
                            <div className={'flex flex-row justify-center mt-2 gap-x-4'}>
                                <button
                                    type={'button'}
                                    className="bg-blue-50 focus:bg-blue-300 p-2 rounded"
                                    onClick={() => handleInputTypeSondage('Histogramme')}
                                >
                                    Histogramme
                                </button>
                                <button
                                    type={'button'}
                                    className="bg-blue-50 focus:bg-blue-300 p-2 rounded"
                                    onClick={() => handleInputTypeSondage('Diagramme circulaire')}
                                >
                                    Diagramme circulaire
                                </button>
                            </div>
                        </div>
                        <div className={'flex flex-col items-center'}>
                            <label htmlFor={'switch'}>
                                Voulez vous que les utilisateurs puissent ajouter des réponses ?
                            </label>
                            <Switch
                                id={'switch'}
                                checked={enabled}
                                onChange={setEnabled}
                                className={`${
                                    enabled ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Enable adding responses</span>
                                <span
                                    className={`${
                                        enabled ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                            </Switch>
                        </div>
                        <div>
                            <p>Réponses :</p>
                            <ul className={'list-disc list-inside'}>
                                <div
                                    className="pb-4"
                                    style={{
                                        minHeight: '200px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    {reponseSondage.map((reponse, index) => (
                                        <li key={index} className={'my-1'}>
                                            {reponse}{' '}
                                            <TrashIcon
                                                className={'h-4 w-4 cursor-pointer inline ml-2 mb-1'}
                                                onClick={() => {
                                                    handleDeleteReponseSondage(index);
                                                }}
                                            />
                                        </li>
                                    ))}
                                </div>
                            </ul>
                        </div>
                        <div className={'flex justify-center items-center'}>
                            <input
                                type="text"
                                placeholder="Reponse sondage"
                                ref={responseRef}
                                className={'border-2 border-gray-300 py-2 px-3 mr-4 rounded-md w-6/12'}
                            />
                            <PlusIcon className={'h-6 w-6 cursor-pointer'} onClick={handleAddReponseSondage} />
                        </div>
                        <div className={'flex justify-evenly h-12 items-center mt-2'}>
                            <button
                                className={
                                    'bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded'
                                }
                                onClick={() => handleSubmit(typeSondage, nomSondage)}
                            >
                                Ajouter
                            </button>
                            <button
                                className={'bg-red-500 hover:bg-red-700 text-white w-1/6 font-bold py-2 px-4 rounded'}
                                onClick={closePopup}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
