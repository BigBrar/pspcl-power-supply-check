import React from 'react'
import axios from 'axios';
import { useRef, useState } from 'react';

import District from '../components/District';
import Division from '../components/Division';
import SubDivision from '../components/SubDivision';

const Home = () => {
const [divisions, setDivisions] = useState([])
const [subdivisions, setSubDivisions] = useState([])
const [supplyStatus, setSupplyStatus] = useState([])
const [isLoading, setIsLoading] = useState(false)
const divisionRef = useRef(null)
const subdivisionRef = useRef(null)



  
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
  return (
    <div>
      <div className=''>
      <h1 className='text-2xl font-bold '>Punjab supply check ⚡⚡</h1>
      <p className='m-5 text-shadow-black text-amber-300'>Check if your division has a power cut </p>
    </div>


    <div>


    {/* SELECTING DISTRICT */}
    <District setDivisions={setDivisions} setSubDivisions={setSubDivisions} setSupplyStatus={setSupplyStatus} getData={getData}/>


    {/* SELECTING DIVISION */}
    <Division getData={getData} divisionRef={divisionRef} divisions={divisions}/>



    {/* SELECTING SUBDIVISION */}
    <SubDivision subdivisionRef={subdivisionRef} subdivisions={subdivisions} getData={getData} />


    {/* SUPPLY STATUS */}
    

    <div className='m-4 mt-10'>
  <h2 className='gap-4 text-2xl m-3 font-bold'>Supply status</h2>

  {!isLoading && supplyStatus?.type === 'ok' && (
    <p>✅ Electricity supply is working fine: {supplyStatus.reason}</p>
  )}

  {isLoading && <p>Loading...</p>}

  {supplyStatus?.type === 'cuts' && (
    <div>
      <p className='mb-2'>🚨 Power cuts reported in the following areas:</p>
      {supplyStatus.entries.map((entry, idx) => (
        <div key={idx} className='border p-1 max-w-6xl rounded-2xl bg-yellow-100 text-black'>
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

    </div>
  )
}


export default Home