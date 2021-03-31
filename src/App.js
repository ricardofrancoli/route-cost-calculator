import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Button } from '@material-ui/core';

import ManualForm from './components/ManualForm';
import AdvancedForm from './components/AdvancedForm';
import Result from './components/Result';

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

	// const [searchResult, setSearchResult] = useState('');
	// const [townSearch, setTownSearch] = useState('');
	// const [origin, setOrigin] = useState('');
	// const [destination, setDestination] = useState('');

	const [isManual, setIsManual] = useState(true);
	const [showResult, setShowResult] = useState(false);

	console.log(data);

	// console.log(townSearch);

	// let townSearch;
	const fetchTownInfo = async (townSearch, direction) => {
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
				console.log(townResult);
				// setSearchResult(townResult);
				if (townResult) {
					direction === 'originName'
						? setData({
								...data,
								originName: townResult.toponymName,
								originLngLat: `${townResult.lng},${townResult.lat}`,
						  })
						: setData({
								...data,
								destinationName: townResult.toponymName,
								destinationLngLat: `${townResult.lng},${townResult.lat}`,
						  });
				}
			});
	};

	useEffect(() => {
		fetchTownInfo();
	}, []);

	const fetchMapData = async () => {
		if (data.originLngLat && data.destinationLngLat) {
			axios
				.get(
					`https://router.project-osrm.org/route/v1/driving/${data.originLngLat};${data.destinationLngLat}`
				)
				.then((response) => {
					try {
						// Change API data from 'm' to 'Km'
						const distance = parseFloat(
							response.data.routes[0].distance / 1000
						).toFixed(2);
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
		let name = event.target.name;
		console.log(value);

		if (name === 'originName' || name === 'destinationName') {
			console.log('hell');
			fetchTownInfo(value, name);
			// setTownSearch(value);
			return;
		}

		setData({
			...data,
			[name]: value,
		});
	};

	// const handleOrigin = (event) => {
	// 	setOrigin(event.target.value);
	// };

	// const handleDestination = (event) => {
	// 	setDestination(event.target.value);
	// };

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!isManual) {
			fetchMapData();
		}

		// Calculate total cost and give back a result with 2 decimals
		const totalCostCalc = parseFloat(
			data.distanceInKm * data.pricePerKm
		).toFixed(2);
		setTotalCost(totalCostCalc);
		console.log(totalCost);
		setShowResult(true);
	};

	// const handleClick = (event) => {
	// 	event.preventDefault();
	// 	console.log(event.target.name);
	// 	// Check whether the input is for the origin or the destination and change the 'data' state accordingly
	// 	origin
	// 		? setData({
	// 				...data,
	// 				originName: searchResult.toponymName,
	// 				originLngLat: `${searchResult.lng},${searchResult.lat}`,
	// 		  })
	// 		: setData({
	// 				...data,
	// 				destinationName: searchResult.toponymName,
	// 				destinationLngLat: `${searchResult.lng},${searchResult.lat}`,
	// 		  });

	// 	// setOrigin('');
	// 	// setDestination('');
	// };

	const switchManual = () => {
		setIsManual(!isManual);
		setShowResult(false);
	};

	const resultComponent = (
		<Result distanceInKm={data.distanceInKm} totalCost={totalCost} />
	);

	if (isManual) {
		return (
			<>
				<ManualForm
					handleSubmit={handleSubmit}
					handleChange={handleChange}
					value={{
						distanceInKm: data.distanceInKm,
						pricePerKm: data.pricePerKm,
					}}
				/>
				<Button onClick={switchManual}>Click</Button>
				{showResult && resultComponent}
			</>
		);
	}

	return (
		<>
			<AdvancedForm
				// handleClick={handleClick}
				// handleOrigin={handleOrigin}
				// handleDestination={handleDestination}
				handleSubmit={handleSubmit}
				handleChange={handleChange}
				value={data.pricePerKm}
			/>
			<Button onClick={switchManual}>Click</Button>
			{data.originName} {data.destinationName}
			{showResult && resultComponent}
		</>
	);
};

export default App;
