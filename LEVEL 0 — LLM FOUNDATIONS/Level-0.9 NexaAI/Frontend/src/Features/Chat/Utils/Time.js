export const getTimeOfDay = (date = new Date()) => {
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
        return "Morning";
    }

    if (hour >= 12 && hour < 17) {
        return "Afternoon";
    }

    if (hour >= 17 && hour < 21) {
        return "Evening";
    }

    return "Night";
};