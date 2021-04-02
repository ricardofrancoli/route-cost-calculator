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

	const defaultRates = {
		van: 0.25,
		lorry: 0.5,
	};

	// Calculate total cost and give back a result with 2 decimals
	let priceCalculation = (distance, price) =>
		parseFloat(distance * price).toFixed(2);
	let totalCost = priceCalculation(data.distanceInKm, data.pricePerKm);
	let vanTotalCost = priceCalculation(data.distanceInKm, defaultRates.van);
	let lorryTotalCost = priceCalculation(data.distanceInKm, defaultRates.lorry);

	const [isManual, setIsManual] = useState(true);
	const [showResult, setShowResult] = useState(false);

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
				try {
					const townResult = response.data.geonames[0];
					if (townResult) {
						setData({ ...data, [direction]: townResult.toponymName });
						direction === 'originName'
							? setData({
									...data,
									originLngLat: `${townResult.lng},${townResult.lat}`,
							  })
							: setData({
									...data,
									destinationLngLat: `${townResult.lng},${townResult.lat}`,
							  });
					}
				} catch (err) {
					console.log(err);
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

		if (name === 'originName' || name === 'destinationName') {
			fetchTownInfo(value, name);
			return;
		}

		setData({
			...data,
			[name]: value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!isManual) {
			fetchMapData();
		}

		setShowResult(true);
	};

	const switchManual = () => {
		setIsManual(!isManual);
		setShowResult(false);
	};

	const manualFormComponent = (
		<ManualForm
			handleSubmit={handleSubmit}
			handleChange={handleChange}
			value={{
				distanceInKm: data.distanceInKm,
				pricePerKm: data.pricePerKm,
			}}
		/>
	);

	const advancedFormComponent = (
		<AdvancedForm
			handleSubmit={handleSubmit}
			handleChange={handleChange}
			value={data.pricePerKm}
		/>
	);

	const resultComponent = (
		<Result
			distanceInKm={data.distanceInKm}
			totalCost={totalCost}
			pricePerKm={data.pricePerKm}
			defaultRate={{
				van: vanTotalCost,
				lorry: lorryTotalCost,
			}}
		/>
	);

	return (
		<>
			<h1>Route Cost Calculator</h1>
			<Button onClick={switchManual}>Click</Button>
			{isManual ? manualFormComponent : advancedFormComponent}
			<div>
				<p>Default rates</p>
				<ul>
					<li>Van – €0.25/Km</li>
					<li>Lorry – €0.50/Km</li>
				</ul>
			</div>
			{showResult && resultComponent}
		</>
	);
};

export default App;
