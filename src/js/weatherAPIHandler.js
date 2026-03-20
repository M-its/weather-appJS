export class weatherUtility {
    constructor() {
        this.location = "Rio de Janeiro"
        this.unit = "metric"
        this.unitChanged = false
        this.form = document.querySelector("form")
        this.inputWeather = this.form.querySelector(".weather_search")
        this.celcius = document.querySelector(".weather_celcius")
        this.farenheit = document.querySelector(".weather_farenheit")
        this.controller = new AbortController()
        this.initEventListeners()
    }

    destroy() {
        this.controller.abort()
    }

    async fetchWeatherData() {
        const currentLocation = this.location
        const currentUnit = this.unit
        const url = `/api/weather?q=${encodeURIComponent(currentLocation)}&units=${currentUnit}&lang=pt_br`

        try {
            const response = await fetch(url)
            const weatherData = await response.json()

            if (!response.ok) {
                console.error("Erro retornado pelo servidor:", weatherData.error)
                return null
            }

            return weatherData
        } catch (error) {
            console.error("Erro ao buscar dados do clima:", error)
            return null
        }
    }

    initEventListeners() {
        this.form.addEventListener("submit", async (e) => {
            e.preventDefault()
            this.location = this.inputWeather.value
            this.showSkeletons()
            const weatherData = await this.fetchWeatherData()
            this.displayWeatherInfo(weatherData)
            this.inputWeather.value = ""
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
                    const weatherData = await this.fetchWeatherData()
                    this.displayWeatherInfo(weatherData)
                    this.unitChanged = false
                }
            }, { signal: this.controller.signal })
        })
    }

    showSkeletons() {
        document.querySelectorAll(".skeleton").forEach(el => el.classList.remove("hidden"))
        document.querySelector(".weather_location")?.classList.add("hidden")
        document.querySelector(".weather_temperature")?.classList.add("hidden")
        document.querySelectorAll(".weather_condition").forEach(el => el.classList.add("hidden"))
        document.querySelector(".weather_minmax_row")?.classList.add("hidden")
        document.querySelector(".weather_cards_skeleton")?.classList.remove("hidden")
        document.querySelector(".weather_cards_real")?.classList.add("hidden")
    }

    convertCountryCode(country) {
        let regionNames = new Intl.DisplayNames(["pt"], { type: "region" })
        return regionNames.of(country)
    }

    displayWeatherInfo(weatherData) {
        if (weatherData) {
            const location = document.querySelector(".weather_location")
            const forecast = document.querySelector(".weather_icon")
            const temperature = document.querySelector(".weather_temperature")
            const condition = document.querySelector(".weather_condition")
            const minTemp = document.querySelector(".weather_min")
            const maxTemp = document.querySelector(".weather_max")
            const realFeel = document.querySelector(".weather_real_feel")
            const humidity = document.querySelector(".weather_humidity")
            const wind = document.querySelector(".weather_wind")
            const rainChance = document.querySelector(".weather_rain_chance")

            location.innerText = `${weatherData.name}, ${this.convertCountryCode(weatherData.sys.country)}`
            forecast.innerHTML = `<img class="w-24 max-[380px]:w-14 sm:w-24 block mx-auto mb-2 max-[380px]:mb-1 sm:mb-3" src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" alt="${weatherData.weather[0].main}">`
            temperature.innerHTML = `${weatherData.main.temp.toFixed()} <span class="ml-[-10px] text-lg align-top">&#176</span>`
            condition.innerText = weatherData.weather[0].description
            minTemp.innerHTML = `Min: ${weatherData.main.temp_min.toFixed()}<span>&#176</span>`
            maxTemp.innerHTML = `Max: ${weatherData.main.temp_max.toFixed()}<span>&#176</span>`
            realFeel.innerHTML = `${weatherData.main.feels_like.toFixed()}<span>&#176</span>`
            wind.innerHTML = `${weatherData.wind.speed} ${this.unit === "imperial" ? "mph" : "m/s"}`
            humidity.innerHTML = `${weatherData.main.humidity}%`
            rainChance.innerText = `${weatherData.rain === undefined ? "----" : weatherData.rain["1h"] + " mm"}`

            document.querySelectorAll(".skeleton").forEach(el => el.classList.add("hidden"))
            location.classList.remove("hidden")
            temperature.classList.remove("hidden")
            condition.classList.remove("hidden")
            document.querySelector(".weather_minmax_row")?.classList.remove("hidden")
            document.querySelector(".weather_cards_skeleton")?.classList.add("hidden")
            document.querySelector(".weather_cards_real")?.classList.remove("hidden")
        } else {
            console.error("Erro ao buscar dados do clima.")
        }
    }
}