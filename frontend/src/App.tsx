import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material';
import  SendMe  from './components/SendMe';


const App: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () => 
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
              // light mode
              primary: {
                main: '#6C5CE7',
              },
              background: {
                default: '#F5F5F5',
                paper: '#FFFFFF',
              },
            }
          : {
            // dark mode
            primary: {
              main: '#6C5CE7',
            },
            background: {
              default: '#121212',
              paper: '#1E1E1E',
            },
          }),
        },
      }),
      [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SendMe colorMode={colorMode} />
    </ThemeProvider>
  );
};

export default App;