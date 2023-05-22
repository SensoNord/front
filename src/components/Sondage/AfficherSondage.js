import AjouterReponse from "./AjouterReponse";
import { useState, useEffect } from 'react';
import AjoutVote from "./AjoutVote";
import { directus } from "../../libraries/directus";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale);

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
export const getDataListeSondageById = async (sondage_id) => {
  const data = await directus.items('liste_sondage').readOne(sondage_id);
  return data
}



const getIdParentSondageBySondageId = async (sondage_id) => {
  const data = await getDataSondageById(sondage_id);
  const IdParent = data.id;
  return IdParent;
}

export default function AfficherSondage({sondage_id, userId}) {

  const [dataSondage, setDataSondage] = useState({
  });

  const [dataListeSondage, setDataListeSondage] = useState({
  });

  const [isHistogramme, setIsHistogramme] = useState(true);
  const [isPie, setIsPie] = useState(false);

  const [sondageExist, setSondageExist] = useState(true);

  const determineTypeSondage=()=>{
      const type = dataListeSondage.typeSondage;
      if(type === 'Histogramme'){
        setIsPie(false);
        setIsHistogramme(true);
      }
      if(type === 'Diagramme circulaire'){
        setIsHistogramme(false);
        setIsPie(true);
      }
  }

  useEffect(() => {
    Promise.all([getDataSondageById(sondage_id)]).then(([dataSondage]) => setDataSondage(dataSondage));
  }, [dataSondage]);

  useEffect(() => {
    Promise.all([getDataListeSondageById(sondage_id)]).then(([dataListeSondage]) => setDataListeSondage(dataListeSondage));
    determineTypeSondage();
  }, [dataListeSondage]);

  const addUserToUserList = async () => {
    var nouveauVote = false;
    if(!dataListeSondage.user_list.includes(userId)){
      dataListeSondage.user_list.push(userId);
      nouveauVote = true;
    }
    directus.items('liste_sondage').updateOne(sondage_id, {
      user_list: dataListeSondage.user_list,
    })
      .then(() => {
        console.log('La ligne a été mise à jour avec succès');
      })
      .catch((erreur) => {
        console.error('Erreur lors de la mise à jour de la ligne addUser', erreur);
      });
    return nouveauVote;
 }

  const voterElement = async (nouveauVote, choix) => {
    if(nouveauVote){
      dataListeSondage.choix_user_list.push(choix);
      const indexChoix = dataSondage.reponses.indexOf(choix);
      dataSondage.nombre_vote[indexChoix] = dataSondage.nombre_vote[indexChoix] + 1;
    }
    else{
      const index = dataListeSondage.user_list.indexOf(userId);
      const ancienChoix = dataListeSondage.choix_user_list[index];
      const indexAncienChoix = dataSondage.reponses.indexOf(ancienChoix);
      dataSondage.nombre_vote[indexAncienChoix] = dataSondage.nombre_vote[indexAncienChoix] - 1;
      const indexChoix = dataSondage.reponses.indexOf(choix);
      dataSondage.nombre_vote[indexChoix] = dataSondage.nombre_vote[indexChoix] + 1;
      dataListeSondage.choix_user_list[index]= choix;
    }
    const id = await getIdParentSondageBySondageId(sondage_id);
    directus.items('sondage').updateOne(
      id, {
      nombre_vote: dataSondage.nombre_vote,
    })
      .then(() => {
        console.log('La ligne a été mise à jour avec succès')
        console.log(dataSondage);
      })
      .catch((erreur) => {
        console.error('Erreur lors de la mise à jour de la ligne voter', erreur);
      });
      directus.items('liste_sondage').updateOne(sondage_id, {
        choix_user_list: dataListeSondage.choix_user_list,
      })
        .then(() => {
          console.log('La ligne a été mise à jour avec succès')
        })
        .catch((erreur) => {
          console.error('Erreur lors de la mise à jour de la ligne', erreur);
        });
  };

  const ajouter_element = async (nouveauChoix) => {
    dataSondage.reponses.push(nouveauChoix);
    dataSondage.nombre_vote.push(0);
    const id = await getIdParentSondageBySondageId(sondage_id);
    directus.items('sondage').updateOne(id, {
      reponses: dataSondage.reponses,
      nombre_vote: dataSondage.nombre_vote,
    })
      .then(() => {
        console.log('La ligne a été mise à jour avec succès')
        console.log(dataSondage);
      })
      .catch((erreur) => {
        console.error('Erreur lors de la mise à jour de la ligne voter', erreur);
      });
  };

  const getData=()=>{
  const labels = dataSondage.reponses;
  const data = {
    labels: labels,
    datasets: [
      {
        label: dataListeSondage.nomSondage,
        data: dataSondage.nombre_vote,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  return data;
  }
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div>
    {sondageExist && (
    <div>
      <AjoutVote dataSondage={dataSondage} dataListeSondage={dataListeSondage} ajouterVote={voterElement} addUserToUserList={addUserToUserList}/>
      <AjouterReponse data={dataSondage} onClose={ajouter_element} />
      {isHistogramme && (<Bar data={getData()} options={options}/>)}
      {isPie && (<Pie data={getData()} options={options}/>)}
    </div>)}</div>
    );
}
  