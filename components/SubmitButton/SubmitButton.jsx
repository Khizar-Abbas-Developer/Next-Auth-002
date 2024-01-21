"use client";
import { useFormStatus } from "react-dom";
import { ScaleLoader } from "react-spinners";

const SignUpButton = ({ name }) => {
    const { pending } = useFormStatus();
    return (
        <button className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4">
            {pending ? (
                <>
                    <ScaleLoader color="#FFFF00" height={20} width={4} />
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
