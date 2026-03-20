import { weatherUtility } from "./weatherAPIHandler.js"
import { forecastUtility } from "./forecastAPIHandler.js"

export class Router {
    constructor() {
        this.routes = {}
        this.activeService = null
        this.header = document.querySelector("header")
    }

    add(routeName, page) {
        this.routes[routeName] = page
    }

    route(event) {
        event = event || window.event
        event.preventDefault()

        window.history.pushState({}, "", event.target.href)

        this.handle()
    }

    async handle() {
        const { pathname } = window.location
        const is404 = !this.routes[pathname]
        const route = this.routes[pathname] || this.routes[404]

        try {
            if (this.activeService) {
                this.activeService.destroy()
                this.activeService = null
            }

            const response = await fetch(route)
            const html = await response.text()
            const app = document.querySelector("#app")
            app.innerHTML = html

            if (is404) {
                this.header.classList.add("hidden")
                app.classList.add("!p-0")
            } else {
                this.header.classList.remove("hidden")
                app.classList.remove("!p-0")
            }

            if (pathname === "/") {
                const weatherService = new weatherUtility()
                this.activeService = weatherService
                const weatherData = await weatherService.fetchWeatherData()
                weatherService.displayWeatherInfo(weatherData)
            } else if (pathname === "/forecast") {
                const forecastService = new forecastUtility()
                this.activeService = forecastService
                const forecastData = await forecastService.fetchForecastData()
                forecastService.displayForecastCard(forecastData)
            }
        } catch (error) {
            console.error("Error fetching route:", error)
        }
    }
}