import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ILocation {
	country: string
	region: string
	name: string
	lat: string
	lon: string
}

interface ICurrent {
	temp_c: number
	is_day: boolean
	wind_mph: number
}

interface ICondition {
	condition: {}
	icon: string
	text: string
}
/* 
апи нашел
сделать так чтобы браузер спрашивал про мое местонахождение
если я отменяю то вывелся алерт из юай кита и все 

если же юзер согласился то тогда 
показывать красивенько информацию о его городе, регионе,
температуре, скорость ветра

у чата гпт спросить почему когда я обращаюсь вот так: data.condition.text - не работает 
а когда я запихиваю в состояние и обращаюсь так: condition.text - работает
то есть через одну точку 

*/

export const Geo = () => {
	const [isError, setIsError] = useState(false)
	const [location, setLocation] = useState({} as ILocation)
	const [current, setCurrent] = useState({} as ICurrent)
	const [condition, setCondition] = useState({} as ICondition)
	const geo: Geolocation = navigator.geolocation

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const res = await fetch(
					`https://api.weatherapi.com/v1/current.json?key=917944301b2e4b2f8cc71549241207&q=moscow`
				)
				const data = await res.json()

				setLocation(data.location)
				setCurrent(data.current)
				setCondition(data.current.condition)
				console.log(data.current)
			} catch (error) {
				console.log(error)
			}
		}
		fetchWeather()

		if (geo) {
			geo.getCurrentPosition(
				(position) => {
					const lat = position.coords.latitude
					const lon = position.coords.longitude
				},
				(error) => {
					if (error.PERMISSION_DENIED) {
						return setIsError(true)
					}
				}
			)
		} else {
			console.log('Not working...')
		}
	}, [])

	return (
		<div>
			{isError && (
				<Alert>
					<Terminal className='h-4 w-4' />
					<AlertTitle>Error!</AlertTitle>
					<AlertDescription>
						Error, you don't access your geoposition
					</AlertDescription>
				</Alert>
			)}

			{!isError && (
				<div>
					<div
						className='temp-condition flex items-center text-xl
          gap-4'
					>
						<p className=''>
							{current.temp_c > 0 && '+'}
							{current.temp_c}C&deg;
						</p>
						<p> {condition.text}</p>
						<img src={condition.icon} alt={condition.text} />
						<p>Wind speed: {current.wind_mph} mph</p>
					</div>

					<div className='info-city'>
						<p>Country: {location.country} </p>
						<p>Region: {location.region} </p>
						<p>City: {location.name} </p>
					</div>

					<div className='info-latit-long'>
						<p>Latitude: {location.lat} </p>
						<p>Longitude: {location.lon}</p>
					</div>
				</div>
			)}
		</div>
	)
}
