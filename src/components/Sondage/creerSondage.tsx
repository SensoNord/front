import React from 'react';
import { useState } from "react";
import { directus } from "../../libraries/directus";
import moment from 'moment';

function CreerSondage() {
  const [showPopup, setShowPopup] = useState(false);
  const [nomSondage, setNomSondage] = useState('');
  const [typeSondage, setTypeSondage] = useState('');
  const [idSondage, setIdSondage] = useState(0);
  const [reponseSondage, setReponseSondage] = useState('');
  

  const getUserId = async () => {
  const currentUser = await directus.users.me.read({fields: ['id']});
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
        user_created: await getUserId()
      });

      if (listeSondageItem !== null && typeof listeSondageItem === 'object' && 'id' in listeSondageItem) {
        const parentId = listeSondageItem.id as number;
        await directus.items('sondage').createOne({
          sondage_id: parentId,
          reponses: [reponseSondage],
          nombre_vote: [0]
        });
        
        setIdSondage(parentId);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élément:', error);
      throw error;
    }
  };

  const initialisationPopup = () => {
    setShowPopup(true);
    setNomSondage('');
    setTypeSondage('');
  }

  const handleInputNomSondage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNomSondage(event.target.value);
  };

  const handleInputReponseSondage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReponseSondage(event.target.value);
  };

  const handleInputTypeSondage = (type: string) => {
    setTypeSondage(type);
  };

  const  handleSubmit = async (typeSondage: string, nomSondage: string) => {
    setShowPopup(false);
    await createSondage(typeSondage, nomSondage);
    setReponseSondage('');
  };

  const closePopup = () => {
    setShowPopup(false);
  }

  return (
    <div>
      <button onClick={initialisationPopup}>
        Créer un sondage
      </button>
      {showPopup &&
        (<div className="">
          <div className="">
            <h1 >Créer votre sondage</h1>
            <p >Quel est l'intitulé de votre sondage ?</p>
            <input type="text" placeholder="Nom du sondage" value={nomSondage} onChange={handleInputNomSondage} />
            <p >Quel type de sondage voulez-vous ?</p>
            <div className={"flex flex-row"}>
              <button className="bg-white focus:bg-blue-100 p-2 rounded" onClick={() => handleInputTypeSondage('Histogramme')}>Histogramme</button>
              <button className="bg-white focus:bg-blue-100 p-2 rounded" onClick={() => handleInputTypeSondage('Diagramme circulaire')}>Diagramme circulaire</button>
            </div>
            <div>
            <input  type="text" placeholder="Reponse sondage" value={reponseSondage} onChange={handleInputReponseSondage} />
            </div>
            <div>
              <button onClick={() => handleSubmit(typeSondage, nomSondage)}>Submit</button>
              <button onClick={closePopup}>Fermer</button>
            </div>
          </div>
        </div>)}
    </div>
  );
}

export default CreerSondage;