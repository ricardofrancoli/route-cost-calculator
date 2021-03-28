import React, { useState } from 'react';

const FormInput = ({ route }) => {
	const [distance, setDistance] = useState(0);
	const [price, setPrice] = useState(0);
	const [totalCost, setTotalCost] = useState(0);

	const handleDistance = (event) => {
		setDistance(event.target.value);
	};

	const handlePrice = (event) => {
		setPrice(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setTotalCost(distance * price);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					Distance in Km:
					<input
						type='number'
						placeholder='distance in km'
						onChange={handleDistance}
					></input>
				</label>
				<label>
					Price per Km:
					<input
						type='number'
						step='0.01'
						placeholder='price per km'
						onChange={handlePrice}
					></input>
				</label>
				<button>Submit</button>
			</form>
			<h3>It will cost you:</h3>
			<p>{totalCost}</p>
		</div>
	);
};

export default FormInput;
