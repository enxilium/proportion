'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import personImage from '../../../public/assets/person.svg'
import logo from '../../../public/assets/logo.svg'
import { useRouter } from 'next/navigation'

export const Navbar:React.FC = () => {
    const router = useRouter();
    return (
        <div className="navbar h-24 bg-white bg-opacity-50 flex flex-row items-center justify-between w-full">
            <Link href="/home"><Image className="ml-3" src={logo} alt="logo" width={280} height={80}/></Link>
            <div className="flex flex-row items-center gap-2 mr-3">
                <button className="btn btn-ghost text-white text-lg font-medium">
                    <Link href="/about">About</Link>
                </button>
                <button className="btn btn-ghost text-white text-lg font-medium">
                    <Link href="/home">Home</Link>
                </button>
                <button className="btn btn-ghost text-white text-lg font-medium">
                    <Link href="/analytics">Analytics</Link>
                </button>
                <button className="btn btn-ghost btn-sm h-[44px] w-[44px] btn-circle flex items-center justify-center mb-1"
                    onClick={() => router.push('/auth/logout')}
                >
                    <Image src={personImage} alt="logoutImg" width={36} height={36}/>
                </button>
            </div>

        </div>
    );
}

export default Navbar;