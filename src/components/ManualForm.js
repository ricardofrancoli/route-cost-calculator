import React from 'react';

import { Grid, Button } from '@material-ui/core';

import PricePerKm from './PricePerKm';

const ManualForm = ({ handleSubmit, handleChange, value }) => {
	return (
		<form onSubmit={handleSubmit}>
			Distance in Km:
			<input
				type='number'
				step='0.1'
				min='0'
				placeholder='distance in km'
				name='distanceInKm'
				vlaue={value.distanceInKm}
				onChange={handleChange}
			></input>
			<PricePerKm value={value.pricePerKm} handleChange={handleChange} />
			<button>Submit</button>
		</form>
	);
};

export default ManualForm;
