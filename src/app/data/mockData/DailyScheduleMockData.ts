import {addScheduleToFirestore} from "@/app/utils/firebaseUtils/DailySchedule";
import {WEEK_DAYS} from "@/app/data/ConstData";
import {DailySchedule} from "@/app/data/DataInterface";

export const mockSchedule: DailySchedule[] = [
    {
        weekday: WEEK_DAYS[0].value,
        breakfast: ["1001", "1002"],
        lunch: ["1003", "1004"],
        dinner: ["1005"],
    },
    {
        weekday: WEEK_DAYS[1].value,
        breakfast: ["1002"],
        lunch: ["1005"],
        dinner: ["1006"]
    },
    {
        weekday: WEEK_DAYS[2].value,
        breakfast: ["1003"],
        lunch: ["1004"],
        dinner: ["1005"]
    },
    {
        weekday: WEEK_DAYS[3].value,
        breakfast: ["1003"],
        lunch: ["1004"],
        dinner: ["1005"]
    },
    {
        weekday: WEEK_DAYS[4].value,
        breakfast: ["1006"],
        lunch: ["1004"],
        dinner: ["1005"]
    },
    {
        weekday: WEEK_DAYS[5].value,
        breakfast: [""],
        lunch: [""],
        dinner: [""]
    },
    {
        weekday: WEEK_DAYS[6].value,
        breakfast: [""],
        lunch: [""],
        dinner: [""]
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