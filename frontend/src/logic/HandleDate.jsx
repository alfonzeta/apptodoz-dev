
export default function HandleDate(date) {
    let dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Months are zero based
    let day = ('0' + dateObj.getDate()).slice(-2);
    let hour = ('0' + dateObj.getHours()).slice(-2);
    let minute = ('0' + dateObj.getMinutes()).slice(-2);

    return (
        `${year}-${month}-${day} ${hour}:${minute}`
    )
}

