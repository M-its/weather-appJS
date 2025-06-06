<img src="https://img.shields.io/badge/HTML-black?style=for-the-badge&logo=HTML5&logoColor=E34F26"/>
<img src="https://img.shields.io/badge/JAVASCRIPT-black?style=for-the-badge&logo=JavaScript&logoColor=F7DF1E"/>
<img src="https://img.shields.io/badge/CSS3-black?style=for-the-badge&logo=CSS3&logoColor=1572B6"/>
<img src="https://img.shields.io/badge/tailwind-black?style=for-the-badge&logo=tailwindcss&logoColor=61DAFB"/>


# Weather App

A modern, client-side weather application built with vanilla JavaScript that displays current weather conditions and forecasts using the OpenWeatherMap API.



## Features

- **Current Weather**: View real-time weather conditions with detailed information
- **Weather Forecast**: Check upcoming weather predictions for multiple days
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Location Search**: Search weather for any city worldwide
- **Weather Icons**: Visual weather condition indicators
- **Single Page Application**: Smooth navigation with custom client-side routing
- **Responsive Design**: Works on desktop and mobile devices
- **404 Error Handling**: Graceful handling of invalid routes

## Project Structure

```markdown:README.md
weather-app/
├── src/
│   ├── js/
│   │   ├── index.js                 # Main application entry point
│   │   ├── router.js                # Custom routing system
│   │   ├── weatherAPIHandler.js     # Current weather API logic
│   │   └── forecastAPIHandler.js    # Forecast API logic
│   ├── pages/
│   │   ├── current-weather.html     # Current weather page
│   │   ├── forecast.html            # Weather forecast page
│   │   └── 404.html                 # Error page
│   └── assets/
│       └── weather-forecast.png     # Local weather icon
├── configs.example.js               # Configuration template
├── index.html                       # Main HTML file
├── .gitignore                       # Git ignore file
└── README.md 
```

## Getting Started

### Prerequisites

- A modern **web browser**
- **Node.js** (for local server)
- **Local Web Server** (required for ES6 modules and CORS)
- **OpenWeatherMap API Key** (free registration at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/M-its/weather-appJS
cd weather-app
```

2. Start a local web server. You can use any of these options:

**Install dependencies:**
```bash
npm install
```

**Using Node.js (http-server):**
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Configure API Settings

**Step 1:** Copy the example configuration file:

```bash
cp configs.example.js configs.js
```

**Step 2:** Edit `configs.js` with your API credentials:

```javascript
export const config = {
    OPENWEATHER_API_KEY: "your_actual_api_key_here",
    OPENWEATHER_API_URL: "https://api.openweathermap.org/data/2.5/weather",
    OPENWEATHER_FORECAST_URL: "http://api.openweathermap.org/data/2.5/forecast",
    OPENWEATHER_LANG: "pt_br", // Change to your preferred language
}
```

**Step 3:** Get your OpenWeatherMap API key:
1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Replace `"your_api_key"` in `configs.js` with your actual key

## Usage

### API Endpoints

The app uses two OpenWeatherMap endpoints:
- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `http://api.openweathermap.org/data/2.5/forecast`

### Navigation

The app uses a custom client-side router with the following routes:

- `/` - Current weather page
- `/forecast` - Weather forecast page
- Any invalid route will show the 404 error page

### Routing System

The application features a custom JavaScript router that:
- Handles browser history (back/forward buttons)
- Supports dynamic route registration
- Provides 404 error handling
- Maintains SPA functionality without page reloads

## Development

### Adding New Routes

To add a new route, modify `src/js/index.js`:

```javascript
router.add("/new-route", "/src/pages/new-page.html")
```

### Router API

The custom router supports:
- `router.add(path, htmlFile)` - Register a new route
- `router.handle()` - Process current URL
- `router.route()` - Navigate programmatically

## Technologies Used

- **Vanilla JavaScript** - Core functionality
- **ES6 Modules** - Modern module system
- **HTML5** - Semantic markup
- **CSS3** - Styling (assumed)
- **Custom Router** - Client-side navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

*Note: ES6 modules require modern browser support*

## License

This project is licensed under the MIT License - see the LICENSE file for details.
