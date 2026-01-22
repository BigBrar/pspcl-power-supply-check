import { useState, useEffect } from 'react'
import Select from 'react-select';

const Division = ({ getData, customStyles, divisions, selectedDivision, setSelectedDivision, divisionPlaceholder }) => {
  //   useEffect(() => {
  //   setSelectedDivision(null);
  // }, [divisions]);
  return (
    <>
      <div className='m-4 mt-10 w-full max-w-md mx-auto'>

        <h2 className='gap-4 text-2xl m-3 font-bold text-center'> Select Division</h2>
        <Select className='bg-yellow-200 rounded-2xl p-1 text-black' onChange={(option) => {
          setSelectedDivision(option);
          getData('subdiv', option.value);
        }} id="division" options={divisions} placeholder={divisionPlaceholder} isClearable value={selectedDivision} styles={customStyles} />

      </div>
    </>
  )
}

export default Division
