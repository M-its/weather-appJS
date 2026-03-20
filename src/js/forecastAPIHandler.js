export class forecastUtility {
    constructor() {
        this.location = "Rio de Janeiro"
        this.unit = "metric"
        this.unitChanged = false
        this.form = document.querySelector("form")
        this.inputForecast = this.form.querySelector(".weather_search")
        this.celcius = document.querySelector(".weather_celcius")
        this.farenheit = document.querySelector(".weather_farenheit")
        this.controller = new AbortController()
        this.initEventListeners()
    }

    destroy() {
        this.controller.abort()
    }

    async fetchForecastData() {
        const currentLocation = this.location
        const currentUnit = this.unit
        const url = `/api/forecast?q=${encodeURIComponent(currentLocation)}&units=${currentUnit}&lang=pt_br`

        try {
            const response = await fetch(url)
            const forecastData = await response.json()

            if (!response.ok) {
                console.error("Erro retornado pelo servidor:", forecastData.error)
                return null
            }

            return forecastData
        } catch (error) {
            console.error("Erro ao buscar previsão do tempo:", error)
            return null
        }
    }

    initEventListeners() {
        this.form.addEventListener("submit", async (e) => {
            e.preventDefault()
            this.location = this.inputForecast.value
            this.showSkeletons()
            const forecastData = await this.fetchForecastData()
            this.displayForecastCard(forecastData)
            this.inputForecast.value = ""
        }, { signal: this.controller.signal })

        this.changeUnits()
    }

    changeUnits() {
        const buttons = [this.celcius, this.farenheit]

        buttons.forEach((button) => {
            button.addEventListener("click", async () => {
                if (!this.unitChanged) {
                    buttons.forEach((btn) => {
                        btn.classList.add("bg-slate-800")
                        btn.classList.remove("bg-slate-700")
                    })

                    button.classList.add("bg-slate-700")
                    button.classList.remove("bg-slate-800")

                    this.unit = button === this.celcius ? "metric" : "imperial"
                    this.unitChanged = true

                    this.showSkeletons()
                    const forecastData = await this.fetchForecastData()
                    this.displayForecastCard(forecastData)
                    this.unitChanged = false
                }
            }, { signal: this.controller.signal })
        })
    }

    showSkeletons() {
        document.querySelector(".forecast_cards_skeleton")?.classList.remove("hidden")
        document.querySelector(".forecast_cards_container")?.classList.add("hidden")
        document.querySelector(".weather_location")?.classList.add("hidden")
        document.querySelectorAll(".skeleton").forEach(el => el.classList.remove("hidden"))
    }

    convertCountryCode(country) {
        let regionNames = new Intl.DisplayNames(["pt"], { type: "region" })
        return regionNames.of(country)
    }

    displayForecastCard(forecastData) {
        if (forecastData) {
            const forecastCardsContainer = document.querySelector(".forecast_cards_container")
            const location = document.querySelector(".weather_location")

            location.innerText = `${forecastData.city.name}, ${this.convertCountryCode(forecastData.city.country)}`

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
                    dailyTemperatures[data].max = Math.max(dailyTemperatures[data].max, item.main.temp_max)
                    dailyTemperatures[data].min = Math.min(dailyTemperatures[data].min, item.main.temp_min)

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
                        <img class="w-12 block mx-auto mb-4" src="https://openweathermap.org/img/wn/${dailyTemperatures[data].maxIcon}@4x.png" alt="clouds">
                    </div>
                    <p class="text-sm weather_temperature_max mb-32 px-6">
                        ${dailyTemperatures[data].max.toFixed()}°
                    </p>
                    <p class="text-sm weather_temperature_min px-6">
                        ${dailyTemperatures[data].min.toFixed()}°
                    </p>
                    <div class="weather_icon_min mt-8 px-6 mb-2">
                        <img class="w-12 block mx-auto mt-4" src="https://openweathermap.org/img/wn/${dailyTemperatures[data].minIcon}@4x.png" alt="clouds">
                    </div>
                `

                forecastCardsContainer.appendChild(card)
            }

            document.querySelectorAll(".skeleton").forEach(el => el.classList.add("hidden"))
            document.querySelector(".forecast_cards_skeleton")?.classList.add("hidden")
            forecastCardsContainer.classList.remove("hidden")
            location.classList.remove("hidden")
        }
    }
}