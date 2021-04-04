import React from 'react';

import PricePerKm from './PricePerKm';

const ManualForm = ({ handleChange, value }) => {
	return (
		<form className='form manual-form'>
			Distance in Km:
			<input
				type='number'
				step='0.1'
				min='0'
				placeholder='distance in km'
				name='distanceInKm'
				value={value.distanceInKm}
				onChange={handleChange}
			></input>
			<PricePerKm value={value.pricePerKm} handleChange={handleChange} />
		</form>
	);
};

export default ManualForm;
