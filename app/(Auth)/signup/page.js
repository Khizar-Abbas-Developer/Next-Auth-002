import Image from 'next/image';
import loginSignUpImage from "@/public/1.gif";
import Link from 'next/link';
import { redirect } from 'next/navigation'
import { MoonLoader } from 'react-spinners';
import SignUpButton from "@/components/SubmitButton/SubmitButton";
import Form from '@/components/Signup/Comp-1';
import { createUser } from './_action';
import { revalidatePath } from 'next/cache';
import SigninButton from '@/components/SigninButton/SigninButton';
let msg = "";

const resetMsg = () => {
  msg = "";
};
const SignupForm = () => {
  const handleSubmit = async (formData) => {
    "use server"
    const { status, id, message } = await createUser({
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmpassword: formData.get("confirmpassword")
    });
    if (status === 201) {
      redirect(`/email-verification/${id}`)
    } else {
      msg = message;
      revalidatePath("/signup")
    }
  };
  return (
    <>
      <div className="p-3 bg-slate-100 min-h-[calc(100vh)]">
        <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 mt-24 shadow-md rounded-md">
        <div className="bg-red-400 w-full h-full text-center font-bold">{msg ? msg : ""}</div>
          <form
            className="w-full py-3 flex flex-col"
            action={handleSubmit}
          >
            <h3 className="text-center text-3xl md:text-4xl font-bold">Sign-up</h3>
            <label htmlFor="username">Username</label>
            <input
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
              type={"text"}
              id="username"
              name="username"
              autoComplete="off"
            />

            <label htmlFor="email">Email</label>
            <input
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
              type={"email"}
              id="email"
              name="email"
              autoComplete="on"
            />

            <Form message={msg} />
            <SignUpButton name={"Submit"} />
          </form>
          <p className="text-left w-full text-sm mt-2">
            Already have Account ?{" "}
            <Link href={"/login"} className="text-red-500 underline">
              Login
            </Link>
          </p>
          <div className="mt-2">
            <SigninButton />
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupForm;