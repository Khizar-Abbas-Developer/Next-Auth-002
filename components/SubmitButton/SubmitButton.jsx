
"use client";
import {useFormStatus} from "react-dom";

const SignUpButton = ({name}) => {
    const { pending } = useFormStatus();
    return (
        <button className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4">
            {pending ? "please wait..." : `${name}`}
        </button>
    );
};
export default SignUpButton;