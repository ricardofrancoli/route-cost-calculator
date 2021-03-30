import React from 'react';

import PricePerKm from './PricePerKm';

const ManualForm = ({ handleSubmit, handleChange, value }) => {
	return (
		<form onSubmit={handleSubmit}>
			<label>
				Distance in Km:
				<input
					type='number'
					placeholder='distance in km'
					name='distance'
					value={value.distanceInKm}
					onChange={handleChange}
				></input>
			</label>
			<PricePerKm value={value.pricePerKm} handleChange={handleChange} />
			<button>Submit</button>
		</form>
	);
};

export default ManualForm;
