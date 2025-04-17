// Brazilian holidays for 2025
const holidays = [
    // Fixed Holidays
    { month: 1, day: 1, name: 'Confraternização Universal' },
    // Carnival 2025 (March 4)
    { month: 3, day: 4, name: 'Carnaval' },
    // Ash Wednesday 2025 (March 5)
    { month: 3, day: 5, name: 'Quarta-feira de Cinzas' },
    // Good Friday 2025 (April 18)
    { month: 4, day: 18, name: 'Sexta-feira Santa' },
    // Easter 2025 (April 20)
    { month: 4, day: 20, name: 'Páscoa' },
    // Tiradentes
    { month: 4, day: 21, name: 'Tiradentes' },
    // Labor Day
    { month: 5, day: 1, name: 'Dia do Trabalho' },
    // Corpus Christi 2025 (June 19)
    { month: 6, day: 19, name: 'Corpus Christi' },
    // Independence Day
    { month: 9, day: 7, name: 'Independência do Brasil' },
    // Our Lady of Aparecida
    { month: 10, day: 12, name: 'Nossa Senhora Aparecida' },
    // All Souls' Day
    { month: 11, day: 2, name: 'Finados' },
    // Republic Day
    { month: 11, day: 15, name: 'Proclamação da República' },
    // Christmas
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
