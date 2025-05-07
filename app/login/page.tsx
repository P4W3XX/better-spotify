"use client";
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';
import { useTokenStore } from '@/store/token';

export default function LoginPage() {
    const [steps, setSteps] = useState<'Login' | 'Register' | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const setAccessToken = useTokenStore((state) => state.setAccessToken);
    const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
    const router = useRouter();

    const handleLogin = () => {
        console.log('Logging in with:', { email, password });
        console.log('Login URL')
        axios.post('http://127.0.0.1:8000/api/login/', { email: email, password: password })
            .then(response => {
                console.log('Login successful:', response);
                axios.get(`/api/set-cookie?key=token&value=${response.data.tokens.access}`).then(() => {
                    console.log('Token set successfully');
                    setAccessToken(response.data.tokens.access)
                    setRefreshToken(response.data.tokens.refresh)
                    router.refresh();
                    router.push('/')

                })
                axios.get(`/api/set-cookie?key=tokenRefresh&value=${response.data.tokens.refresh}`).then(() => {
                    console.log('Token Refresh set successfully');
                })
                toast.success('Login successful!', {
                    className: 'text-white !font-bold !rounded-xl !bg-white/5 !backdrop-blur-3xl',
                });
            })
            .catch(error => {
                console.error('Login error:', error);
                toast.error('Invalid email or password. Please try again.', {
                    className: 'text-white !font-bold !rounded-xl !bg-white/5 !backdrop-blur-3xl',
                });
            });
    }

    const handleRegister = async () => {
        console.log('Registering with:', { username, email, password, confirmPassword });
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.', {
                className: 'text-white !font-bold !rounded-xl !bg-white/5 !backdrop-blur-3xl',
            });
            return;
        }
        axios.post('http://127.0.0.1:8000/api/register/', {
            username,
            email,
            password1: password,
            password2: confirmPassword
        })
            .then(response => {
                console.log('Registration successful:', response.data);
                toast.success('Registration successful!', {
                    className: 'text-white !font-bold !rounded-xl !bg-white/5 !backdrop-blur-3xl',
                });
                axios.get(`/api/set-cookie?key=token&value=${response.data.tokens.access}`).then(() => {
                    console.log('Token Access set successfully');
                    setAccessToken(response.data.tokens.access)
                    setRefreshToken(response.data.tokens.refresh)
                    router.refresh();
                    router.push('/')
                })
                axios.get(`/api/set-cookie?key=tokenRefresh&value=${response.data.tokens.refresh}`).then(() => {
                    console.log('Token Refresh set successfully');
                })
            })
            .catch(error => {
                console.error('Registration error:', error);
                toast.error('Registration failed. Please try again.', {
                    className: 'text-white !font-bold !rounded-xl !bg-white/5 !backdrop-blur-3xl',
                });
            });
    }



    return (
        <main style={{
            backgroundImage: "url('/loginBG.svg')",
        }} className="flex flex-col items-center bg-center bg-cover justify-center h-screen bg-black w-full">
            <div className=' w-full h-full absolute top-0 left-0 bg-gradient-to-t from-zinc-950 via-zinc-950' />
            <motion.div layout className=' items-center sm:justify-center justify-end py-10 z-10 text-center flex flex-col sm:w-[25rem] h-full w-[90%] gap-y-5'>
                <div className={` flex flex-col items-center justify-center absolute pointer-events-none transition-all -translate-y-[7rem] delay-100 duration-300 sm:-translate-y-[9rem] ${steps === 'Login' && 'sm:-translate-y-[14rem] -translate-y-[19rem]'} ${steps === 'Register' && 'sm:-translate-y-[16rem] -translate-y-[24rem]'} `}>
                    <Image src="/spotify.svg" alt="Logo" width={50} height={50} className="mb-3" />
                    <h1 className="sm:text-4xl text-3xl text-white mb-12 font-semibold">{
                        steps === 'Login' ? 'Zaloguj się' : steps === 'Register' ? 'Zarejestruj się' : 'Witamy w Spotify'
                    }</h1>
                </div>
                <AnimatePresence mode='wait'>
                    {steps === null ? (
                        <motion.div initial={{
                            opacity: 0,
                            x: -50,
                        }} key={"main"} animate={{
                            opacity: 1,
                            x: 0,
                        }}
                            exit={{
                                opacity: 0,
                                x: -50,
                            }}
                            transition={{
                                duration: 0.3, ease: 'easeInOut'
                            }} className=' flex flex-col gap-y-5 w-full items-center'>
                            <button onClick={() => setSteps('Register')} className="rounded-3xl font-semibold active:scale-95 transition-all cursor-pointer w-full bg-green-600 px-8 text-black py-3 hover:bg-green-700" >Zarejestruj się</button>
                            <button onClick={() => setSteps('Login')} className="rounded-3xl font-medium w-full bg-transparent active:scale-95 transition-all cursor-pointer border-2 px-8 py-3 backdrop-blur-3xl hover:bg-white/3">Zaloguj się</button>
                        </motion.div>
                    ) : (
                        <motion.div key={"login"} initial={{
                            opacity: 0,
                            x: 50,
                        }} exit={{
                            opacity: 0,
                            x: 50,
                        }} animate={{
                            opacity: 1,
                            x: 0,
                        }} transition={{
                            duration: 0.3, ease: 'easeInOut'
                        }} className=' flex flex-col gap-y-5 w-full items-center'>
                            {steps === 'Login' ? (
                                <>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                                    <button onClick={() => router.push("/forgotNword")} className="text-sm w-full text-start mb-5 font-medium text-white/50 hover:text-green-400">Forgot Password?</button>
                                    <button onClick={() => handleLogin()} className="rounded-3xl font-semibold active:scale-95 transition-all cursor-pointer w-full bg-green-600 px-8 text-black py-3 hover:bg-green-700" >Zaloguj się</button>
                                    <button onClick={() => setSteps(null)} className="rounded-3xl font-medium w-full bg-transparent active:scale-95 transition-all cursor-pointer border-2 px-8 py-3 backdrop-blur-3xl hover:bg-white/3">Powrót</button>
                                </>
                            ) : (
                                <>
                                    <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                                    <button onClick={() => handleRegister()} className="rounded-3xl font-semibold active:scale-95 transition-all cursor-pointer w-full bg-green-600 px-8 text-black py-3 hover:bg-green-700" >Zarejestruj się</button>
                                    <button onClick={() => setSteps(null)} className="rounded-3xl font-medium w-full bg-transparent active:scale-95 transition-all cursor-pointer border-2 px-8 py-3 backdrop-blur-3xl hover:bg-white/3">Powrót</button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}