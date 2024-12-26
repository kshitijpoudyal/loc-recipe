import {addScheduleToFirestore} from "@/app/data/firebaseController/DailySchedule";
import {WEEK_DAYS} from "@/app/data/ConstData";
import {DailySchedule} from "@/app/data/DataInterface";

export const mockSchedule: DailySchedule[] = [
    {
        scheduleId: 1000,
        weekday: WEEK_DAYS[0],
        breakfast: [1001, 1002],
        lunch: [1003, 1004],
        dinner: [1005],
    },
    {
        scheduleId: 1001,
        weekday: WEEK_DAYS[1],
        breakfast: [1002],
        lunch: [1005],
        dinner: [1006]
    },
    {
        scheduleId: 1002,
        weekday: WEEK_DAYS[2],
        breakfast: [1003],
        lunch: [1004],
        dinner: [1005]
    },
    {
        scheduleId: 1003,
        weekday: WEEK_DAYS[3],
        breakfast: [1003],
        lunch: [1004],
        dinner: [1005]
    },
    {
        scheduleId: 1004,
        weekday: WEEK_DAYS[4],
        breakfast: [1006],
        lunch: [1004],
        dinner: [1005]
    },
    {
        scheduleId: 1005,
        weekday: WEEK_DAYS[5],
        breakfast: [],
        lunch: [],
        dinner: []
    },
    {
        scheduleId: 1006,
        weekday: WEEK_DAYS[6],
        breakfast: [],
        lunch: [],
        dinner: []
    }
]

export const addMockScheduleToFirestore = async () => {

    try {
        for (const schedule of mockSchedule) {
            await addScheduleToFirestore(schedule);
        }
        console.log("Mock schedule data added successfully!");
    } catch (error) {
        console.error("Error adding mock schedule data:", error);
    }
};