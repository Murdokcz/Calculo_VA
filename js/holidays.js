// Brazilian holidays for the current year
const holidays = [
    { month: 1, day: 1, name: 'Confraternização Universal' },
    { month: 4, day: 21, name: 'Tiradentes' },
    { month: 5, day: 1, name: 'Dia do Trabalho' },
    { month: 9, day: 7, name: 'Independência do Brasil' },
    { month: 10, day: 12, name: 'Nossa Senhora Aparecida' },
    { month: 11, day: 2, name: 'Finados' },
    { month: 11, day: 15, name: 'Proclamação da República' },
    { month: 12, day: 25, name: 'Natal' }
];

function isHoliday(date) {
    return holidays.some(holiday => 
        holiday.month === date.getMonth() + 1 && 
        holiday.day === date.getDate()
    );
}

function getHolidayName(date) {
    const holiday = holidays.find(holiday => 
        holiday.month === date.getMonth() + 1 && 
        holiday.day === date.getDate()
    );
    return holiday ? holiday.name : null;
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getMonthDays(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
