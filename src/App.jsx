import { useEffect, useRef, useState } from 'react';
import axios from 'axios';


import './App.css';

function App() {

const [districts, setDistricts] = useState([])
const [divisions, setDivisions] = useState([])
const [subdivisions, setSubDivisions] = useState([])
const [supplyStatus, setSupplyStatus] = useState([])

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
      setSubDivisions(null)
      setSupplyStatus(null)
    }else if (mode == 'subdiv'){
      url = 'http://127.0.0.1:5000/subdivisions'
      // setDivisions(null)
      setSubDivisions(null)
    }else if (mode == 'supply'){
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
      const parsed = JSON.parse(response.data);
      console.log(typeof(parsed))
      console.log('supply status:', parsed[0]);
      setSupplyStatus(parsed[0])
        
        
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
      <select onChange={(e)=>getData('subdiv',e.target.value)} name="division" id="division">
        <option value="" disabled selected>Select your division</option>
        {divisions && divisions.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>



    {/* SELECTING SUBDIVISION */}
    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Select Subdivision</h2>
      <select onChange={(e)=>getData('supply',e.target.value)} name="subdivision" id="subdivision">
        <option value="" disabled selected>Select your subdivision</option>
        {subdivisions && subdivisions.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>


    {/* SUPPLY STATUS */}
    
    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Supply status</h2>
      
      {supplyStatus && supplyStatus.status && (
        <p>Everything is working fine, supply is there.</p>
      )}

    </div>

    </div>


    </>
  )
}

export default App
