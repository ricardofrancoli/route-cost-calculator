import React from 'react';

const Result = ({ distanceInKm, totalCost }) => {
	return (
		<div>
			<p>
				Your {distanceInKm}Km trip will be €{totalCost}
			</p>
		</div>
	);
};

export default Result;
