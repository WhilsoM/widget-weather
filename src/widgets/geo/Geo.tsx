import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Progress } from '@/components/ui/progress'
import { Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ILocation {
	country: string
	region: string
	name: string
}

interface ICurrent {
	temp_c: number
	is_day: boolean
	wind_mph: number
}

interface ICondition {
	icon: string
	text: string
}
/* 
  у чата гпт спросить почему когда я обращаюсь вот так: data.condition.text - не работает 
  а когда я запихиваю в состояние и обращаюсь так: condition.text - работает
  то есть через одну точку 
*/

export const Geo = () => {
	const [isError, setIsError] = useState(false)
	const [location, setLocation] = useState({} as ILocation)
	const [current, setCurrent] = useState({} as ICurrent)
	const [condition, setCondition] = useState({} as ICondition)
	const [loading, setLoading] = useState(false)

	const geo: Geolocation = navigator.geolocation

	const fetchWeather = async (position: GeolocationPosition) => {
		setLoading(true)
		const { latitude, longitude } = position.coords

		try {
			const res = await fetch(
				`https://api.weatherapi.com/v1/current.json?key=917944301b2e4b2f8cc71549241207&q=${latitude}, ${longitude}`
			)
			const data = await res.json()

			setLocation(data.location)
			setCurrent(data.current)
			setCondition(data.current.condition)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (geo) {
			geo.getCurrentPosition(fetchWeather, (error) => {
				if (error.PERMISSION_DENIED) {
					return setIsError(true)
				}
			})
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

			{loading && <Progress value={100} className='' />}

			{!isError && !loading && (
				<div className='flex flex-col items-center justify-center text-center'>
					<div className='icon'>
						<img src={condition.icon} alt={condition.text} />
					</div>

					<div
						className='flex
            items-center
            text-xl
            gap-4 
            mb-4'
					>
						<p>
							{current.temp_c > 0 && '+'}
							{current.temp_c}C&deg;
						</p>
					</div>

					<div className='mb-4'>
						<p>Wind speed: {current.wind_mph} mph</p>
					</div>

					<div className='flex flex-col gap-3'>
						<p>Country: {location.country} </p>
						<p>Region: {location.region} </p>
						<HoverCard>
							<HoverCardTrigger>City: {location.name} </HoverCardTrigger>
							<HoverCardContent>
								if this city is not yours, it means that your city is very close
								to this city. However, the information is the same.
							</HoverCardContent>
						</HoverCard>
					</div>
				</div>
			)}
		</div>
	)
}
