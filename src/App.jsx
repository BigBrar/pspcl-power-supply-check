import { useRef, useState } from 'react';
import axios from 'axios';


import './App.css';

function App() {

  const districts = [
    {id: 0,name:'Sri Muktsar Sahib'}, 
    {id: 1,name:'Amritsar'},
    {id: 2,name:'Barnala'},
    {id: 3,name:'Kapurthala'},
    {id: 4,name:'Ludhiana'},
    {id: 5,name:'Malerkotla'},
    {id: 6,name:'Mansa'},
    {id: 7,name:'Moga'},
    {id: 8,name:'Mohali'},
    {id: 9,name:'Pathankot'},
    {id: 10,name:'Patiala'},
    {id: 11,name:'Rupnagar'},
    {id: 12,name:'Sangrur'},
    {id: 13,name:'Bathinda'},
    {id: 14,name:'SBS Nagar'},
    {id: 15,name:'Tarn Taran Sahib'},
    {id: 16,name:'Faridkot'},
    {id: 17,name:'Fatehgarh Sahib'},
    {id: 18,name:'Fazilka'},
    {id: 19,name:'Ferozpur'},
    {id: 20,name:'Gurdaspur'},
    {id: 21,name:'Hoshiarpur'},
    {id:22, name:'Jalandhar'}
  ]

const divisions = 
  {0:[
    {id: 0, name:'DS DIVN. Malout'}, 
    {id: 1, name:'DS DIVN. Faridkot'}, 
    {id: 2, name:'DS DIVN. Abohar'}, 
    {id: 3, name:'DS DIVN. Badal'}, 
    {id: 4, name:'DS DIVN. Giddarbaha'}, 
    {id: 5, name:'DS DIVN. Kotkapura'}, 
    {id: 6, name:'DS DIVN. Muktsar'}, 
    {id: 7, name:'DS DIVN. Bathinda'}
  ]}

const subDivisions = {
  0:[

  ]
}

const [selectedDivision, setSelectedDivision] = useState(null)

  
  const manageDivisions = (districtId)=>{
    
    // setSelectedDivision(divisions[districtId])
    setSelectedDivision(districtId)
    console.log(divisions[districtId])
  }



  return (
    <>
    <div className=' justify-center gap-10'>
      <h1 className='text-2xl font-bold '>Punjab supply check ⚡⚡</h1>
      <p className='m-5 text-shadow-black'>Check if your division has a power cut </p>
    </div>


    <div>

    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Select District</h2>
      <select onChange={(e)=>manageDivisions(e.target.value)} name="district" id="district">
        <option value="" disabled selected>Select your district</option>
        {districts.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>

    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Select District</h2>
      <select onChange={(e)=>manageDivisions(e.target.value)} name="district" id="district">
        <option value="" disabled selected>Select your district</option>
        {selectedDivision && divisions[selectedDivision].map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>


    

    </div>


    </>
  )
}

export default App
