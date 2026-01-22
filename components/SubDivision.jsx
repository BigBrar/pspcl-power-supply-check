import { useState } from 'react'
import Select from 'react-select';

const SubDivision = ({ customStyles, subdivisions, getData, selectedSubDivision, setSubDivision, subDivisionPlaceholder }) => {
  return (
    <>
      <div className='m-4 mt-10 w-full max-w-md mx-auto'>

        <h2 className='gap-4 text-2xl m-3 font-bold text-center'> Select Subdivision</h2>
        <Select className='bg-yellow-200 rounded-2xl p-1 text-black' onChange={(option) => {
          setSubDivision(option);
          getData('supply', option.value);
        }} id="subdivision" options={subdivisions} placeholder={subDivisionPlaceholder} isClearable value={selectedSubDivision} styles={customStyles} />

      </div>
    </>
  )
}

export default SubDivision
