import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'

const ProfilePage = () => {

    const { authUser, updateProfile } = useContext(AuthContext)

    const navigate = useNavigate()

    const [selectedImg, setSelectedImg] = useState(null)
    const [name, setName] = useState(authUser?.fullName || '')
    const [bio, setBio] = useState(authUser?.bio || '')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedImg) {

            const success = await updateProfile({
                fullName: name,
                bio: bio
            })

            if (success) {
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            }

            return
        }

        const reader = new FileReader()

        reader.onload = async () => {

            const success = await updateProfile({
                profilePic: reader.result,
                fullName: name,
                bio: bio
            })

            if (success) {
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            }
        }

        reader.readAsDataURL(selectedImg)
    }

    return (
        <div className='min-h-screen flex items-center justify-center'>

            <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>

                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-5 p-10 flex-1'
                >

                    <h3 className='text-lg'>
                        Profile details
                    </h3>

                    <label
                        htmlFor='avatar'
                        className='flex items-center gap-3 cursor-pointer'
                    >

                        <input
                            type='file'
                            id='avatar'
                            accept='.png,.jpg,.jpeg'
                            hidden
                            onChange={(e) => setSelectedImg(e.target.files[0])}
                        />

                        <img
                            src={
                                selectedImg
                                    ? URL.createObjectURL(selectedImg)
                                    : authUser?.profilePic || assets.avatar_icon
                            }
                            className='w-12 h-12 rounded-full'
                            alt=''
                        />

                        <span>
                            Upload profile image
                        </span>

                    </label>

                    <input
                        type='text'
                        placeholder='Your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='p-2 border border-gray-500 rounded-md outline-none focus:ring-2 focus:ring-violet-500'
                        required
                    />

                    <textarea
                        rows={4}
                        placeholder='Write profile bio'
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className='p-2 border border-gray-500 rounded-md outline-none focus:ring-2 focus:ring-violet-500'
                        required
                    />

                    <button
                        type='submit'
                        className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
                    >
                        Save
                    </button>

                </form>

                <img
                    src={
                        selectedImg
                            ? URL.createObjectURL(selectedImg)
                            : authUser?.profilePic || assets.logo_icon
                    }
                    className='w-44 h-44 object-cover rounded-full mx-10 max-sm:mt-10'
                    alt=''
                />

            </div>

        </div>
    )
}

export default ProfilePage