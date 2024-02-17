"use client";
import React, { useRef, useState } from 'react';
import Loader from '../Loader/Loader';
import { SubmitButton } from '../SubmitButton/SubmitButton';
const OtpForm = ({ userEmail, userId }) => {
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [loading, setLoading] = useState(false);
    const handleKeyDown = async (currentIndex, event) => {
        const isDigitKey = /^\d$/.test(event.key);
        if (isDigitKey) {
            event.preventDefault();
            const nextIndex = currentIndex < inputRefs.length - 1 ? currentIndex + 1 : currentIndex;
            inputRefs[currentIndex].current.value = event.key; // Set the value manually
            inputRefs[nextIndex].current.focus();
        }
    };
    if (loading) {
        return (
            <Loader />
        )
    }
    return (
        <>
            <div className='flex min-h-[70vh] justify-center items-center'>
                <div className='gap-8 w-full max-w-sm rounded-xl shadow-lg p-6 space-y-3'>
                    <div className='flex justify-center items-center'>
                        <h2 className='text-2xl font-bold'>Verify your Email</h2>
                    </div>
                    <div className='flex justify-center items-center text-lg text-center'>
                        We have sent code to your email
                    </div>
                    <div className='flex justify-center items-center text-xl font-bold'>{userEmail}</div>
                    <div className='flex justify-center items-center w-full'>
                        <input hidden name='id' defaultValue={userId} />
                        <input type="text" placeholder='o' maxLength="1" name='digit1' className="w-12 h-12 text-2xl mx-2 p-2 text-center border" onKeyDown={(event) => handleKeyDown(0, event)} ref={inputRefs[0]} aria-label='number-1' style={{ appearance: 'none' }} />
                        <input type="text" placeholder='o' maxLength="1" name='digit2' className="w-12 h-12 text-2xl mx-2 p-2 text-center border" onKeyDown={(event) => handleKeyDown(1, event)} ref={inputRefs[1]} aria-label='number-2' style={{ appearance: 'none' }} />
                        <input type="text" placeholder='o' maxLength="1" name='digit3' className="w-12 h-12 text-2xl mx-2 p-2 text-center border" onKeyDown={(event) => handleKeyDown(2, event)} ref={inputRefs[2]} aria-label='number-3' style={{ appearance: 'none' }} />
                        <input type="text" placeholder='o' maxLength="1" name='digit4' className="w-12 h-12 text-2xl mx-2 p-2 text-center border" onKeyDown={(event) => handleKeyDown(3, event)} ref={inputRefs[3]} aria-label='number-4' style={{ appearance: 'none' }} />
                    </div>
                    <SubmitButton name={"Verify"} />
                </div>
            </div>
        </>
    )
}
export default OtpForm;