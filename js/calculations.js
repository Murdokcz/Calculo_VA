// Make handleMonthChange globally accessible
window.handleMonthChange = function(value) {
    console.log('Month changed:', value);
    const selectedMonth = parseInt(value);
    const periodInfo = document.getElementById('periodInfo');
    const extraDaysContainer = document.getElementById('extraDaysContainer');
    const monthError = document.getElementById('monthError');
    
    if (!selectedMonth) {
        console.log('No month selected');
        monthError.classList.remove('hidden');
        extraDaysContainer.innerHTML = '';
        periodInfo.textContent = '';
        return;
    }

    console.log('Valid month selected:', selectedMonth);
    monthError.classList.add('hidden');
    const period = calculatePeriod(selectedMonth);
    displayPeriod(period);
    generateExtraDaysList(period);
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Get DOM elements
    const startMonthSelect = document.getElementById('startMonth');
    const dailyRateInput = document.getElementById('dailyRate');
    const calculateButton = document.getElementById('calculateButton');
    const resultContainer = document.getElementById('resultContainer');
    const totalAmount = document.getElementById('totalAmount');
    const selectedDaysList = document.getElementById('selectedDaysList');
    const errorMessage = document.getElementById('errorMessage');

    // Add calculate button event listener
    calculateButton.onclick = function() {
        console.log('Calculate button clicked');
        const selectedMonth = parseInt(startMonthSelect.value);
        const dailyRate = parseFloat(dailyRateInput.value);
        
        if (!selectedMonth || !dailyRate || dailyRate <= 0) {
            if (!selectedMonth) document.getElementById('monthError').classList.remove('hidden');
            if (!dailyRate || dailyRate <= 0) errorMessage.classList.remove('hidden');
            return;
        }

        document.getElementById('monthError').classList.add('hidden');
        errorMessage.classList.add('hidden');

        const period = calculatePeriod(selectedMonth);
        const workDays = calculateWorkDays(period);
        const selectedExtraDays = getSelectedExtraDays();
        const totalDays = workDays + selectedExtraDays.length;
        const total = totalDays * dailyRate;

        console.log('Calculation results:', { workDays, extraDays: selectedExtraDays.length, totalDays, total });

        resultContainer.style.display = 'block';
        displayResults(total, selectedExtraDays);
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    };
});

function calculatePeriod(month) {
    console.log('Calculating period for month:', month);
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

    console.log('Period calculated:', { startDate, endDate });
    return { startDate, endDate };
}

function displayPeriod({ startDate, endDate }) {
    const formattedText = `${formatDate(startDate)} até ${formatDate(endDate)}`;
    console.log('Displaying period:', formattedText);
    document.getElementById('periodInfo').textContent = formattedText;
}

function generateExtraDaysList({ startDate, endDate }) {
    console.log('Generating extra days list');
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

    console.log('Found extra days:', dates.length);

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

function displayResults(total, selectedDays) {
    const totalAmount = document.getElementById('totalAmount');
    const selectedDaysList = document.getElementById('selectedDaysList');

    totalAmount.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

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
