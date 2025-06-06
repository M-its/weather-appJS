import { config } from "../../configs.js"

const form = document.querySelector("form")
const inputWeather = form.querySelector(".weather_search")
const celcius = document.querySelector(".weather_celcius")
const farenheit = document.querySelector(".weather_farenheit")

const {
    OPENWEATHER_API_KEY: apiKey,
    OPENWEATHER_API_URL: apiUrl,
    OPENWEATHER_LANG: lang,
} = config

export class weatherUtility {
    constructor() {
        this.location = "Rio de Janeiro"
        this.unit = "metric"
        this.unitChanged = false
        this.initEventListeners()
    }

    async fetchWeatherData() {
        let currentLocation = this.location
        const currentUnit = this.unit
        const url = `${apiUrl}?q=${currentLocation}&appid=${apiKey}&lang=${lang}&units=${currentUnit}`

        try {
            const response = await fetch(url)
            const weatherData = await response.json()
            return weatherData
        } catch (error) {
            console.error("Erro ao buscar dados do clima:", error)
        }
    }

    initEventListeners() {
        form.addEventListener("submit", async (e) => {
            e.preventDefault()
            this.location = inputWeather.value
            const weatherData = await this.fetchWeatherData()
            this.displayWeatherInfo(weatherData)
            inputWeather.value = ""
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

                    const weatherData = await this.fetchWeatherData()
                    this.displayWeatherInfo(weatherData)
                    this.unitChanged = false
                }
            })
        })
    }

    convertCountryCode(country) {
        let regionNames = new Intl.DisplayNames(["pt"], { type: "region" })
        return regionNames.of(country)
    }

    displayWeatherInfo(weatherData) {
        if (weatherData) {
            console.log("Dados do clima:", weatherData)
            let location = document.querySelector(".weather_location")
            const forecast = document.querySelector(".weather_icon")
            const temperature = document.querySelector(".weather_temperature")
            const condition = document.querySelector(".weather_condition")
            const minTemp = document.querySelector(".weather_min")
            const maxTemp = document.querySelector(".weather_max")
            const realFeel = document.querySelector(".weather_real_feel")
            const humidity = document.querySelector(".weather_humidity")
            const wind = document.querySelector(".weather_wind")
            const rainChance = document.querySelector(".weather_rain_chance")

            location.innerText = `${
                weatherData.name
            }, ${this.convertCountryCode(weatherData.sys.country)}`
            forecast.innerHTML = `<img class="w-24 block mx-auto mb-4" src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" alt="${weatherData.weather.main}">`
            temperature.innerHTML = `${weatherData.main.temp.toFixed()} <span class="ml-[-10px] text-lg align-top">&#176</span>`
            condition.innerText = weatherData.weather[0].description
            minTemp.innerHTML = `Min: ${weatherData.main.temp_min.toFixed()}<span>&#176</span>`
            maxTemp.innerHTML = `Max: ${weatherData.main.temp_max.toFixed()}<span>&#176</span>`
            realFeel.innerHTML = `${weatherData.main.feels_like.toFixed()}<span>&#176</span>`
            wind.innerHTML = `${weatherData.wind.speed} ${
                this.unit === "imperial" ? "mph" : "m/s"
            }`
            humidity.innerHTML = `${weatherData.main.humidity}%`
            rainChance.innerHTML = `${weatherData.main.feels_like}<span>&#176</span>`
            rainChance.innerText = `${
                weatherData.rain === undefined
                    ? "----"
                    : weatherData.rain["1h"] + " mm"
            }`
        } else {
            console.error("Erro ao buscar dados do clima.")
        }
    }
}
