import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function District({setDivisions, setSubDivisions, setSupplyStatus, getData}) {

    const [districts, setDistricts] = useState([])
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

    useEffect(()=>{
  fetchDistricts()
}
,[])

return(
    <>
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
    
    </>
)

}

export default District;