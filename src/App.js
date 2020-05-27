import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import light from './themes/light';
import Home from './pages/Home';

function App() {
  return (
    <MuiThemeProvider theme={light}>
      <Home />
    </MuiThemeProvider>
  );
}

export default App;
