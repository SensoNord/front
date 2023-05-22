import AjouterReponse from './AddResponse';
import { useState, useEffect } from 'react';
import AddVote from './AddVote';
import { directus } from '../../libraries/directus';
import { Bar, Pie } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import Chart from 'chart.js/auto';

const getDataSondageById = async sondage_id => {
    const data = await directus.items('sondage').readByQuery({
        filter: {
            sondage_id: {
                _eq: sondage_id,
            },
        },
    });
    return data.data[0];
};

export const getDataListeSondageById = async sondage_id => {
    const data = await directus.items('liste_sondage').readOne(sondage_id);
    return data;
};

const getIdParentSondageBySondageId = async sondage_id => {
    const data = await getDataSondageById(sondage_id);
    const IdParent = data.id;
    return IdParent;
};

export default function DisplayPoll({ sondage_id, userId }) {
    const [isSondageLoaded, setIsSondageLoaded] = useState(false);
    const [dataSondage, setDataSondage] = useState({});
    const [dataListeSondage, setDataListeSondage] = useState({});
    const [isHistogramme, setIsHistogramme] = useState(true);
    const [isPie, setIsPie] = useState(false);
    const [sondageElementList, setSondageElementList] = useState([]);
    const [sondageListElementList, setSondageListElementList] = useState([]);

    const determineTypeSondage = () => {
        const type = dataListeSondage.typeSondage;
        if (type === 'Histogramme') {
            setIsPie(false);
            setIsHistogramme(true);
            setIsSondageLoaded(true);
        } else if (type === 'Diagramme circulaire') {
            setIsHistogramme(false);
            setIsPie(true);
            setIsSondageLoaded(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const dataSondage = await getDataSondageById(sondage_id);
            setDataSondage(dataSondage);
        };
        fetchData();
    }, [sondage_id, sondageElementList]);

    useEffect(() => {
        const fetchDataList = async () => {
            const dataListeSondage = await getDataListeSondageById(sondage_id);
            setDataListeSondage(dataListeSondage);
        };
        fetchDataList();
    }, [sondage_id, sondageListElementList]);

    useEffect(() => {
        determineTypeSondage();
        // eslint-disable-next-line
    }, [dataListeSondage]);

    const addUserToUserList = async () => {
        var nouveauVote = false;
        if (!dataListeSondage.user_list.includes(userId)) {
            dataListeSondage.user_list.push(userId);
            nouveauVote = true;
        }
        directus.items('liste_sondage').updateOne(sondage_id, {
            user_list: dataListeSondage.user_list,
        });
        return nouveauVote;
    };

    const voterElement = async (nouveauVote, choix) => {
        if (nouveauVote) {
            dataListeSondage.choix_user_list.push(choix);
            const indexChoix = dataSondage.reponses.indexOf(choix);
            dataSondage.nombre_vote[indexChoix] =
                dataSondage.nombre_vote[indexChoix] + 1;
        } else {
            const index = dataListeSondage.user_list.indexOf(userId);
            const ancienChoix = dataListeSondage.choix_user_list[index];
            const indexAncienChoix = dataSondage.reponses.indexOf(ancienChoix);
            dataSondage.nombre_vote[indexAncienChoix] =
                dataSondage.nombre_vote[indexAncienChoix] - 1;
            const indexChoix = dataSondage.reponses.indexOf(choix);
            dataSondage.nombre_vote[indexChoix] =
                dataSondage.nombre_vote[indexChoix] + 1;
            dataListeSondage.choix_user_list[index] = choix;
        }
        const id = await getIdParentSondageBySondageId(sondage_id);
        await directus
            .items('sondage')
            .updateOne(id, {
                nombre_vote: dataSondage.nombre_vote,
            })
            .then(data => {
                setSondageElementList(data);
            });

        await directus
            .items('liste_sondage')
            .updateOne(sondage_id, {
                choix_user_list: dataListeSondage.choix_user_list,
            })
            .then(data => {
                setSondageListElementList(data);
            });
    };

    const ajouter_element = async nouveauChoix => {
        dataSondage.reponses.push(nouveauChoix);
        dataSondage.nombre_vote.push(0);
        const id = await getIdParentSondageBySondageId(sondage_id);
        directus
            .items('sondage')
            .updateOne(id, {
                reponses: dataSondage.reponses,
                nombre_vote: dataSondage.nombre_vote,
            })
            .then(data => {
                setSondageElementList(data);
            });
    };

    const getData = () => {
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
    };
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
            {isSondageLoaded && (
                <div>
                    <AddVote
                        dataSondage={dataSondage}
                        ajouterVote={voterElement}
                        addUserToUserList={addUserToUserList}
                    />
                    {dataListeSondage?.isEditable && (
                        <AjouterReponse
                            data={dataSondage}
                            onClose={ajouter_element}
                        />
                    )}
                    {isHistogramme && (
                        <Bar data={getData()} options={options} />
                    )}
                    {isPie && <Pie data={getData()} options={options} />}
                </div>
            )}
        </div>
    );
}
