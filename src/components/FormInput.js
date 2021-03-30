import React, { useEffect, useState } from 'react';

import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY;

const FormInput = () => {
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');
	const [result, setResult] = useState('');
	const [data, setData] = useState({
		originName: '',
		destinationName: '',
		originLngLat: '',
		destinationLngLat: '',
		distanceInKm: 0,
		pricePerKm: 0,
	});
	const [totalCost, setTotalCost] = useState(0);

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
					setResult(townResult);
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
		event.preventDefault();
		fetchMapData();
		const totalCostCalculation = (data.distanceInKm * data.pricePerKm).toFixed(
			2
		);
		setTotalCost(totalCostCalculation);
	};

	const handleClick = () => {
		console.log(result);
		origin
			? setData((data) => ({
					...data,
					originName: result.toponymName,
					originLngLat: `${result.lng},${result.lat}`,
			  }))
			: setData((data) => ({
					...data,
					destinationName: result.toponymName,
					destinationLngLat: `${result.lng},${result.lat}`,
			  }));

		setOrigin('');
		setDestination('');
	};

	return (
		<div>
			{/* <form onSubmit={handleSubmit}>
				<label>
					Distance in Km:
					<input
						type='number'
						placeholder='distance in km'
						name='distance'
						value={data.distance}
						onChange={handleChange}
					></input>
				</label>
				<label>
					Price per Km:
					<input
						type='number'
						step='0.01'
						min='0'
						placeholder='price per km'
						name='pricePerKm'
						value={data.pricePerKm}
						onChange={handleChange}
					></input>
				</label>
				<button>Submit</button>
			</form> */}
			<br />
			<form onSubmit={handleSubmit}>
				<label>
					From:
					<input name='origin' placeholder='NS' onChange={handleOrigin}></input>
					<button onClick={handleClick}>Add</button>
				</label>
				<label>
					To:
					<input
						name='destination'
						placeholder='WE'
						onChange={handleDestination}
					></input>
					<button onClick={handleClick}>Add</button>
				</label>
				<label>
					Price per Km:
					<input
						type='number'
						step='0.01'
						min='0'
						placeholder='price per km'
						name='pricePerKm'
						value={data.pricePerKm}
						onChange={handleChange}
					></input>
				</label>
				<button>Submit</button>
			</form>
			<h3>It will cost you:</h3>
			<p>
				From {data.originName} to {data.destinationName} it will cost you €
				{totalCost}
			</p>
		</div>
	);
};

export default FormInput;
