import React from 'react'

const SubDivision = ({subdivisionRef, subdivisions, getData}) => {
  return (
    <>
    <div className='m-4 mt-10'>
      
      <h2 className='gap-4 text-2xl m-3 font-bold'> Select Subdivision</h2>
      <select className='bg-yellow-200 rounded-2xl p-1 text-black' ref={subdivisionRef} onChange={(e)=>getData('supply',e.target.value)} name="subdivision" id="subdivision">
        <option value="" disabled selected>Select your subdivision</option>
        {subdivisions && subdivisions.map((district, index) => (
          <option key={index} value={district.id}>{district.name}</option>
        ))}
      </select>

    </div>
    </>
  )
}

export default SubDivision
