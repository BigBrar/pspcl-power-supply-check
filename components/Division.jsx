import React from 'react'

const Division = ({getData,divisionRef,divisions}) => {
  return (
    <>
    <div className='m-4 mt-10'>
      
      <h2 className='gap-4 text-2xl m-3 font-bold'> Select Division</h2>
      <select className='bg-yellow-200 rounded-2xl p-1 text-black' ref={divisionRef} onChange={(e)=>getData('subdiv',e.target.value)} name="division" id="division">
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
