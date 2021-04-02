import React from 'react';

import PricePerKm from './PricePerKm';

const AdvancedForm = ({ handleSubmit, handleChange, value }) => {
	return (
		<form onSubmit={handleSubmit}>
			<label>
				From:
				<input
					name='originName'
					placeholder='origin'
					onChange={handleChange}
				></input>
			</label>
			<label>
				To:
				<input
					name='destinationName'
					placeholder='destination'
					onChange={handleChange}
				></input>
			</label>
			<PricePerKm value={value} handleChange={handleChange} />
			<button>Submit</button>
		</form>
	);
};

export default AdvancedForm;
