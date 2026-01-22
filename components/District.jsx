import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function District({ customStyles, districts, setDistricts, getData, selectedDistrict, setSelectedDistrict }) {

  // const [districts, setDistricts] = useState([])

  const districtOptions = districts
    ? districts.map(d => ({ value: d.id, label: d.name }))
    : [];

  const fetchDistricts = async () => {
    axios.get('https://backend-pspcl-power-supply-check.onrender.com/').then(response => {
      console.log(response.data);
      setDistricts(response.data)
    })
      .catch(error => {
        console.error('Error fetching districts:', error);

      })
  }

  useEffect(() => {
    if (districts.length === 0) {
      console.log('called');

      fetchDistricts()
    }
  }
    , [])


  return (
    <>
      {/* SELECTING DISTRICT */}
      <div className='m-4 mt-10 w-full max-w-md mx-auto'>

        <h2 className='gap-4 text-2xl m-3 font-bold text-center'> Select District</h2>
        <Select className='bg-yellow-200 rounded-2xl p-1 text-black' onChange={(option) => {
          setSelectedDistrict(option);
          getData('div', option.value);
        }} id="district" options={districtOptions} placeholder="Select your district" isClearable value={selectedDistrict} styles={customStyles} />

      </div>

    </>
  )

}

export default District;