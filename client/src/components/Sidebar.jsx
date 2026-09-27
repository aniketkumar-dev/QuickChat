

// import React, { useContext } from 'react'
// import assets, { userDummyData } from '../assets/assets'
// import { useNavigate } from 'react-router-dom'
// import { AuthContext } from '../context/AuthContext'

// const Sidebar = ({ selectedUser, setSelectedUser }) => {

//     const navigate = useNavigate()
//     const { logout } = useContext(AuthContext)

//     return (
//         <div
//             className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
//                 selectedUser ? "max-md:hidden" : ''
//             }`}
//         >

//             <div className='pb-5'>

//                 <div className='flex justify-between items-center'>

//                     <img
//                         src={assets.logo}
//                         alt="logo"
//                         className='max-w-40'
//                     />

//                     <div className='relative py-2 group'>

//                         <img
//                             src={assets.menu_icon}
//                             alt="Menu"
//                             className='max-h-5 cursor-pointer'
//                         />

//                         <div className='absolute right-0 top-full z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>

//                             <p
//                                 onClick={() => navigate('/profile')}
//                                 className='cursor-pointer text-sm'
//                             >
//                                 Edit Profile
//                             </p>

//                             <hr className='my-2 border-t border-gray-500' />

//                             <p
//                                 onClick={logout}
//                                 className='cursor-pointer text-sm'
//                             >
//                                 Logout
//                             </p>

//                         </div>
//                     </div>
//                 </div>

//                 <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>

//                     <img
//                         src={assets.search_icon}
//                         alt="Search"
//                         className='w-3'
//                     />

//                     <input
//                         type='text'
//                         className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
//                         placeholder='SearchUser...'
//                     />

//                 </div>
//             </div>

//             <div className='flex flex-col'>

//                 {userDummyData.map((user, index) => (

//                     <div
//                         onClick={() => {
//                             setSelectedUser(user)
//                         }}
//                         key={index}
//                         className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
//                             selectedUser?._id === user._id
//                                 ? 'bg-[#282142]/50'
//                                 : ''
//                         }`}
//                     >

//                         <img
//                             src={user?.profilePic || assets.avatar_icon}
//                             alt=""
//                             className='w-[35px] aspect-[1/1] rounded-full'
//                         />

//                         <div className='flex flex-col leading-5'>

//                             <p>{user.fullName}</p>

//                             {index < 3 ? (
//                                 <span className='text-green-400 text-xs'>
//                                     Online
//                                 </span>
//                             ) : (
//                                 <span className='text-neutral-400 text-xs'>
//                                     Offline
//                                 </span>
//                             )}

//                         </div>

//                         {index > 2 && (
//                             <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
//                                 {index}
//                             </p>
//                         )}

//                     </div>

//                 ))}

//             </div>

//         </div>
//     )
// }

// export default Sidebar

import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Sidebar = ({ selectedUser, setSelectedUser }) => {

    const navigate = useNavigate()

    const { logout, onlineUsers, authUser } = useContext(AuthContext)

    const {
        users,
        getUsers,
        unseenMessages
    } = useContext(ChatContext)

    const [search, setSearch] = useState('')

//     useEffect(() => {
//     if (authUser) {
//         getUsers()
//     }
// }, [authUser])

useEffect(() => {
    console.log("authUser:", authUser)

    if (authUser) {
        getUsers()
    }
}, [authUser])

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div
            className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
                selectedUser ? 'max-md:hidden' : ''
            }`}
        >

            <div className='pb-5'>

                <div className='flex justify-between items-center'>

                    <img
                        src={assets.logo}
                        alt='logo'
                        className='max-w-40'
                    />

                    <div className='relative py-2 group'>

                        <img
                            src={assets.menu_icon}
                            alt='Menu'
                            className='max-h-5 cursor-pointer'
                        />

                        <div className='absolute right-0 top-full z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>

                            <p
                                onClick={() => navigate('/profile')}
                                className='cursor-pointer text-sm'
                            >
                                Edit Profile
                            </p>

                            <hr className='my-2 border-t border-gray-500' />

                            <p
                                onClick={logout}
                                className='cursor-pointer text-sm'
                            >
                                Logout
                            </p>

                        </div>

                    </div>

                </div>

                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>

                    <img
                        src={assets.search_icon}
                        alt='Search'
                        className='w-3'
                    />

                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
                        placeholder='SearchUser...'
                    />

                </div>

            </div>

            <div className='flex flex-col'>

                {filteredUsers.map((user) => (

                    <div
                        onClick={() => setSelectedUser(user)}
                        key={user._id}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                            selectedUser?._id === user._id
                                ? 'bg-[#282142]/50'
                                : ''
                        }`}
                    >

                        <img
                            src={user.profilePic || assets.avatar_icon}
                            alt=''
                            className='w-[35px] aspect-[1/1] rounded-full'
                        />

                        <div className='flex flex-col leading-5'>

                            <p>{user.fullName}</p>

                            {onlineUsers.includes(user._id) ? (
                                <span className='text-green-400 text-xs'>
                                    Online
                                </span>
                            ) : (
                                <span className='text-neutral-400 text-xs'>
                                    Offline
                                </span>
                            )}

                        </div>

                        {unseenMessages[user._id] > 0 && (
                            <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                                {unseenMessages[user._id]}
                            </p>
                        )}

                    </div>

                ))}

            </div>

        </div>
    )
}

export default Sidebar