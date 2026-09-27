import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const RightSidebar = () => {

    const { selectedUser, messages } = useContext(ChatContext)
    const { logout, onlineUsers } = useContext(AuthContext)

    const [msgImages, setMsgImages] = useState([])

    useEffect(() => {
        const images = messages
            .filter(msg => msg.image)
            .map(msg => msg.image)

        setMsgImages(images)
    }, [messages])

    return selectedUser && (

        <div className='bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden'>

            {/* User Info */}
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light'>

                <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    className='w-20 h-20 rounded-full'
                    alt=''
                />

                <div className='flex items-center gap-2 text-xl font-medium'>

                    {onlineUsers.includes(selectedUser._id) && (
                        <span className='w-2 h-2 rounded-full bg-green-500'></span>
                    )}

                    <p>{selectedUser.fullName}</p>

                </div>

                <p className='px-10 text-center'>
                    {selectedUser.bio}
                </p>

            </div>

            <hr className='border-[#ffffff50] my-4' />

            {/* Media */}
            <div className='px-5 text-xs'>

                <p>Media</p>

                <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4'>

                    {msgImages.map((url, index) => (

                        <div
                            key={index}
                            onClick={() => window.open(url)}
                            className='cursor-pointer'
                        >

                            <img
                                src={url}
                                className='w-full rounded-md'
                                alt=''
                            />

                        </div>

                    ))}

                </div>

            </div>

            {/* Logout */}
            <button
                onClick={logout}
                className='absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 py-2 px-20 rounded-full text-sm cursor-pointer'
            >
                Logout
            </button>

        </div>
    )
}

export default RightSidebar