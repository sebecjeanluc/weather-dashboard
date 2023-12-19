const searchInput = $('#search-input')
const searchButton = $('#search-button')
const historyContainer = $('#history')
const todaySection = $('#today')
const forecastSection = $('#forecast')

// let searchHistoryArray = ['TOKYO', 'LONDON']
// console.log(searchHistoryArray)

// retriving data from local storage
let storedSearchHistory = localStorage.getItem('searchHistory')
let searchHistoryArray = []
if (storedSearchHistory) {
	let searchHistory = JSON.parse(storedSearchHistory)
	searchHistoryArray = searchHistory
	// console.log(searchHistoryArray)
	showSearchHistory()
	todaySection.append($('<p>Please use the search button at the left</p>'))
} else if (searchHistoryArray.length) {
	showSearchHistory()
} else {
	// initializing searchHistory if there is no searchHistory
	todaySection.append($('<p>Please use the search button at the left</p>'))
}

// Show search history
function showSearchHistory() {
	for (i = 0; i < searchHistoryArray.length; i++) {
		let buttonElement = $('<button>')
		buttonElement.attr('class', 'btn btn-secondary my-1')
		buttonElement.attr('id', searchHistoryArray[i])
		buttonElement.text(searchHistoryArray[i])
		historyContainer.prepend(buttonElement)
	}
}

// History button search
if (historyContainer.length) {
	historyContainer.on('click', 'button', function (event) {
		event.preventDefault()
		let cityHistoryName = $(this).attr('id')
		todaySection.empty()
		showSearchResult(cityHistoryName)
	})
}

let searchWarninghElement = $('<p>')
function showWarning() {
	searchWarninghElement.attr('class', 'warning-text')
	searchWarninghElement.text('Please type a proper city name')
	$('.hr.weather-hr').before(searchWarninghElement)
}

// Show search Result
function showSearchResult(searchValue) {
	// Dont push if the array has the searchValue
	if (!searchHistoryArray.includes(searchValue)) {
		searchHistoryArray.push(searchValue)
	}
	// console.log(searchHistoryArray)
	// save the history in local storage
	localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray))

	city_name = searchValue

	historyContainer.empty()
	showSearchHistory()

	const api_key = '6564a1e34fe2402a386a344757a44a73'

	let queryURL =
		'https://api.openweathermap.org/data/2.5/forecast?q=' +
		city_name +
		'&units=metric' +
		'&appid=' +
		api_key

	// console.log(queryURL)

	fetch(queryURL)
		.then(function (response) {
			return response.json()
		})

		.then(function (data) {
			console.log(data)

			let day_data = []
			// Top page section
			let cityName = data.city.name
			let today = data.list[0].dt_txt
			today = dayjs().format('DD/MM/YYYY')
			let weatherEmoji = data.list[0].weather[0].icon
			let weatherEmojiURL =
				'https://openweathermap.org/img/w/' + weatherEmoji + '.png'
			let h3Wrapper = $('<div>')
			h3Wrapper.attr('class', 'h3__wrapper')
			let h3Element = $('<h3>')
			h3Element.addClass('h3')
			h3Element.text(cityName + ' (' + today + ')')
			let imgElement = $('<img>')
			imgElement.attr('src', weatherEmojiURL)
			imgElement.attr('alt', data.list[0].weather[0].main)
			h3Wrapper.append(h3Element, imgElement)
			todaySection.append(h3Wrapper)
			let temperature = data.list[0].main.temp
			let tempElement = $('<p>')
			tempElement.addClass('my-3 text-black-50')
			tempElement.text('Temp: ' + temperature + ' °C')
			todaySection.append(tempElement)

			let windSpeed = data.list[0].wind.speed
			let windElement = $('<p>')
			windElement.addClass('my-3 text-black-50')
			windElement.text('Wind: ' + windSpeed + ' KPH')
			todaySection.append(windElement)

			let humidity = data.list[0].main.humidity
			let humidityElement = $('<p>')
			humidityElement.addClass('my-3 text-black-50')
			humidityElement.text('Humidity: ' + humidity + ' %')
			todaySection.append(humidityElement)

			// Add the list of day data in array
			let weatherList = data.list
			// console.log(weatherList)
			for (i = 0; i < weatherList.length; i++) {
				// you push the 4th item out of 8 into array (around 12PM)
				// index:0-9PM, index:1-0AM,,, index-5-12PM
				if (i % 8 === 5) {
					day_data.push(weatherList[i])
				}
			}
			// console.log(day_data)
			showForecast(cityName, day_data)
		})
		// when it returns 404
		.catch((error) => {
			showWarning()
		})
}

// Search button to search the city result (including top)
searchButton.on('click', function (event) {
	let searchValue = searchInput.val().toUpperCase()
	event.preventDefault()
	if (searchValue === null || searchValue === '') {
		showWarning()
	} else {
		todaySection.empty()
		searchWarninghElement.empty()
		showSearchResult(searchValue)
	}
})

// Show 5 day forecast result
function showForecast(cityName, selectedDayData) {
	// 5 days forecast
	let cardHeader = $('<h3>').text('5-DAY Forecast for ' + cityName + ': ')
	let cardWrapper = $('<div>')
	cardWrapper.attr('class', 'card__wrapper')

	// loop the day data to print the result
	for (i = 0; i < selectedDayData.length; i++) {
		let day_dataDate = new Date(selectedDayData[i].dt_txt)
		day_dataDate = dayjs(day_dataDate).format('DD/MM/YYYY')
		// console.log(day_dataDate)
		let cardItem = $('<div>')
		cardItem.attr('class', 'card-item')
		let cardItemDate = $('<h5>').text(day_dataDate)
		let cardItemEmoji = $('<img>')
		let day_dataEmojiLoop = selectedDayData[i].weather[0].icon
		let weatherEmojiURLLoop =
			'https://openweathermap.org/img/w/' + day_dataEmojiLoop + '.png'

		cardItemEmoji.attr('src', weatherEmojiURLLoop)
		cardItemEmoji.attr('alt', selectedDayData[i].weather[0].main)
		let cardItemTemp = $('<p>').text(
			'Temp: ' + selectedDayData[i].main.temp + ' °C'
		)
		let cardItemWind = $('<p>').text(
			'Wind: ' + selectedDayData[i].wind.speed + ' KPH'
		)
		let cardItemHumidity = $('<p>').text(
			'Humidity: ' + selectedDayData[i].main.humidity + ' %'
		)
		cardItem.append(
			cardItemDate,
			cardItemEmoji,
			cardItemTemp,
			cardItemWind,
			cardItemHumidity
		)
		cardWrapper.append(cardItem)
		forecastSection.prepend(cardHeader, cardWrapper)
	}
}

// Clear local storage and history button
$('#clear-button').on('click', function () {
	localStorage.removeItem('searchHistory')
	historyContainer.empty()
})
