'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import personImage from '../../../public/assets/person.svg'
import logo from '../../../public/assets/logo.svg'
import { useRouter } from 'next/navigation'

export const Navbar:React.FC = () => {
    const router = useRouter();
    return (
        <div className="navbar h-14 hover:bg-white/30 hover:backdrop-blur-sm flex flex-row items-center justify-between w-full z-30">
            <Link href="/home">
                <Image 
                    className="ml-3 scale-40 transition-transform duration-300 hover:scale-105" 
                    src={logo} 
                    alt="logo" 
                    width={200} 
                    height={57}
                />
            </Link>
            <div className="flex flex-row items-center mr-3 h-full">

                <div className='hover:bg-black/30 h-full px-4'>
                    <button className="btn btn-ghost text-white text-lg font-medium h-full">
                        <Link href="/about">About</Link>
                    </button>
                </div>
                
                <div className='hover:bg-black/30 h-full px-4'>
                    <button className="btn btn-ghost text-white text-lg font-medium h-full">
                        <Link href="/home">Home</Link>
                    </button>
                </div>

                <div className='hover:bg-black/30 h-full px-4 flex items-center justify-center'>
                    <button className="btn btn-ghost btn-sm h-[44px] w-[44px] btn-circle flex items-center justify-center mb-1"
                        onClick={() => router.push('/auth/logout')}
                    >
                        <Image src={personImage} alt="logoutImg" width={36} height={36}/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;