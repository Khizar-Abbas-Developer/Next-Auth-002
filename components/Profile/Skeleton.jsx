import Image from 'next/image';
import React from 'react'
import { FaCircle } from "react-icons/fa";
import { BsImage } from "react-icons/bs";
const Skeleton = () => {
    return (
        <>
            <div className="flex h-screen items-center justify-center bg-white z-0 animate-pulse">
                <form
                >
                    <div className="gap-4 w-screen max-w-md rounded-xl p-6 my-12 bg-white shadow-2xl">
                        <div className="text-3xl md:2xl text-center font-bold mb-4 bg-[#E3E3E3] h-9 rounded-2xl mx-auto"></div>
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex">
                                <div className="w-28 h-28 overflow-hidden rounded-full flex justify-center items-center border-4 bg-[#cccccc] -mr-3">
                                    <div className="flex justify-center items-center gap-4 w-full mx-auto bg-[#cccccc]">
                                        <label htmlFor="fileInput" className="cursor-pointer" aria-label="profile">
                                            <BsImage className='text-5xl' />
                                            <input type="file" accept="image/*" style={{ display: "none" }} id="fileInput" aria-label="upload-profile" />
                                        </label>
                                    </div>
                                </div>
                                <div className="-ml-6">
                                    <FaCircle className="text-3xl cursor-pointer border p-1 bg-[#E3E3E3] rounded-full text-[#cccccc]" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="username" className="block text-sm font-medium h-5 bg-[#E3E3E3] w-36 rounded-2xl" aria-label="username">
                                {/* Username */}
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="mt-1 p-2 w-full bg-[#E3E3E3] rounded-2xl"
                                name="username"
                                autoComplete="off"
                                arial-label="input-username"
                            />
                            <input type="text" id="userId" name="userId" hidden />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-medium h-5 bg-[#E3E3E3] w-36 rounded-2xl" aria-label="username">
                                {/* Username */}
                            </label>
                            <input
                                type="text"
                                id="email"
                                className="mt-1 p-2 w-full bg-[#E3E3E3] rounded-2xl"
                                name="username"
                                autoComplete="off"
                                arial-label="input-username"
                            />                        </div>
                        <div className="mt-6">
                            <button className='bg-[#E3E3E3] w-full mt-4 h-[42px] rounded-2xl font-bold'>
                            </button>
                        </div>
                        <div className="flex justify-between font-semibold mt-4">
                            <div className='bg-[#E3E3E3] h-6 w-32 rounded-2xl'>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </>
    )
}
export default Skeleton;