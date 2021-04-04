import React from 'react';

import FormInput from './components/FormInput';

import { Grid } from '@material-ui/core';

import './index.css';

const App = () => {
	return (
		<Grid
			container
			direction='column'
			justify='flex-start'
			alignItems='center'
			style={{ minHeight: '100vh' }}
		>
			<FormInput />
		</Grid>
	);
};

export default App;
