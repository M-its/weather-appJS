import { weatherUtility } from "./weatherAPIHandler.js"
import { forecastUtility } from "./forecastAPIHandler.js"

export class Router {
    constructor() {
        this.routes = {}
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
        const route = this.routes[pathname] || this.routes[404]

        try {
            const response = await fetch(route)
            const html = await response.text()
            const app = document.querySelector("#app")
            app.innerHTML = html

            if (pathname === "/") {
                const weatherService = new weatherUtility()
                const weatherData = await weatherService.fetchWeatherData()
                weatherService.displayWeatherInfo(weatherData)
            } else if (pathname === "/forecast") {
                const forecastService = new forecastUtility()
                const forecastData = await forecastService.fetchForecastData()
                forecastService.displayForecastCard(forecastData)
            }
        } catch (error) {
            console.error("Error fetching route:", error)
        }
    }
}
