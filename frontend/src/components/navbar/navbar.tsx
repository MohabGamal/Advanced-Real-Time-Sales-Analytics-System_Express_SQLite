import { useEffect, useState } from "react"
import "./Navbar.css"
import { sun } from "../../assets"
import useFetch from "../../hooks/useFetch"
import { parseRecommendations } from "./utils"

type TWeather =  {
	city: string
	temperature: string
	pricing: string
	promotion: string
}

type TWeatherRes = {
	message: string
	weatherData: {
		city: string
		temperature: string
	}
	weatherRecommendations: string
}


const Navbar = () => {
	const [weather, setWeather] = useState<TWeather>()
	const { data, fetchApi } = useFetch<TWeatherRes>()
  
	useEffect(() => {
		fetchApi("http://localhost:8800/api/weather/")
	}, [])

	useEffect(() => {
		if (data) {
			const { pricing, promotion } = parseRecommendations(
				data.weatherRecommendations
			)
			setWeather({
				city: data.weatherData.city,
				temperature: data.weatherData.temperature,
				pricing,
				promotion,
			})
		}
	}, [data])

	return (
		<nav className="navbar">
			<div className="navbar-content">
				<img className="sun-img" src={sun} alt="sun" />
				<h2 className="nav-h">Real-Time Sales Analytics</h2>
				{weather && (
					<div className="weather-info">
						<span className="city">{weather.city}</span>
						<span className="temperature">{weather.temperature}</span>
						<div className="recommendations">
							<div className="recommendation-card">
								<h2>Weather Recommendations</h2>
								<div className="recommendation-section">
									<h3>Promotion</h3>
									<p>{weather.promotion}</p>
								</div>
								<div className="recommendation-section">
									<h3>Dynamic Pricing</h3>
									<p>
										{weather.pricing} <br />
										Current temperature: <strong>
											{weather.temperature}
										</strong>{" "}
										in <strong>{weather.city}</strong>.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Navbar
