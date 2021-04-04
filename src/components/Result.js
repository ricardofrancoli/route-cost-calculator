import React from 'react';

const Result = ({ distanceInKm, totalCost, pricePerKm, defaultRate }) => {
	return (
		<div className='result'>
			<h4>Your {distanceInKm}Km trip will cost:</h4>
			<ul>
				<li>
					🚀 – €{totalCost} with a €{pricePerKm}/Km rate
				</li>
				<li>🚐 – €{defaultRate.van} with a van</li>
				<li>🚚 – €{defaultRate.lorry} with a lorry</li>
			</ul>
		</div>
	);
};

export default Result;
