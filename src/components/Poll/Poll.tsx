import { useState, useEffect } from 'react';
import DisplayPoll from './DisplayPoll';
import { directus } from '../../libraries/directus';
import { getDataListeSondageById } from './DisplayPoll';

type PollProps = {
    sondage_id: number;
};

export default function Poll({ sondage_id }: PollProps) {
    const [sondageExist, setSondageExist] = useState<boolean>(false);
    const [dataListeSondage, setDataListeSondage] = useState<any>({});
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        getUserId();
    }, []);

    const getUserId = async () => {
        const currentUser = await directus.users.me.read({ fields: ['id'] });
        const userId = currentUser.id;
        setUserId(userId as unknown as number);
    };

    async function getDataSondageById(sondage_id: number) {
        const data = await directus.items('sondage').readByQuery({
            filter: {
                sondage_id: {
                    _eq: sondage_id,
                },
            },
        });
        return data.data ? data.data[0] : null;
    }

    useEffect(() => {
        getDataListeSondageById(sondage_id).then(dataListeSondage => {
            setDataListeSondage(dataListeSondage as any);
            if (dataListeSondage) {
                setSondageExist(true);
            }
        });
    }, [sondage_id]);

    const getIdParentSondageBySondageId = async (sondage_id: number) => {
        const data = (await getDataSondageById(sondage_id)) as any;
        const IdParent = data?.id;
        return IdParent as number;
    };

    const supprimerSondage = async () => {
        setSondageExist(false);
        const id = await getIdParentSondageBySondageId(sondage_id);
        await directus.items('sondage').deleteOne(id);
        await directus.items('liste_sondage').deleteOne(sondage_id);
    };

    return (
        <div>
            {sondageExist && (
                <div>
                    <DisplayPoll sondage_id={sondage_id} userId={userId} />
                    {userId === dataListeSondage.user_created && (
                        <div>
                            <button onClick={supprimerSondage}>
                                supprimer le sondage
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
