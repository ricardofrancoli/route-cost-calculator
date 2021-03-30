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
					name='origin'
					placeholder='origin'
					onChange={handleOrigin}
				></input>
				<button onClick={handleClick}>Add</button>
			</label>
			<label>
				To:
				<input
					name='destination'
					placeholder='destination'
					onChange={handleDestination}
				></input>
				<button onClick={handleClick}>Add</button>
			</label>
			<PricePerKm value={value} handleChange={handleChange} />
			<button>Submit</button>
		</form>
	);
};

export default AdvancedForm;
