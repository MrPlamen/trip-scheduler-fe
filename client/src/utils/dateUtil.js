export function calculateDuration(startDate, endDate) {

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid date provided");
        return 0; 
    }

    const differenceInMillis = end - start;

    if (differenceInMillis < 0) {
        console.warn("End date is earlier than start date");
        return 0;
    }

    const days = differenceInMillis / (1000 * 60 * 60 * 24);

    return Math.ceil(days); 
}

export function shortFormatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');  
    const month = String(d.getMonth() + 1).padStart(2, '0');  
    return `${day}.${month}`;
}
