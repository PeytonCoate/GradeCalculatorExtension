export function drawCalendar(assignments){
    const calendarBody = document.getElementById('calendar-body');

    assignments.forEach(assignment => 
    {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const gradeCell = document.createElement('td');

        dateCell.textContent = assignment[2];
        nameCell.textContent = assignment[0];
        gradeCell.textContent = assignment[3];

        row.appendChild(dateCell);
        row.appendChild(nameCell);
        row.appendChild(gradeCell);
        calendarBody.appendChild(row);
    });
}
export function resetCalendar()
{
    const calendarBody = document.getElementById('calendar-body');
    let rows = calendarBody.rows;
    for(let it = rows.length - 1; it >= 0; it--)
    {
        calendarBody.deleteRow(it);   
    }
    
}

    
/* 
    const assignments = parseAssignments(textContent);

    const calendarBody = document.getElementById('calendar-body');

    assignments.forEach(assignment => 
    {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const nameCell = document.createElement('td');

        dateCell.textContent = assignment.date;
        nameCell.textContent = assignment.name;

        row.appendChild(dateCell);
        row.appendChild(nameCell);
        calendarBody.appendChild(row);
    });

 */