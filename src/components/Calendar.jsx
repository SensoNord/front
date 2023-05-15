import React, {useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import {ViewState, EditingState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {directus} from '../libraries/directus';
import {
    Scheduler,
    WeekView,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    ConfirmationDialog,
    Toolbar,
    DateNavigator,
    TodayButton,
    DragDropProvider,
    MonthView,
    DayView,
    ViewSwitcher,
    AllDayPanel,
    EditRecurrenceMenu,
} from '@devexpress/dx-react-scheduler-material-ui';
import {emptyCalendar} from "../type/CalendarType";

const Calendar = () => {
    const [calendar, setCalendar] = useState(emptyCalendar);

    let isSetup = false;

    useEffect(() => {
        if (!isSetup) {
            directus.auth
                .login({email: "**************", password: "**********"})
                .then(() => {
                    directus.items('Calendrier').readByQuery({limit: -1}).then((calendar) => {
                        if (calendar) {
                            calendar.data.map(c => {
                                commitChanges({added: c, changed: undefined, deleted: undefined})
                            })
                        }
                        isSetup = true;
                    });
                })
                .catch(() => {
                    window.alert('Invalid credentials');
                });
        }
    }, []);
    const [data, setData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');

    const currentDateChange = (currentDate) => {
        setCurrentDate(currentDate);
    };
    const currentViewNameChange = (currentViewName) => {
        setCurrentViewName(currentViewName);
    };

    async function createEvent (toAdd){

        await directus.items('Calendrier').createOne(
            {
                title: toAdd.title,
                startDate: toAdd.startDate,
                endDate: toAdd.endDate,
                notes: toAdd.notes,
                rRule:toAdd.rRule
            });
    }

    async function updateEvent (toUpdate,id,changed){
        if(toUpdate[id].allDay){
            let start = new Date(changed.startDate);
            let end = new Date(changed.endDate);
            start.setHours(0);
            start.setMinutes(0);
            let day = end.getDate();
            end.setDate(day+1);
            end.setHours(0);
            end.setMinutes(0)
            await directus.items('Calendrier').updateOne(id,
                {
                    startDate : start,
                    endDate : end
                });
            changed.startDate.setHours(0)
            changed.startDate.setMinutes(0)
            let day2 = changed.endDate.getDate();
            changed.endDate.setDate(day2+1);
            changed.endDate.setHours(0)
            changed.endDate.setMinutes(0)
        }
        if (toUpdate[id].title){
            await directus.items('Calendrier').updateOne(id,
                {
                    title : toUpdate[id].title
                });
        }
        if (toUpdate[id].startDate){
            await directus.items('Calendrier').updateOne(id,
                {
                    startDate : toUpdate[id].startDate
                });
        }
        if (toUpdate[id].endDate){
            await directus.items('Calendrier').updateOne(id,
                {
                    endDate : toUpdate[id].endDate
                });
        }
        if (toUpdate[id].notes){
            await directus.items('Calendrier').updateOne(id,
                {
                    notes : toUpdate[id].notes
                });
        }

        if (toUpdate[id].rRule){
            await directus.items('Calendrier').updateOne(id,
                {
                    rRule : toUpdate[id].rRule
                });
        }
        return await directus.items('Calendrier').readOne(id);

    }


    async function suppressEvent (toSuppress){
        await directus.items('Calendrier').deleteOne(toSuppress);
    }
    const commitChanges = ({added, changed, deleted}) => {
        setData((state) => {
            let updatedData = [...state];
            if (added) {
                if(added.id === undefined){
                    createEvent(added);
                    directus.items('Calendrier').readByQuery(
                        {
                        filter:{
                            title:{
                                _eq:added.title
                            },
                        },
                        fields:['id']
                        }).then((result)=>{
                        added = {id: result.data[0].id, ...added };
                        updatedData = [...updatedData, {...added}];
                        });
                    updatedData = [...updatedData, {...added}];
                    window.location.reload();
                }
                else{
                    let isHere = false;
                    updatedData.map(c =>{
                        if(c.id===added.id){
                            isHere = true;
                        }
                    });
                    if (!isHere){
                        console.log(added.title,added.startDate,new Date(added.startDate));
                        updatedData = [...updatedData, {...added}];
                    }
                }
            }

            if (changed) {
                let id;
                let chan
                for (let i in changed) {
                    id = i
                }
                for (let i in updatedData) {
                    if (updatedData[i].id === id){
                        chan = updatedData[i];
                    }
                }
                changed = updateEvent(changed,id,chan).then(changed = changed,
                    updatedData = updatedData.map((appointment) => (changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment)));
            }
            if (deleted !== undefined) {
                suppressEvent(deleted)
                updatedData = updatedData.filter((appointment) => appointment.id !== deleted);
            }
            return updatedData;
        });
    };

    return (
        <Paper>
            <Scheduler data={data} height={660}>
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={currentDateChange}
                    currentViewName={currentViewName}
                    onCurrentViewNameChange={currentViewNameChange}
                />
                <EditingState onCommitChanges={commitChanges}/>
                <IntegratedEditing/>

                <WeekView startDayHour={8} endDayHour={19}/>
                <WeekView name="work-week" displayName="Work Week" excludedDays={[0, 6]} startDayHour={9}
                          endDayHour={19}/>
                <MonthView/>
                <DayView/>
                <Appointments/>
                <AllDayPanel/>
                <EditRecurrenceMenu />
                <ConfirmationDialog/>
                <AppointmentTooltip showOpenButton showDeleteButton/>
                <Toolbar/>
                <DateNavigator/>
                <TodayButton/>
                <AppointmentForm/>
                <DragDropProvider/>
                <ViewSwitcher/>
            </Scheduler>
        </Paper>
    );
};

export default Calendar;
