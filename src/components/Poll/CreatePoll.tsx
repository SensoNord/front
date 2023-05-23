import React, { useEffect } from 'react';
import { useState } from 'react';
import { directus } from '../../libraries/directus';
import moment from 'moment';
import { Switch } from '@headlessui/react';

type CreatPollProps = {
    setSondageId: (id: number) => void;
};

export default function CreatePoll(props: CreatPollProps) {
    const { setSondageId } = props;
    const [showPopup, setShowPopup] = useState(false);
    const [nomSondage, setNomSondage] = useState('');
    const [typeSondage, setTypeSondage] = useState('');
    const [idSondage, setIdSondage] = useState(0);
    const [reponseSondage, setReponseSondage] = useState('');
    const [enabled, setEnabled] = useState(false);

    const getUserId = async () => {
        const currentUser = await directus.users.me.read({ fields: ['id'] });
        const userId = currentUser.id;
        return userId;
    };

    const createSondage = async (typeSondage: string, nomSondage: string) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            const listeSondageItem = await directus
                .items('liste_sondage')
                .createOne({
                    typeSondage: typeSondage,
                    nomSondage: nomSondage,
                    date_creation: now,
                    user_list: [],
                    choix_user_list: [],
                    user_created: await getUserId(),
                    isEditable: enabled,
                });

            if (
                listeSondageItem !== null &&
                typeof listeSondageItem === 'object' &&
                'id' in listeSondageItem
            ) {
                const parentId = listeSondageItem.id as number;
                await directus.items('sondage').createOne({
                    sondage_id: parentId,
                    reponses: [reponseSondage],
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
    };

    const handleInputNomSondage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNomSondage(event.target.value);
    };

    const handleInputReponseSondage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setReponseSondage(event.target.value);
    };

    const handleInputTypeSondage = (type: string) => {
        setTypeSondage(type);
    };

    const handleSubmit = async (typeSondage: string, nomSondage: string) => {
        setShowPopup(false);
        await createSondage(typeSondage, nomSondage);
        setReponseSondage('');
    };

    useEffect(() => {
        setSondageId(idSondage);
    }, [idSondage, setSondageId]);

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <button onClick={initialisationPopup}>Créer un sondage</button>
            {showPopup && (
                <div className="">
                    <div className="">
                        <h1>Créer votre sondage</h1>
                        <p>Quel est l'intitulé de votre sondage ?</p>
                        <input
                            type="text"
                            placeholder="Nom du sondage"
                            value={nomSondage}
                            onChange={handleInputNomSondage}
                        />
                        <p>Quel type de sondage voulez-vous ?</p>
                        <div className={'flex flex-row'}>
                            <button
                                className="bg-white focus:bg-blue-100 p-2 rounded"
                                onClick={() =>
                                    handleInputTypeSondage('Histogramme')
                                }
                            >
                                Histogramme
                            </button>
                            <button
                                className="bg-white focus:bg-blue-100 p-2 rounded"
                                onClick={() =>
                                    handleInputTypeSondage(
                                        'Diagramme circulaire',
                                    )
                                }
                            >
                                Diagramme circulaire
                            </button>
                        </div>
                        <p>
                            Voulez vous que les utilisateurs puissent ajouter
                            des réponses ?
                        </p>
                        <Switch
                            checked={enabled}
                            onChange={setEnabled}
                            className={`${
                                enabled ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">
                                Enable adding responses
                            </span>
                            <span
                                className={`${
                                    enabled ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                        </Switch>
                        <div>
                            <input
                                type="text"
                                placeholder="Reponse sondage"
                                value={reponseSondage}
                                onChange={handleInputReponseSondage}
                            />
                        </div>
                        <div>
                            <button
                                onClick={() =>
                                    handleSubmit(typeSondage, nomSondage)
                                }
                            >
                                Submit
                            </button>
                            <button onClick={closePopup}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
