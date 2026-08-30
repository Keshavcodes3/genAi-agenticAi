/**
 * Returns a time-of-day greeting based on local hour.
 * Morning: 5–11, Afternoon: 12–16, Evening: 17–20, Night: 21–4
 */
export const getTimeBasedGreeting = (date = new Date()) => {
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
};

export const getPersonalizedGreeting = (name, date = new Date()) =>
    `${getTimeBasedGreeting(date)}, ${name}`;
