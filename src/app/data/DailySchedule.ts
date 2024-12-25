export type WeekDay = {
    id: number;
    name: string;
    value: string;
};

export const daysOfWeek: string[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export const weekDays: WeekDay[] = [
    {id: 0, name: 'Monday', value: "monday"},
    {id: 1, name: 'Tuesday', value: "tuesday"},
    {id: 2, name: 'Wednesday', value: "wednesday"},
    {id: 3, name: 'Thursday', value: "thursday"},
    {id: 4, name: 'Friday', value: "friday"},
    {id: 5, name: 'Saturday', value: "saturday"},
    {id: 6, name: 'Sunday', value: "sunday"},
]