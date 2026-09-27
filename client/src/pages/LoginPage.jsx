import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {

    const [currState, setCurrState] = useState('Sign up')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [bio, setBio] = useState('')
    const [isDataSubmitted, setIsDataSubmitted] = useState(false)

    const { login } = useContext(AuthContext)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (currState === 'Sign up' && !isDataSubmitted) {
            setIsDataSubmitted(true)
            return
        }

        login(
            currState === 'Sign up' ? 'signup' : 'login',
            {
                fullName,
                email,
                password,
                bio
            }
        )
    }

    return (
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

            {/* Logo */}
            <img
                src={assets.logo_big}
                className='w-[min(30vw,250px)]'
                alt=''
            />

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className='border-2 border-gray-500 bg-white/10 text-white p-6 flex flex-col gap-6 rounded-lg shadow-lg'
            >

                {/* Heading */}
                <div className='flex justify-between items-center'>

                    <h2 className='font-medium text-2xl'>
                        {currState}
                    </h2>

                    {isDataSubmitted && (
                        <img
                            onClick={() => setIsDataSubmitted(false)}
                            src={assets.arrow_icon}
                            className='w-5 cursor-pointer'
                            alt=''
                        />
                    )}

                </div>

                {/* Full Name */}
                {currState === 'Sign up' && !isDataSubmitted && (
                    <input
                        type='text'
                        placeholder='Full Name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className='p-2 border border-gray-500 rounded-md outline-none'
                        required
                    />
                )}

                {/* Email + Password */}
                {!isDataSubmitted && (
                    <>
                        <input
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='p-2 border border-gray-500 rounded-md outline-none'
                            required
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='p-2 border border-gray-500 rounded-md outline-none'
                            required
                        />
                    </>
                )}

                {/* Bio */}
                {currState === 'Sign up' && isDataSubmitted && (
                    <textarea
                        rows={4}
                        placeholder='Provide a short bio...'
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className='p-2 border border-gray-500 rounded-md outline-none'
                        required
                    />
                )}

                {/* Button */}
                <button
                    type='submit'
                    className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md cursor-pointer'
                >
                    {currState === 'Sign up'
                        ? 'Create Account'
                        : 'Login Now'}
                </button>

                {/* Terms */}
                <div className='flex items-center gap-2 text-sm text-gray-400'>
                    <input type='checkbox' required />
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>

                {/* Switch Login / Signup */}
                {currState === 'Sign up' ? (

                    <p className='text-sm text-gray-400'>
                        Already have an account?

                        <span
                            onClick={() => {
                                setCurrState('Login')
                                setIsDataSubmitted(false)
                            }}
                            className='ml-1 font-medium text-violet-400 cursor-pointer'
                        >
                            Login here
                        </span>
                    </p>

                ) : (

                    <p className='text-sm text-gray-400'>
                        Don't have an account?

                        <span
                            onClick={() => {
                                setCurrState('Sign up')
                                setIsDataSubmitted(false)
                            }}
                            className='ml-1 font-medium text-violet-400 cursor-pointer'
                        >
                            Click here
                        </span>
                    </p>

                )}

            </form>

        </div>
    )
}

export default LoginPage