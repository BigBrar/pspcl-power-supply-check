import React from 'react'

const Division = ({getData,divisionRef,divisions}) => {
  return (
    <>
    <div className='justify-center flex flex-col items-center'>
      
      <h2 className='gap-4 text-xl m-3 font-bold'> Select Division</h2>
      <select ref={divisionRef} onChange={(e)=>getData('subdiv',e.target.value)} name="division" id="division">
        <option value="" disabled selected>Select your division</option>
        {divisions && divisions.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>
    </>
  )
}

export default Division
