const searchInput = $('#search-input')
const searchButton = $('#search-button')
const historyDiv = $('#history')
const todaySection = $('#today')
const forecastSection = $('#forecast')

let searchHistoryArray = []

if (searchHistoryArray.length === 0) {
	todaySection.append($('<p>Please use the search button at the left</p>'))
}
searchButton.on('click', function (event) {
	event.preventDefault()
	todaySection.empty()

	let searchValue = searchInput.val().toUpperCase()
	searchHistoryArray.push(searchValue)
	console.log(searchHistoryArray)

	city_name = searchValue

	for (i = 0; i < searchHistoryArray.length; i++) {
		let buttonElement = $('<button>')
		buttonElement.attr('class', 'btn btn-secondary my-1')
		buttonElement.attr('id', searchHistoryArray[i])
		buttonElement.text(searchHistoryArray[i])
		historyDiv.append(buttonElement)
	}

	const api_key = '6564a1e34fe2402a386a344757a44a73'

	let queryURL =
		'https://api.openweathermap.org/data/2.5/forecast?q=' +
		city_name +
		'&units=metric' +
		'&appid=' +
		api_key

	console.log(queryURL)

	fetch(queryURL)
		.then(function (response) {
			return response.json()
		})

		.then(function (data) {
			console.log(data)
			let cityName = data.city.name
			let h2Element = $('<h3>')
			h2Element.addClass('h3')
			h2Element.text(cityName)
			todaySection.append(h2Element)

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
			humidityElement.text('Humidity: ' + humidity + ' KPH')
			todaySection.append(humidityElement)
		})
})
