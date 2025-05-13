import { useEffect, useRef, useState } from 'react';
import axios from 'axios';


import './App.css';

function App() {

const [districts, setDistricts] = useState([])
const [divisions, setDivisions] = useState([])
const [subdivisions, setSubDivisions] = useState([])
const [supplyStatus, setSupplyStatus] = useState([])
const [isLoading, setIsLoading] = useState(false)
const divisionRef = useRef(null)
const subdivisionRef = useRef(null)

const fetchDistricts = async()=>{
  axios.get('http://127.0.0.1:5000/').then(response =>{
    console.log(response.data);
    setDistricts(response.data)
    setDivisions(null)
    setSubDivisions(null)
    setSupplyStatus(null)
  })
  .catch(error=>{
    console.error('Error fetching districts:', error);
    
  })
}

  
  const getData = (mode, districtId)=>{
    console.log('sending /divisions request');
    let url;
    if (mode == 'div'){
      url = 'http://127.0.0.1:5000/divisions'
      divisionRef.current.value = ''
      setSubDivisions(null)
      setSupplyStatus(null)
    }else if (mode == 'subdiv'){
      url = 'http://127.0.0.1:5000/subdivisions'
      subdivisionRef.current.value = ''
      // setDivisions(null)
      setSubDivisions(null)
    }else if (mode == 'supply'){
      setIsLoading(true)
      url = 'http://127.0.1:5000/check_supply'
    }
    
    // setSelectedDivision(divisions[districtId])
    axios.get(url,{
      params:{
            id:districtId
      }
    }).then(response =>{
    console.log(response.data);
    if (mode == 'div'){
    setDivisions(response.data)}
    else if (mode == 'subdiv'){
      setSubDivisions(response.data)
    }else if (mode == 'supply'){
      setIsLoading(false)
      const data = JSON.parse(response.data);
      // console.log(typeof(parsed))
      // console.log('supply status:', parsed[0]);
      // setSupplyStatus(parsed[0])
      // Case 1: Supply is OK (looks like { '0': { status: 'ok', reason: 'All seems OK' } })
    if (data["0"]?.status === "ok") {
      setSupplyStatus({ type: "ok", reason: data["0"].reason });
    } 
    // Case 2: Power cuts reported (more detailed keys like "0", "1", etc.)
    else {
      const entries = Object.values(data); // array of each supply cut info
      setSupplyStatus({ type: "cuts", entries });
    }
        
    }
    // console.log('type of data received:', response.data['response']);
    
  })
  .catch(error=>{
    console.error('Error fetching districts:', error);
    
  })
  }

useEffect(()=>{
  fetchDistricts()
}
,[])

  return (
    <>
    <div className=' justify-center gap-10'>
      <h1 className='text-2xl font-bold '>Punjab supply check ⚡⚡</h1>
      <p className='m-5 text-shadow-black'>Check if your division has a power cut </p>
    </div>


    <div>


    {/* SELECTING DISTRICT */}
    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Select District</h2>
      <select onChange={(e)=>getData('div',e.target.value)} name="district" id="district">
        <option value="" disabled selected>Select your district</option>
        {districts && districts.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>


    {/* SELECTING DIVISION */}
    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Select Division</h2>
      <select ref={divisionRef} onChange={(e)=>getData('subdiv',e.target.value)} name="division" id="division">
        <option value="" disabled selected>Select your division</option>
        {divisions && divisions.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>



    {/* SELECTING SUBDIVISION */}
    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Select Subdivision</h2>
      <select ref={subdivisionRef} onChange={(e)=>getData('supply',e.target.value)} name="subdivision" id="subdivision">
        <option value="" disabled selected>Select your subdivision</option>
        {subdivisions && subdivisions.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>


    {/* SUPPLY STATUS */}
    
    {/* <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Supply status</h2>
      
      {supplyStatus && supplyStatus.status && (
        <p>Everything is working fine, supply is there.</p>
      )}

    </div> */}

    <div className='justify-center flex flex-col items-center'>
  <h2 className='gap-4 text-xl m-3 font-bold'>Supply status</h2>

  {!isLoading && supplyStatus?.type === 'ok' && (
    <p>✅ Electricity supply is working fine: {supplyStatus.reason}</p>
  )}

  {isLoading && <p>Loading...</p>}

  {supplyStatus?.type === 'cuts' && (
    <div>
      <p className='mb-2'>🚨 Power cuts reported in the following areas:</p>
      {supplyStatus.entries.map((entry, idx) => (
        <div key={idx} className='border p-3 m-2 rounded bg-yellow-100'>
          <p><strong>Subdivision:</strong> {entry.subdivision}</p>
          <p><strong>Feeder:</strong> {entry.feeder}</p>
          <p><strong>Start:</strong> {entry.starttime_Display}</p>
          <p><strong>End:</strong> {entry.endtime_Display}</p>
          <p><strong>Areas affected:</strong> {entry.areasaffected}</p>
          <p><strong>JE(s):</strong> {entry.je}</p>
        </div>
      ))}
    </div>
  )}
</div>

    </div>


    </>
  )
}

export default App
