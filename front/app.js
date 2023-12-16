import React, {useState,useEffect} from 'react';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError
} from "react-router-dom";
import axios from 'axios';


function Dashboard() {
    return (
            <div id="dashboard_page">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="well">
                            <h4>Zones</h4>
                            <p>3 Zones</p> 
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="well">
                            <h4>Sensors</h4>
                            <p>100 sensors</p> 
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="well">
                            <h4>Readings</h4>
                            <p>10 Million</p> 
                        </div>
                    </div>
                </div>
                <div class="well">
                    <h4>Dashboard</h4>
                    <p>Some text..</p>
                </div>
            </div>
      );
}

function Data() {
    const [zoneData, setZoneData] = useState([]);
    const [loadingErr, setErr] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch('http://localhost:5000/getzones')
          .then((res) => res.json())
          .then(res => {
            console.log('Response:', res);
      
            if (res && Array.isArray(res.data)) {
              // Map the data array to a new format
              const mappedData = res.data.map(item => {
                // Transform the item into a new format. Adjust as needed.
                return {
                  zoneId: item.zoneId,
                  zoneName: item.zoneName,
                  id:item._id
                  // Include any other properties you need from 'item'
                };
              });
              setZoneData(mappedData);
            } else {
              throw new Error('Invalid response format');
            }
          })
          .catch(error => console.error('Error fetching data:', error));
      }, []);
      
      useEffect(() => {
        console.log('Current zoneData:', zoneData);
      }, [zoneData]);
    
    const [data, setData] = useState([]); //Default value is an empty array
    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then((res) => res.json())
            .then((json_obj) => setData(json_obj.products))
            .catch((err) => console.error(err));
    }, []);

    const [zoneId, setZoneId] = useState('');
    const [zoneName, setZoneName] = useState('');

    const [sensorId, setSensorId] = useState('');
    const [sensorName, setSensorName] = useState('');
    const [sensorType, setSensorType] = useState('');
    const [sensorLocation, setSensorLocation] = useState('');

    const handleZoneSubmit = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
    
        // Handle form submission logic here (e.g., sending data to the server)
        axios.post('', {zoneId,zoneName})
        .then(result => console.log(result))
        .catch(err => console.log(err))
      };
      const handleSensorSubmit = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
    
        // Handle form submission logic here (e.g., sending data to the server)
        axios.post('', {sensorId,sensorName,sensorLocation})
        .then(result => console.log(result))
        .catch(err => console.log(err))
      };
    return (
            <div id="datacontrol_page">
            <div class="row">
                <div class="col-sm-6">
                    <div class="well">
                        <h4>Add Zone</h4>
                        <form onSubmit={handleZoneSubmit}>
                            <input type="text" 
                                value={zoneId} 
                                onChange={e => setZoneId(e.target.value)} 
                                placeholder='Zone Id'/>
                            <input type="text" 
                                value={zoneName} 
                                onChange={e => setZoneName(e.target.value)} 
                                placeholder='Zone Name'/>
                            <input type="submit" value="Add Using REST API"/>
                        </form> 
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="well">
                        <h4>Add Sensor</h4>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <ul>
                            {zoneData.length > 0 ? (zoneData.map((i) => <li key={i._id}>{i.zoneName}</li>)
                            ) : (
                                <li>No data available</li>
                            )}
                            <p>{loadingErr}</p>

                            </ul>
                        )}
                        {/* <ul>
                            {
                                data.map( item => <li> {item.title} </li> )
                            }
                        </ul> */}
                        <form onSubmit={handleSensorSubmit}>
                            <select value={sensorLocation} onChange={e => setSensorLocation(e.target.value)} required>
                            {zoneData.map((item) => (
                                <option key={item._id} value={item.zoneId}>
                                {item.zoneName}
                                </option>
                            ))
                            }
                                
                            </select>
                            <input type="text" 
                                value={sensorId} 
                                onChange={e => setSensorId(e.target.value)} 
                                placeholder='Sensor Id'/>
                            <input type="text" 
                                value={sensorName} 
                                onChange={e => setSensorName(e.target.value)} 
                                placeholder='Sensor Name'/>
                            <input type="text" 
                                value={sensorType} 
                                onChange={e => setSensorType(e.target.value)} 
                                placeholder='Sensor Name'/>
                            <input type="submit" value="Add Using REST API"/>
                        </form> 
                    </div>
                </div>
            </div>
        </div>
      );
}

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/data",
      element: <Data />,
    },
  ]);
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );