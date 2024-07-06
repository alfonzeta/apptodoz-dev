
export default function TimeLeftUntilDeadLine(deadline) {
    // Convert the target date string to a Date object
    const target = new Date(deadline);

    // Get the current date and time
    const now = new Date();

    // Calculate the difference in milliseconds
    const difference = target - now;

    // Check if the target date is in the past
    if (difference <= 0) {
        return "The deadline has already passed.";
    }

    // Calculate time components
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return (
        // Return the time left as a string
        `${days} days, ${hours} hours, and ${minutes} minutes left.`
    )
}

