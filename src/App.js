import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ManualForm from './components/ManualForm';
import AdvancedForm from './components/AdvancedForm';

const api_key = process.env.REACT_APP_API_KEY;

const App = () => {
	const [data, setData] = useState({
		originName: '',
		destinationName: '',
		originLngLat: '',
		destinationLngLat: '',
		distanceInKm: 0,
		pricePerKm: 0,
	});

	const [totalCost, setTotalCost] = useState(0);

	const [searchResult, setSearchResult] = useState('');
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');

	const [isManual, setIsManual] = useState(true);

	console.log(data);

	useEffect(() => {
		let townSearch;
		origin ? (townSearch = origin) : (townSearch = destination);
		if (townSearch) {
			axios
				.get('http://secure.geonames.org/searchJSON?', {
					params: {
						q: townSearch,
						orderby: 'relevance',
						cities: 'cities5000',
						username: api_key,
					},
				})
				.then((response) => {
					const townResult = response.data.geonames[0];
					setSearchResult(townResult);
				});
		}
	}, [origin, destination]);

	const fetchMapData = async () => {
		if (data.originLngLat && data.destinationLngLat) {
			axios
				.get(
					`https://router.project-osrm.org/route/v1/driving/${data.originLngLat};${data.destinationLngLat}`
				)
				.then((response) => {
					try {
						// Change API data from 'm' to 'Km'
						const distance = response.data.routes[0].distance / 1000;
						setData({ ...data, distanceInKm: distance });
					} catch (err) {
						console.log(err);
					}
				});
		}
	};

	useEffect(() => {
		fetchMapData();
	}, []);

	const handleChange = (event) => {
		let value = event.target.value;

		if (event.target.type === 'number') value = parseFloat(value).toFixed(2);

		setData({
			...data,
			[event.target.name]: value,
		});
	};

	const handleOrigin = (event) => {
		setOrigin(event.target.value);
	};

	const handleDestination = (event) => {
		setDestination(event.target.value);
	};

	const handleSubmit = (event) => {
		console.log('EVENT –––––', event);
		event.preventDefault();
		fetchMapData();
		// Calculate total cost and give back a result with 2 decimals
		const totalCostCalculation = (data.distanceInKm * data.pricePerKm).toFixed(
			2
		);
		setTotalCost(totalCostCalculation);
	};

	const handleClick = () => {
		// Check whether the input is for the origin or the destination and change the 'data' state accordingly
		origin
			? setData((data) => ({
					...data,
					originName: searchResult.toponymName,
					originLngLat: `${searchResult.lng},${searchResult.lat}`,
			  }))
			: setData((data) => ({
					...data,
					destinationName: searchResult.toponymName,
					destinationLngLat: `${searchResult.lng},${searchResult.lat}`,
			  }));

		setOrigin('');
		setDestination('');
	};

	if (isManual) {
		return (
			<ManualForm
				handleSubmit={handleSubmit}
				handleChange={handleChange}
				value={{
					distanceInKm: data.distanceInKm,
					pricePerKm: data.pricePerKm,
				}}
			/>
		);
	}

	return (
		<div>
			<AdvancedForm
				handleClick={handleClick}
				handleOrigin={handleOrigin}
				handleDestination={handleDestination}
				handleSubmit={handleSubmit}
				handleChange={handleChange}
				value={data.pricePerKm}
			/>
			<h3>It will cost you:</h3>
			<p>
				From {data.originName} to {data.destinationName} it will cost you €
				{totalCost}
			</p>
		</div>
	);
};

export default App;
