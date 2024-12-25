import {collection, getDocs} from "firebase/firestore";
import {DAILY_SCHEDULE_TABLE_NAME, db} from "@/app/lib/firebase";

export type WeekDay = {
    id: number;
    name: string;
    value: string;
};

export interface DailySchedule {
    _id?: string, //server side id
    scheduleId: number,
    weekday: WeekDay,
    breakfast: number[],
    lunch: number[],
    dinner: number[]
}

export const WEEK_DAYS: WeekDay[] = [
    {id: 0, name: 'Monday', value: "monday"},
    {id: 1, name: 'Tuesday', value: "tuesday"},
    {id: 2, name: 'Wednesday', value: "wednesday"},
    {id: 3, name: 'Thursday', value: "thursday"},
    {id: 4, name: 'Friday', value: "friday"},
    {id: 5, name: 'Saturday', value: "saturday"},
    {id: 6, name: 'Sunday', value: "sunday"},
]

export const getWeekDayByValue = (value: string): WeekDay | null => {
    const weekDay = WEEK_DAYS.find((weekDay) => weekDay.value.toLowerCase() === value.toLowerCase());
    if (weekDay) {
        return weekDay
    } else {
        return null
    }
};

export const fetchAllDailySchedules = async () => {
    const dailyScheduleCollection = collection(db, DAILY_SCHEDULE_TABLE_NAME);
    const dailyScheduleSnapshot = await getDocs(dailyScheduleCollection);
    return dailyScheduleSnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
    })) as DailySchedule[];
};

