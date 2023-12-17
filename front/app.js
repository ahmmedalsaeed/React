// last update
import React, {useState,useEffect} from 'react';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError
} from "react-router-dom";


function Dashboard() {
  const [zoneData, setZoneData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [dataData, setDataData] = useState([]);
  // GET /zones
  useEffect(() => {
      fetch('https://becoe558-6zz5dmf32a-uc.a.run.app/getzones')
        .then((res) => res.json())
        .then(res => {
          console.log('Response Zones:', res);
          if (res && Array.isArray(res.data)) {
            setZoneData(res.data);
          } else {
            throw new Error('Invalid response format');
          }
        })
        .catch(error => console.error('Error fetching data:', error));
  }, []);

  // GET /sensors
  useEffect(() => {
    fetch('https://becoe558-6zz5dmf32a-uc.a.run.app/getsensors')
      .then((res) => res.json())
      .then(res => {
        console.log('Response Sensors:', res);
        if (res && Array.isArray(res.data)) {
          setSensorData(res.data);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // GET /data
  useEffect(() => {
    fetch('https://becoe558-6zz5dmf32a-uc.a.run.app/getdata')
      .then((res) => res.json())
      .then(res => {
        console.log('Response Data:', res);
        if (res && Array.isArray(res.data)) {
          setDataData(res.data);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

    return (
            <div id="dashboard_page">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="well">
                            <h4>Zones</h4>
                            <p>{zoneData.length} Zones</p> 
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="well">
                            <h4>Sensors</h4>
                            <p>{sensorData.length} sensors</p> 
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="well">
                            <h4>Readings</h4>
                            <p>{dataData.length} sensors' readings</p> 
                        </div>
                    </div>
                </div>
                <div className="well">
                    <h4>Dashboard</h4>
                    <p>Some text..</p>
                </div>
            </div>
      );
}

function Data() {
    const [zoneData, setZoneData] = useState([]);
    useEffect(() => {
        fetch('https://becoe558-6zz5dmf32a-uc.a.run.app/getzones')
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
      
    // useEffect(() => {
    //   console.log('Current zoneData:', zoneData);
    // }, [zoneData]);

    const [zoneId, setZoneId] = useState('');
    const [zoneName, setZoneName] = useState('');
    const resetZoneState = () => {
      setZoneId(''); 
      setZoneName('');
    };

    const [sensorId, setSensorId] = useState('');
    const [sensorName, setSensorName] = useState('');
    const [sensorType, setSensorType] = useState('');
    const [sensorLocation, setSensorLocation] = useState('');
    const resetSensorState = () => {
      setSensorId(''); 
      setSensorName('');
      setSensorType('');
      setSensorLocation('');
    };

    const handleZoneSubmit = (event) => {
      event.preventDefault(); // Prevents the default form submission behavior
      const zoneData = {
        zoneId: zoneId,
        zoneName: zoneName,
      };

      fetch('https://becoe558-6zz5dmf32a-uc.a.run.app/zone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set the Content-Type header for JSON data
          },
          body: JSON.stringify(zoneData), // Convert zoneData to JSON format
        })
      .then(response => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Zone has been added",
            showConfirmButton: false,
            timer: 1500
          });
          resetZoneState();
        } else {
          
          throw new Error('Failed to post zone data');
        }
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonColor: "#1f629c",
        });
      });
    };
    
    const handleSensorSubmit = (event) => {
      event.preventDefault(); // Prevents the default form submission behavior
  
      const sensorData = {
        zoneId: sensorLocation, // Zone Id
        sensorId: sensorId,
        sensorName: sensorName,
        sensorType: sensorType,
      };

      fetch('https://becoe558-6zz5dmf32a-uc.a.run.app/sensor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sensorData),
        })
      .then(response => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Sensor has been added",
            showConfirmButton: false,
            timer: 1500
          });
          resetSensorState();
        } else {
          throw new Error('Failed to post sensor data');
        }
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonColor: "#1f629c",
        });
      });
    };
    return (
            <div id="datacontrol_page">
            <div className="row">
                <div className="col-sm-6">
                    <div className="well">
                        <h4>Add Zone</h4>
                        <form onSubmit={handleZoneSubmit}>
                            <input type="number" 
                                value={zoneId} 
                                onChange={e => setZoneId(e.target.value)} 
                                placeholder='Zone Id'
                                required/>
                            <input type="text" 
                                value={zoneName} 
                                onChange={e => setZoneName(e.target.value)} 
                                placeholder='Zone Name'
                                required/>
                            <input type="submit" value="Add Using REST API"/>
                        </form> 
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="well">
                        <h4>Add Sensor</h4>
                        <form onSubmit={handleSensorSubmit}>
                            <select value={sensorLocation} onChange={e => setSensorLocation(e.target.value)} required>
                            <option value="" disabled>Select the zone</option>
                            {
                              zoneData.map((item) => (
                                  <option value={item.zoneId}>{item.zoneName}</option>
                              ))
                            }
                            </select>
                            <input type="number" 
                                value={sensorId} 
                                onChange={e => setSensorId(e.target.value)} 
                                placeholder='Sensor Id'
                                required/>
                            <input type="text" 
                                value={sensorName} 
                                onChange={e => setSensorName(e.target.value)} 
                                placeholder='Sensor Name'
                                required/>
                            <input type="text" 
                                value={sensorType} 
                                onChange={e => setSensorType(e.target.value)} 
                                placeholder='Sensor Type'
                                required/>
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