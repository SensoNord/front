export type CalendarType = {
    id: string;
    title : string;
    startDate: number;
    endDate: number;
    description: string;
    rRule : string;

}

const emptyCalendar: CalendarType = {
    id: "",
    endDate: 0,
    startDate: 0,
    title: "",
    description:" ",
    rRule:"",
}

export {emptyCalendar};