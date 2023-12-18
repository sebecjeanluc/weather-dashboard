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
	historyDiv.empty()
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
			// Top page
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
			humidityElement.text('Humidity: ' + humidity + ' KPH')
			todaySection.append(humidityElement)

			// 5 days forecast
			let cardWrapper = $('<div>')
			cardWrapper.attr('class', 'card__wrapper')
			let cardHeader = $('<h3>').text('5-DAY Forecast For ' + cityName + ': ')
			let cardItem = $('<div>')
			cardItem.attr('class', 'card-item')
			let cardItemDate = $('<h5>').text('18/12/2022')
			let cardItemEmoji = $('<img>')
			cardItemEmoji.attr('src', weatherEmojiURL)
			let cardItemTemp = $('<p>').text('Temp: ' + '5.5' + ' °C')
			let cardItemWind = $('<p>').text('Wind: ' + '2.76' + ' KPH')
			let cardItemHumidity = $('<p>').text('Humidity: ' + '44' + ' KPH')
			cardItem.append(
				cardItemDate,
				cardItemEmoji,
				cardItemTemp,
				cardItemWind,
				cardItemHumidity
			)
			cardWrapper.append(cardItem)
			forecastSection.prepend(cardHeader, cardWrapper)

			let selectedData = []
			let lastDate = null
			let weatherList = data.list
			console.log(weatherList)
			for (i = 0; i < weatherList.length; i++) {
				let forecastDate = new Date(weatherList[i].dt_txt).getDate()
				console.log(forecastDate)
			}
		})
})
