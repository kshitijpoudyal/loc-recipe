export const getLocalWeekdayNumber = (): number => {
    const date = new Date();
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;  // Adjusts Sunday (0) to be 6, Monday (1) to be 0, etc.
};


