import React from 'react';

import PricePerKm from './PricePerKm';

const AdvancedForm = ({ handleSubmit, handleChange, value }) => {
	return (
		<form className='form advanced-form'>
			<div>
				<input
					name='originName'
					placeholder='origin'
					onChange={handleChange}
				></input>
			</div>
			<div>
				<input
					name='destinationName'
					placeholder='destination'
					onChange={handleChange}
				></input>
			</div>
			<PricePerKm value={value} handleChange={handleChange} />
		</form>
	);
};

export default AdvancedForm;
