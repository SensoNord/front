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
} from '@devexpress/dx-react-scheduler-material-ui';
import {emptyCalendar} from "../type/CalendarType";

const Calendar = () => {
    const [calendar, setCalendar] = useState(emptyCalendar);

    let isSetup = false;

    useEffect(() => {
        if (!isSetup) {
            directus.auth
                .login({email: "first.user@example.com", password: "password"})
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
    const [currentViewName, setCurrentViewName] = useState('work-week');

    const currentDateChange = (currentDate) => {
        setCurrentDate(currentDate);
    };
    const currentViewNameChange = (currentViewName) => {
        setCurrentViewName(currentViewName);
    };

    async function createEvent (toAdd){
        let add;
        if(toAdd.allDay == true){
            let start = toAdd.startDate.getTime()+3600000;
            start = new Date(start);
            let end = toAdd.endDate.getTime()+3600000;
            end = new Date(end);
            add = await  directus.items('Calendrier').createOne(
                {title :toAdd.title,
                    startDate: start,
                    endDate: end,
                    notes: toAdd.notes});
        }
        else{
            add =  await  directus.items('Calendrier').createOne(
                {title :toAdd.title,
                    startDate: toAdd.startDate,
                    endDate: toAdd.endDate,
                    notes: toAdd.notes});
        }

        return add

    }

    async function updateEvent (toUpdate,id){
        if (toUpdate[id].title){
            await directus.items('Calendrier').updateOne(id,
                {
                    title : toUpdate[id].title
                });
        }
        if (toUpdate[id].startDate){
            let start = toUpdate[id].startDate.getTime()+3600000;
            start = new Date(start);
            await directus.items('Calendrier').updateOne(id,
                {
                    startDate : start
                });
        }
        if (toUpdate[id].endDate){
            let end = toUpdate[id].endDate.getTime()+3600000;
            end = new Date(end);
            await directus.items('Calendrier').updateOne(id,
                {
                    endDate : end
                });
        }
        if (toUpdate[id].notes){
            await directus.items('Calendrier').updateOne(id,
                {
                    notes : toUpdate[id].notes
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
                    added = createEvent(added).then(added = added,
                    updatedData = [...updatedData, {...added}])
                }
                let isHere = false;
                updatedData.map(c =>{
                    if(c.id===added.id){
                        isHere = true;
                    }
                });
                if (!isHere){
                    updatedData = [...updatedData, {...added}];
                }
            }

            if (changed) {
                let id;
                for (let i in changed) {
                    id = i
                }
                changed = updateEvent(changed,id).then(changed = changed,
                    updatedData = updatedData.map((appointment) => (changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment)));

            }
            if (deleted !== undefined) {
                console.log(deleted)
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

                <WeekView startDayHour={9} endDayHour={19}/>
                <WeekView name="work-week" displayName="Work Week" excludedDays={[0, 6]} startDayHour={9}
                          endDayHour={19}/>
                <MonthView/>
                <DayView/>
                <Appointments/>
                <AllDayPanel/>
                <ConfirmationDialog ignoreCancel/>
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
