const monthNameElement = document.getElementById('month-name')
const dateInput = document.getElementById('date-input')
const calendarTable = document.getElementById('calendar')
const calendarHead = document.getElementById('calendar-head')
const calendarBody = document.getElementById('calendar-body')
const firstDayInput = document.getElementById('first-day-input')
const localeInput = document.getElementById('locale-input')

function setDateInput(date) {
  dateInput.value = date.toISOString().split('T')[0]
}

function resetDate() {
  const date = new Date()
  setDateInput(date)
  return date
}

function getNextGivenWeekday(weekday, date, searchDirection = 1) {
  if (date.getDay() === weekday) {
    return date
  } else {
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + searchDirection)
    return getNextGivenWeekday(weekday, nextDay, searchDirection)
  }
}

function generateHeaderRow(firstWeekday, firstDate) {
  const tr = document.createElement('tr')
  calendarHead.appendChild(tr)

  const nextStartOfWeek = getNextGivenWeekday(firstWeekday, firstDate)

  for (let index = 0, date = new Date(nextStartOfWeek); index < 7; index++) {
    const dayName = date.toLocaleString(localeInput.value, { weekday: 'short' })
    const th = document.createElement('th')
    th.innerText = dayName
    tr.appendChild(th)
    date.setDate(date.getDate() + 1)
  }
}

function generateWeekRow(startOfWeek, firstDate, lastDate) {
  const tr = document.createElement('tr')
  calendarBody.appendChild(tr)

  for (let weekday = 0; weekday < 7; weekday++) {
    const td = document.createElement('td')
    tr.appendChild(td)
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + weekday)

    if (date >= firstDate && date <= lastDate) {
      td.innerText = date.getDate()
    }
  }
}

function generateBody(firstWeekday, firstDate, lastDate) {
  const firstStartOfWeek = getNextGivenWeekday(firstWeekday, firstDate, -1)
  const lastEndOfWeek = getNextGivenWeekday((firstWeekday + 6) % 7, lastDate)
  window.firstStartOfWeek = firstStartOfWeek
  window.lastEndOfWeek = lastEndOfWeek
  console.log('first start of week', firstStartOfWeek)
  console.log('last end of week', lastEndOfWeek)

  let currentDate = new Date(firstStartOfWeek)
  do {
    generateWeekRow(currentDate, firstDate, lastDate)
    currentDate.setDate(currentDate.getDate() + 7)
  } while (currentDate <= lastEndOfWeek)
}

function generateCalendar(firstDate, lastDate, firstWeekday) {
  window.firstDate = firstDate
  window.lastDate = lastDate
  console.log('first date', firstDate)
  console.log('last date', lastDate)

  generateHeaderRow(firstWeekday, firstDate)
  generateBody(firstWeekday, firstDate, lastDate)
}

function clearCalendar() {
  calendarHead.innerHTML = ''
  calendarBody.innerHTML = ''
}

function updateCalendar() {
  const date = dateInput.valueAsDate || resetDate()
  const monthName = date.toLocaleString(localeInput.value, { month: 'long' })
  monthNameElement.innerText = monthName

  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const firstWeekday = Math.abs(Number(firstDayInput.value)) % 7

  clearCalendar()
  generateCalendar(firstDate, lastDate, firstWeekday)
}

// yyyy-mm-dd
setDateInput(new Date())
localeInput.value = navigator.languages[0] || navigator.language

const inputs = [dateInput, firstDayInput, localeInput]
inputs.forEach(input => {
  input.addEventListener('change', updateCalendar)
})
updateCalendar()
