
import React from 'react'
import devsImage from "../assets/erasebg-transformed.png"; 

const AboutUs = () => {
  return (
    <div className="bg-[#3c3c3c] text-white min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="flex flex-col lg:flex-row items-center gap-10 max-w-5xl w-full">
        {/* Left Side: Image and Names */}
        <div className="relative bg-[#75e6ff] p-1 rounded-2xl">     
          <img
            src={devsImage}
            alt="Devs"
            className="w-[280px] sm:w-[350px] lg:w-[400px] object-contain"
          />
          <div className="absolute top-2 left-[-40px] text-sm text-white">
            <div className="text-white">
              <span className="font-bold text-yellow-300">Lovepreet Singh</span><br />
              <span className="text-sm font-semibold text-yellow-400">Frontend Dev.</span>
            </div>
          </div>
          <div className="absolute top-[20px] right-[-40px] text-sm text-white">
            <div className="text-white">
              <span className="font-bold text-yellow-300">Deepinder Singh</span><br />
              <span className="text-sm font-semibold text-yellow-400">Backend Dev.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Text */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold">MADE BY</h1>
          <h2 className="text-2xl mt-2 font-medium italic">
            Two <span className="not-italic font-bold">IDIOTS ⚡</span>
          </h2>
          <p className="text-lg mt-6 max-w-md">
            Our goal for this project was to ensure its usefulness—
            not just for ourselves, but for everyone.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
