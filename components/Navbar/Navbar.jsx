"use client"
import Link from "next/link";
import Image from 'next/image'
import { UserSignOut } from "../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { usePathname } from "next/navigation";
import defaultImg from "@/public/assest/125.gif";
import { Icon } from "@chakra-ui/react";
import { HiOutlineUserCircle } from "react-icons/hi";




const Navbar = () => {
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Menu", href: "/menu" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ]
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [authorized, setAuthorized] = useState(false);
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        {
            currentUser?.image !== undefined && currentUser?.image !== "" ? (
                setAuthorized(true)
            ) : (
                setAuthorized(false)
            )
        }
        {
            currentUser?.email === process.env.NEXT_PUBLIC_REACT_APP_ADMIN_EMAIL ? (
                setAdmin(true)
            ) : (
                setAdmin(false)
            )
        }
    }, [])
    const handleLogOut = () => {
        dispatch(UserSignOut(currentUser))
        window.location.href = "/login"
    }
    const pathname = usePathname();

    return (
        <div className="navbar bg-base-200 drop-shadow-md w-full fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between w-full -ml-4 -mr-2 mx-4 md:mx-4">
                {/* first div of logo starting */}
                <div className="">
                    <Link href={"/"} className="btn btn-ghost text-lg md:text-xl">
                        <Image src={"/vercel.png"} width={40} height={40} alt="logo" />
                    </Link>
                </div>
                {/* first div of logo starting */}
                {/* second div of links starting */}

                <div className="flex items-center text-sm md:text-xl justify-between gap-4">
                    {
                        navLinks.map((link) => {
                            return (
                                <Link href={link.href} key={link.name} className={pathname === link.href ? "text-red-500 underline font-semibold" : ""}>{link.name}</Link>
                            )
                        })
                    }
                </div>
                {/* second div of links ending */}

                {/* third div of profile starting */}
                <div className="dropdown dropdown-end -mr-4 -md-mr-2">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            {authorized ? (
                        <div className="w-10 rounded-full border-2 border-red-600">
                                <Image src={currentUser?.image} width={24} height={24} className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover" alt="" />
                                </div>

                            ) : (
                                <div className="flex justify-center items-center">
                                <Icon as={HiOutlineUserCircle} className="text-[40px]" />
                                </div>
                            )
                            }
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">

                        {
                            admin ? (
                                <>
                                    <li className="cursor-pointer">
                                        <Link href={"/product"} className="justify-between">
                                            Settings
                                            <span className="badge">New</span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                null
                            )
                        }
                        {
                            authorized ? (
                                <>
                                    <li className="cursor-pointer">
                                        <Link href={"/edit-profile"} className="justify-between">
                                            Profile
                                            <span className="badge">New</span>
                                        </Link>
                                    </li>
                                    <li onClick={handleLogOut} className="cursor-pointer"><a href="/login">Logout</a></li>
                                </>
                            ) : (
                                <li><Link href={"/login"} className="cursor-pointer">Login</Link></li>
                            )
                        }
                    </ul>
                </div>
                {/* third div of profile ending */}
            </div>
        </div>
    );
};

export default Navbar;
