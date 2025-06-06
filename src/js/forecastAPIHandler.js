const form = document.querySelector("form")
const inputForecast = form.querySelector(".weather_search")
const celcius = document.querySelector(".weather_celcius")
const farenheit = document.querySelector(".weather_farenheit")
const apiKey = "b98399f93fecb72c3fd3e2d0ac79b3f0"
const apiUrl = "http://api.openweathermap.org/data/2.5/forecast"
const lang = "pt_br"

export class forecastUtility {
    constructor() {
        this.location = "Rio de Janeiro"
        this.unit = "metric"
        this.unitChanged = false
        this.initEventListeners()
    }

    async fetchForecastData() {
        let currentLocation = this.location
        const currentUnit = this.unit
        const apiForecastUrl = `${apiUrl}?q=${currentLocation}&appid=${apiKey}&lang=${lang}&units=${currentUnit}`

        try {
            const response = await fetch(apiForecastUrl)
            const forecastData = await response.json()
            return forecastData
        } catch (error) {
            console.error("Erro ao buscar dados do clima:", error)
        }
    }

    initEventListeners() {
        form.addEventListener("submit", async (e) => {
            e.preventDefault()
            this.location = inputForecast.value
            const forecastData = await this.fetchForecastData()
            this.displayForecastCard(forecastData)
            inputForecast.value = ""
        })

        this.changeUnits()
    }

    changeUnits() {
        const buttons = [celcius, farenheit]
        buttons.forEach((button) => {
            button.addEventListener("click", async () => {
                if (!this.unitChanged) {
                    buttons.forEach((btn) => {
                        btn.classList.add("bg-slate-800")
                        btn.classList.remove("bg-slate-700")
                    })

                    button.classList.add("bg-slate-700")
                    button.classList.remove("bg-slate-800")

                    this.unit = button === celcius ? "metric" : "imperial"
                    this.unitChanged = true

                    const forecastData = await this.fetchForecastData()
                    this.displayForecastCard(forecastData)
                    this.unitChanged = false
                }
            })
        })
    }

    convertCountryCode(country) {
        let regionNames = new Intl.DisplayNames(["pt"], { type: "region" })
        return regionNames.of(country)
    }

    displayForecastCard(forecastData) {
        if (forecastData) {
            console.log("Clima dos proximos dias: ", forecastData)

            const forecastCardsContainer = document.querySelector(
                ".forecast_cards_container"
            )
            let location = document.querySelector(".weather_location")

            location.innerText = `${
                forecastData.city.name
            }, ${this.convertCountryCode(forecastData.city.country)}`

            function extrairData(dt_txt) {
                return dt_txt.split(" ")[0]
            }

            function formatDate(date) {
                return date.toLocaleDateString(undefined, {
                    month: "2-digit",
                    day: "2-digit",
                })
            }

            const dailyTemperatures = {}

            forecastData.list.forEach((item) => {
                const data = extrairData(item.dt_txt)

                if (!dailyTemperatures[data]) {
                    dailyTemperatures[data] = {
                        max: item.main.temp_max,
                        min: item.main.temp_min,
                        maxIcon: item.weather[0].icon,
                        minIcon: item.weather[0].icon,
                    }
                } else {
                    dailyTemperatures[data].max = Math.max(
                        dailyTemperatures[data].max,
                        item.main.temp_max
                    )
                    dailyTemperatures[data].min = Math.min(
                        dailyTemperatures[data].min,
                        item.main.temp_min
                    )

                    if (dailyTemperatures[data].max === item.main.temp_max) {
                        dailyTemperatures[data].maxIcon = item.weather[0].icon
                    }
                    if (dailyTemperatures[data].min === item.main.temp_min) {
                        dailyTemperatures[data].minIcon = item.weather[0].icon
                    }
                }
            })

            forecastCardsContainer.innerHTML = ""

            for (const data in dailyTemperatures) {
                const card = document.createElement("div")
                card.classList.add("forecast_card", "rounded-2xl", "bg-white/5")

                const displayedDate = `${data.slice(8, 10)}/${data.slice(5, 7)}`
                const currentDate = new Date()
                const formatCurrentDate = formatDate(currentDate)

                const tomorrow = new Date(currentDate)
                tomorrow.setDate(currentDate.getDate() + 1)
                const formatTomorrowDate = formatDate(tomorrow)

                let dateText = displayedDate

                if (displayedDate === formatCurrentDate) {
                    dateText = "Hoje"
                } else if (displayedDate === formatTomorrowDate) {
                    dateText = "Amanhã"
                }

                card.innerHTML = `
                    <div class="forecast-day py-4 bg-white/5 rounded-t-2xl">
                        <p class="text-lg"></p>
                        <p class="text-xs">${dateText}</p>
                    </div>

                    <div class="weather_icon_max mt-2 mb-8 px-6">
                        <img class="w-12 block mx-auto mb-4" src="https://openweathermap.org/img/wn/${
                            dailyTemperatures[data].maxIcon
                        }@4x.png" alt="clouds">
                    </div>

                    <p class="text-sm weather_temperature_max mb-32 px-6">
                        ${dailyTemperatures[data].max.toFixed()}°
                    </p>

                    <p class="text-sm weather_temperature_min px-6">
                        ${dailyTemperatures[data].min.toFixed()}°
                    </p>

                    <div class="weather_icon_min mt-8 px-6 mb-2">
                        <img class="w-12 block mx-auto mt-4" src="https://openweathermap.org/img/wn/${
                            dailyTemperatures[data].minIcon
                        }@4x.png" alt="clouds">
                    </div>
                `

                forecastCardsContainer.appendChild(card)
            }
        }
    }
}
