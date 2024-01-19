import React from 'react'
import { MoonLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className='flex justify-center items-center h-screen w-screen'>
        <MoonLoader />
    </div>
  )
}

export default Loader;