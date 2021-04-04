import React from 'react';

import FormInput from './components/FormInput';

import { Grid } from '@material-ui/core';

const App = () => {
	return (
		<Grid container direction='column' justify='center'>
			<FormInput />
		</Grid>
	);
};

export default App;
