export type CalendarType = {
    id: string;
    title : string;
    startDate: Date;
    endDate: Date;
    description: string;
}

const emptyCalendar: CalendarType = {
    id: "",
    endDate: new Date(),
    startDate: new Date(),
    title: "",
    description: ""
}

export {emptyCalendar};