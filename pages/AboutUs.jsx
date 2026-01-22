import React from 'react'
import devsImage from "../assets/new_image.png"; 

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side - Image with labels */}
        <div className="relative flex justify-center">
          {/* Blue background shape */}
          <div className="absolute inset-0 bg-sky-300 rounded-3xl transform -rotate-3 scale-95"></div>
          
          {/* Developer image container */}
          <div className="relative bg-sky-300 rounded-3xl p-8 max-w-md">
            <img 
              // src={devsImage} 
              src="https://i.ibb.co/SwpJ7s6x/Untitled-design-12.png" 
              alt="Developers" 
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>

          {/* Labels */}
          <div className="absolute -top-8 -left-4">
            <div className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm">
              <div className="font-semibold">Lovepreet Singh</div>
              <div className="text-yellow-400 text-xs">Frontend Dev.</div>
            </div>
            {/* Arrow pointing to left person */}
            <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-700 transform rotate-45"></div>
          </div>

          <div className="absolute -top-8 -right-4">
            <div className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm">
              <div className="font-semibold">Deepinder Singh</div>
              <div className="text-yellow-400 text-xs">Backend Dev.</div>
            </div>
            {/* Arrow pointing to right person */}
            <div className="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-700 transform -rotate-45"></div>
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold">
            MADE BY
          </h1>
          
          <div className="text-3xl lg:text-4xl font-semibold">
            Two <em className="text-yellow-400">IDIOTS</em> ⚡
          </div>
          
          <p className="text-gray-300 text-lg lg:text-xl leading-relaxed max-w-md">
            Our goal for this project was to ensure its usefulness
            —not just for ourselves, but for everyone.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs