import React from 'react';

import PricePerKm from './PricePerKm';

const AdvancedForm = ({
	handleSubmit,
	handleOrigin,
	handleDestination,
	handleClick,
	handleChange,
	value,
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<label>
				From:
				<input
					name='originName'
					placeholder='origin'
					// onChange={handleOrigin}
					onChange={handleChange}
				></input>
				<button onClick={handleClick}>Add</button>
			</label>
			<label>
				To:
				<input
					name='destinationName'
					placeholder='destination'
					// onChange={handleDestination}
					onChange={handleChange}
				></input>
				<button onClick={handleClick}>Add</button>
			</label>
			<PricePerKm value={value} handleChange={handleChange} />
			<button>Submit</button>
		</form>
	);
};

export default AdvancedForm;
