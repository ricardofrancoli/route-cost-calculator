import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ManualForm from './ManualForm';
import AdvancedForm from './AdvancedForm';
import Result from './Result';
import Map from './Map';

import { Button } from '@material-ui/core';

const api_key = process.env.REACT_APP_API_KEY;

const FormInput = () => {
	const [data, setData] = useState({
		originLng: '',
		originLat: '',
		destinationLng: '',
		destinationLat: '',
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

	// If using AdvancedForm, find coordinates using Geonames.org
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
									originLng: townResult.lng,
									originLat: townResult.lat,
							  })
							: setData({
									...data,
									destinationLng: townResult.lng,
									destinationLat: townResult.lat,
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

	// If using AdvancedForm, find route using OSRM.org
	const fetchMapData = async () => {
		if (data.originLng && data.destinationLng) {
			axios
				.get(
					`https://router.project-osrm.org/route/v1/driving/${data.originLng},${data.originLat};${data.destinationLng},${data.destinationLat}`
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

	// When typing in form, change values from the data state accordingly
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
		setData({ ...data, distanceInKm: 0 });
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
			<Button
				onClick={switchManual}
				variant='outlined'
				style={{
					margin: '20px 0',
				}}
			>
				{isManual ? 'Switch to Origin – Destination' : 'Switch to Manual'}
			</Button>
			{isManual ? manualFormComponent : advancedFormComponent}
			<Button
				type='submit'
				variant='contained'
				style={{
					color: '#fffaf0',
					backgroundColor: '#cc6666',
					marginBottom: '20px',
				}}
				onClick={handleSubmit}
			>
				Search
			</Button>
			<div className='default-rates'>
				<ul>
					<li>Van – €0.25/Km</li>
					<li>Lorry – €0.50/Km</li>
				</ul>
			</div>
			{showResult && resultComponent}
			{!isManual && showResult ? (
				<Map
					origin={{ lng: data.originLng, lat: data.originLat }}
					destination={{ lng: data.destinationLng, lat: data.destinationLat }}
				/>
			) : (
				''
			)}
		</>
	);
};

export default FormInput;
