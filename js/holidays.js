// Brazilian holidays for the current year
const holidays = [
    { month: 1, day: 1, name: 'Confraternização Universal' },
    { month: 2, day: 21, name: 'Carnaval' },  // Added Carnival
    { month: 2, day: 22, name: 'Quarta-feira de Cinzas' },  // Added Ash Wednesday
    { month: 4, day: 7, name: 'Sexta-feira Santa' },  // Added Good Friday
    { month: 4, day: 9, name: 'Páscoa' },  // Added Easter
    { month: 4, day: 21, name: 'Tiradentes' },
    { month: 5, day: 1, name: 'Dia do Trabalho' },
    { month: 6, day: 8, name: 'Corpus Christi' },  // Added Corpus Christi
    { month: 9, day: 7, name: 'Independência do Brasil' },
    { month: 10, day: 12, name: 'Nossa Senhora Aparecida' },
    { month: 11, day: 2, name: 'Finados' },
    { month: 11, day: 15, name: 'Proclamação da República' },
    { month: 12, day: 25, name: 'Natal' }
];

// Make functions globally accessible
window.isHoliday = function(date) {
    return holidays.some(holiday => 
        holiday.month === date.getMonth() + 1 && 
        holiday.day === date.getDate()
    );
};

window.getHolidayName = function(date) {
    const holiday = holidays.find(holiday => 
        holiday.month === date.getMonth() + 1 && 
        holiday.day === date.getDate()
    );
    return holiday ? holiday.name : null;
};

window.isWeekend = function(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

window.formatDate = function(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

window.getMonthDays = function(year, month) {
    return new Date(year, month + 1, 0).getDate();
};
