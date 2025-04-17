// Make updatePeriod function globally accessible
window.updatePeriod = function(value) {
    const selectedMonth = parseInt(value);
    const periodInfo = document.getElementById('periodInfo');
    const extraDaysContainer = document.getElementById('extraDaysContainer');
    const monthError = document.getElementById('monthError');
    
    if (!selectedMonth) {
        monthError.classList.remove('hidden');
        extraDaysContainer.innerHTML = '';
        periodInfo.textContent = '';
        return;
    }

    monthError.classList.add('hidden');
    const period = calculatePeriod(selectedMonth);
    displayPeriod(period);
    generateExtraDaysList(period);
};

// Calculate period based on selected month
function calculatePeriod(month) {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, month - 1, 20);
    const endDate = new Date(currentYear, month, 20);

    // Adjust for months with less than 31 days
    const daysInStartMonth = getMonthDays(currentYear, month - 1);
    const daysInEndMonth = getMonthDays(currentYear, month);

    if (startDate.getDate() > daysInStartMonth) {
        startDate.setDate(daysInStartMonth);
    }
    if (endDate.getDate() > daysInEndMonth) {
        endDate.setDate(daysInEndMonth);
    }

    return { startDate, endDate };
}

// Display the selected period
function displayPeriod({ startDate, endDate }) {
    const formattedText = `${formatDate(startDate)} até ${formatDate(endDate)}`;
    document.getElementById('periodInfo').textContent = formattedText;
}

// Generate list of extra days (weekends and holidays)
function generateExtraDaysList({ startDate, endDate }) {
    const extraDaysContainer = document.getElementById('extraDaysContainer');
    extraDaysContainer.innerHTML = '';
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (isWeekend(currentDate) || isHoliday(currentDate)) {
            dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (dates.length === 0) {
        extraDaysContainer.innerHTML = '<p class="text-gray-500">Nenhum dia extra encontrado no período</p>';
        return;
    }

    dates.forEach(date => {
        const isHolidayDate = isHoliday(date);
        const dayType = isHolidayDate ? 'Feriado' : 'Final de Semana';
        const holidayName = isHolidayDate ? getHolidayName(date) : '';
        
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-3 mb-2';
        div.innerHTML = `
            <input type="checkbox" 
                   id="date-${date.getTime()}" 
                   class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <label for="date-${date.getTime()}" class="text-sm text-gray-700">
                ${formatDate(date)} - ${dayType}
                ${holidayName ? ` (${holidayName})` : ''}
            </label>
        `;
        extraDaysContainer.appendChild(div);
    });
}

// Calculate button click handler
document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    calculateButton.addEventListener('click', function() {
        // Get all form values
        const selectedMonth = parseInt(document.getElementById('startMonth').value);
        const dailyRate = parseFloat(document.getElementById('dailyRate').value);
        const employeeName = document.getElementById('employeeName').value;
        const position = document.getElementById('position').value;
        const absenceDays = parseInt(document.getElementById('absenceDays').value) || 0;
        
        // Validate required fields
        if (!selectedMonth || !dailyRate || dailyRate <= 0 || !employeeName || !position) {
            if (!selectedMonth) document.getElementById('monthError').classList.remove('hidden');
            if (!dailyRate || dailyRate <= 0) document.getElementById('errorMessage').classList.remove('hidden');
            return;
        }

        document.getElementById('monthError').classList.add('hidden');
        document.getElementById('errorMessage').classList.add('hidden');

        const period = calculatePeriod(selectedMonth);
        const workDays = calculateWorkDays(period);
        const selectedExtraDays = getSelectedExtraDays();
        
        // Calculate actual working days after subtracting absences
        const actualWorkDays = Math.max(0, workDays - absenceDays);
        const totalDays = actualWorkDays + selectedExtraDays.length;
        const total = totalDays * dailyRate;

        document.getElementById('resultContainer').style.display = 'block';
        displayResults(total, selectedExtraDays, {
            employeeName,
            position,
            workDays: actualWorkDays, // Display actual working days after absences
            absenceDays,
            totalDays
        });
        document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
    });

    // Add autocomplete functionality for employee name and position
    setupAutocomplete('employeeName', ['Alex', 'Kauan', 'Rian', 'Rick', 'Willian']);
    setupAutocomplete('position', ['TEC. CAMPO', 'SUPORTE', 'FINANCEIRO', 'COMERCIAL']);
});

// Setup autocomplete functionality
function setupAutocomplete(inputId, options) {
    const input = document.getElementById(inputId);
    const datalist = document.getElementById(inputId + 'List');

    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        datalist.innerHTML = '';
        
        options.forEach(option => {
            if (option.toLowerCase().startsWith(value)) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                datalist.appendChild(optionElement);
            }
        });
    });
}

// Calculate work days in a period
function calculateWorkDays({ startDate, endDate }) {
    let workDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
            workDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return workDays;
}

// Get selected extra days
function getSelectedExtraDays() {
    const selectedDays = [];
    const checkboxes = document.getElementById('extraDaysContainer').querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const dateTimestamp = parseInt(checkbox.id.replace('date-', ''));
            const date = new Date(dateTimestamp);
            const isHolidayDate = isHoliday(date);
            const dayType = isHolidayDate ? 'Feriado' : 'Final de Semana';
            const holidayName = isHolidayDate ? getHolidayName(date) : '';
            
            selectedDays.push({
                date,
                dayType,
                holidayName
            });
        }
    });

    return selectedDays;
}

// Display calculation results
function displayResults(total, selectedDays, employeeInfo) {
    // Update employee information
    document.getElementById('resultEmployeeName').textContent = employeeInfo.employeeName;
    document.getElementById('resultPosition').textContent = employeeInfo.position;
    document.getElementById('workDaysCount').textContent = employeeInfo.workDays;
    document.getElementById('absenceDaysCount').textContent = employeeInfo.absenceDays;

    // Update total amount
    document.getElementById('totalAmount').textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Update selected days list
    const selectedDaysList = document.getElementById('selectedDaysList');
    selectedDaysList.innerHTML = '';
    
    if (selectedDays.length === 0) {
        selectedDaysList.innerHTML = '<li class="text-gray-500">Nenhum dia extra selecionado</li>';
    } else {
        selectedDays.forEach(({ date, dayType, holidayName }) => {
            const li = document.createElement('li');
            li.className = 'mb-1 text-gray-700';
            li.textContent = `${formatDate(date)} - ${dayType}${holidayName ? ` (${holidayName})` : ''}`;
            selectedDaysList.appendChild(li);
        });
    }
}
