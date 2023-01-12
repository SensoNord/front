import React from 'react';

import Paper from '@mui/material/Paper';
import {ViewState, EditingState, IntegratedEditing, } from '@devexpress/dx-react-scheduler';
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
import { appointments } from '../demo-data/appointments';
export default class Calendar extends React.PureComponent {
    private currentDateChange: (currentDate: any) => void;
    private currentViewNameChange: (currentViewName: any) => void;
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            data: appointments,
            currentViewName: 'work-week',
            evente : {
                title: 'f',
                startTime: "2023-10-07T10:30:00+10:00",
                endTime: "2023-10-07T12:00:00+10:00",
            }
        };
        this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
        this.currentViewNameChange = (currentViewName) => {
            this.setState({ currentViewName });
        };

        this.commitChanges = this.commitChanges.bind(this);
    }

    // @ts-ignore
    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            // @ts-ignore
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
                console.log(data[startingAddedId].startDate.getUTCDate());
            }
            if (changed) {
                data = data.map((appointment: { id: string | number; }) => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                data = data.filter((appointment: { id: any; }) => appointment.id !== deleted);
            }
            return { data };
        });
    }

    render() {

        // @ts-ignore
        const {  data, currentDate, currentViewName } = this.state;

        return (
            <Paper>
                <Scheduler
                    data={data}
                    height={660}
                >
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={this.currentDateChange}
                        currentViewName={currentViewName}
                        onCurrentViewNameChange={this.currentViewNameChange}
                    />
                    <EditingState
                        // @ts-ignore
                        onCommitChanges={this.commitChanges}
                    />
                    <IntegratedEditing />

                    <WeekView
                        startDayHour={9}
                        endDayHour={19}
                    />
                    <WeekView
                        name="work-week"
                        displayName="Work Week"
                        excludedDays={[0, 6]}
                        startDayHour={9}
                        endDayHour={19}
                    />
                    <MonthView />
                    <DayView />
                    <Appointments />
                    <AllDayPanel />
                    <ConfirmationDialog
                        ignoreCancel
                    />
                    <AppointmentTooltip
                        showOpenButton
                        showDeleteButton
                    />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <AppointmentForm />
                    <DragDropProvider />
                    <ViewSwitcher />
                </Scheduler>
            </Paper>

        );
    }
}

