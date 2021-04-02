import React from 'react';

const Result = ({ distanceInKm, totalCost, pricePerKm, defaultRate }) => {
	return (
		<div>
			<p>Your {distanceInKm}Km trip will be</p>
			<ul>
				<li>
					🚀 – €{totalCost} at a €{pricePerKm}/Km rate
				</li>
				<li>🚐 – €{defaultRate.van} with a van</li>
				<li>🚚 – €{defaultRate.lorry} with a lorry</li>
			</ul>
		</div>
	);
};

export default Result;
