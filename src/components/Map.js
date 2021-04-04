import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_API_TOKEN;

const Map = ({ origin, destination, distanceInKm }) => {
	const mapContainer = useRef();

	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
		});

		// Origin Marker
		new mapboxgl.Marker({
			color: '#ff6961',
		})
			.setLngLat([origin.lng, origin.lat])
			.addTo(map);

		// Destination Marker
		new mapboxgl.Marker({
			color: '#77dd77',
		})
			.setLngLat([destination.lng, destination.lat])
			.addTo(map);

		// Create bounds between both markers and center it
		const bounds = [
			[origin.lng, origin.lat],
			[destination.lng, destination.lat],
		];

		map.fitBounds(bounds, { padding: 30 });
	}, [origin, destination, distanceInKm]);

	return <div className='map-container' ref={mapContainer} />;
};

export default Map;
