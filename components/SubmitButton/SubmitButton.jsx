"use client";
import { useFormStatus } from "react-dom";
import { ScaleLoader } from "react-spinners";

const SignUpButton = ({ name }) => {
    const { pending } = useFormStatus();
    return (
        <button className="w-[30%] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center rounded-md mt-8">
            {pending ? (
                <>
                    <div className="mt-1">
                        <ScaleLoader color="#FFFF00" height={20} width={4} />
                    </div>
                </>
            ) : (
                <>
                    {name}
                </>
            )}
        </button>
    );
};
export default SignUpButton;
export const SubmitButton = ({name})=>{
    const { pending } = useFormStatus();

    return(
        <button className='bg-red-400 hover:bg-red-500 text-white w-full mt-4 h-[42px] rounded-md font-bold'>
                        {pending ? (
                <>
                    <div className="mt-1">
                        <ScaleLoader color="#FFFF00" height={20} width={4} />
                    </div>
                </>
            ) : (
                <>
                    {name}
                </>
            )}
        </button>
    )
}
