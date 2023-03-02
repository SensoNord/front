export type CalendarType = {
    id: string;
    title : string;
    startDate: Date;
    endDate: Date;
    description: string;
    rRule : string;
}

const emptyCalendar: CalendarType = {
    id: "",
    endDate: new Date(),
    startDate: new Date(),
    title: "",
    description: "",
    rRule:""
}

export {emptyCalendar};