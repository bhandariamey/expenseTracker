import './App.css';
import Home from './components/home/Home.jsx';
import { SnackbarProvider, useSnackbar } from 'notistack'

function App() {
  return (
    <SnackbarProvider>
      <Home/>
    </SnackbarProvider>

  );
}

export default App;
