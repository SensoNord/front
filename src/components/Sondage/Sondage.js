import React from "react";
import { useState, useEffect } from 'react';
import AfficherSondage from "./AfficherSondage";
import { directus } from "../../libraries/directus";
import { getDataListeSondageById } from "./AfficherSondage";

export default function Sondage({ sondage_id }) {

    const [sondageExist, setSondageExist] = useState(true);
    const [dataListeSondage, setDataListeSondage] = useState({});
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const callGetUserId = async () => {
          const id = await getUserId();
          setUserId(id);
        }
        callGetUserId();
      }, [userId]);

      const getUserId = async () => {
        const currentUser = await directus.users.me.read({fields: ['id']});
        const userId = currentUser.id;
        return userId;
      };

      const getDataSondageById = async (sondage_id) => {
        const data = await directus.items('sondage').readByQuery({
          filter: {
            sondage_id: {
              _eq: sondage_id
            }
          }
        });
        return data.data[0]
      }
      useEffect(() => {
        Promise.all([getDataListeSondageById(sondage_id)]).then(([dataListeSondage]) => setDataListeSondage(dataListeSondage));
      }, []);

    const getIdParentSondageBySondageId = async (sondage_id) => {
        const data = await getDataSondageById(sondage_id);
        const IdParent = data.id;
        return IdParent;
      }

    const supprimerSondage = async () => {
        setSondageExist(false);
        const id = await getIdParentSondageBySondageId(sondage_id);
        directus.items('sondage').deleteOne(id)
            .then(() => {
                console.log('La ligne a été supprimée avec succès');
            })
            .catch((erreur) => {
                console.error('Erreur lors de la suppression de la ligne', erreur);
            });
        directus.items('liste_sondage').deleteOne(sondage_id)
            .then(() => {
                console.log('La ligne a été supprimée avec succès');
            })
            .catch((erreur) => {
                console.error('Erreur lors de la suppression de la ligne', erreur);
            });
    }
    return (
        <div>
            {sondageExist && (<div>
                <AfficherSondage sondage_id={sondage_id} userId={userId} />
                {userId === dataListeSondage.user_created &&
                    (<div>
                        <button onClick={supprimerSondage}>supprimer le sondage</button>
                    </div>
                    )}</div>
            )}
        </div>
    );
}