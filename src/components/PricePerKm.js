import React from 'react';

const PricePerKm = ({ value, handleChange }) => {
	return (
		<div>
			<label>
				Price per Km:
				<input
					type='number'
					step='0.01'
					min='0'
					placeholder='price per km'
					name='pricePerKm'
					value={value}
					onChange={handleChange}
				></input>
			</label>
		</div>
	);
};

export default PricePerKm;
