export default function getFormattedDate(dateString) {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);

    
    const getOrdinalSuffix = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const dayWithSuffix = getOrdinalSuffix(date.getDate());
    
    // දවසේ නම සහ මාසයේ නම ලබාගැනීම
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    const year = date.getFullYear();

    // වේලාව (12-hour format) සහ AM/PM ලබාගැනීම
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 පැය 12 ලෙස පෙන්වීම සඳහා

    // අවශ්‍ය රටාවට සකසා return කිරීම
    return `${dayWithSuffix} ${weekday}, ${month} ${year} @${hours}:${minutes} ${ampm}`;
}