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
    console.log(calendar)
    const [data, setData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('work-week');

    const currentDateChange = (currentDate) => {
        setCurrentDate(currentDate);
    };
    const currentViewNameChange = (currentViewName) => {
        setCurrentViewName(currentViewName);
    };

    const commitChanges = ({added, changed, deleted}) => {
        setData((state) => {
            let updatedData = [...state];
            if (added) {
                console.log(added.id)
                if(added.id === undefined){
                    console.log('test')
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
            /*if (added & added.id == undefined) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                setData([...data, { id: startingAddedId, ...added }]);
            }*/
            if (changed) {
                updatedData = updatedData.map((appointment) => (changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment));
            }
            if (deleted !== undefined) {
                updatedData = updatedData.filter((appointment) => appointment.id !== deleted);
            }
            console.log(updatedData)
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
