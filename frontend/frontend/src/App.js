import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://smart-traffic-system-am0l.onrender.com';

function App() {
  const [trafficData, setTrafficData] = useState({});
  const [greenSignal, setGreenSignal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trafficResponse = await fetch(`${API_BASE_URL}/traffic`);
        const traffic = await trafficResponse.json();
        setTrafficData(traffic);

        const signalResponse = await fetch(`${API_BASE_URL}/signal`);
        const signal = await signalResponse.json();
        setGreenSignal(signal.green);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Smart Traffic System</h1>
        <div>
          <h2>Traffic Data</h2>
          <p>North: {trafficData.north}</p>
          <p>South: {trafficData.south}</p>
          <p>East: {trafficData.east}</p>
          <p>West: {trafficData.west}</p>
        </div>
        <div>
          <h2>Green Signal: {greenSignal}</h2>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
