

// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// axios.defaults.baseURL = backendUrl;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//     const [token, setToken] = useState(localStorage.getItem("token"));
//     const [authUser, setAuthUser] = useState(null);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [socket, setSocket] = useState(null);

//     // Check if user is authenticated
//     const checkAuth = async () => {
//         try {
//             const { data } = await axios.get("/api/auth/check");

//             if (data.success) {
//                 setAuthUser(data.user);
//                 connectSocket(data.user);
//             } else {
//                 localStorage.removeItem("token");
//                 setToken(null);
//                 setAuthUser(null);
//             }

//         } catch (error) {
//             console.log("Auth check error:", error.message);
//         }
//     };

//     // Login function
//     const login = async (state, credentials) => {
//         try {
//             const { data } = await axios.post(
//                 `/api/auth/${state}`,
//                 credentials
//             );

//             if (data.success) {

//                 setAuthUser(data.userData);

//                 axios.defaults.headers.common["token"] = data.token;

//                 setToken(data.token);

//                 localStorage.setItem("token", data.token);

//                 connectSocket(data.userData);

//                 toast.success(data.message);

//                 return true;

//             } else {
//                 toast.error(data.message);
//                 return false;
//             }

//         } catch (error) {
//             toast.error(error.message);
//             return false;
//         }
//     };

//     // Logout function
//     const logout = () => {

//         localStorage.removeItem("token");

//         setToken(null);
//         setAuthUser(null);
//         setOnlineUsers([]);

//         delete axios.defaults.headers.common["token"];

//         if (socket) {
//             socket.disconnect();
//             setSocket(null);
//         }

//         toast.success("Logged out successfully");
//     };

//     const updateProfile = async (body) => {
//     try {
//         const { data } = await axios.put(
//             "/api/auth/update-profile",
//             body
//         );

//         if (data.success) {
//             setAuthUser(data.user);
//             toast.success("Profile updated successfully");
//             return true;
//         } else {
//             toast.error(data.message);
//             return false;
//         }

//     } catch (error) {
//         toast.error(error.message);
//         return false;
//     }
// }

//     // Connect Socket.IO
//     const connectSocket = (userData) => {

//         if (!userData || socket?.connected) return;

//         const newSocket = io(backendUrl, {
//             query: {
//                 userId: userData._id,
//             }
//         });

//         setSocket(newSocket);

//         newSocket.on("getOnlineUsers", (userIds) => {
//             setOnlineUsers(userIds);
//         });
//     };

//     // Restore authentication after refresh
//     useEffect(() => {

//         const initAuth = async () => {

//             const savedToken = localStorage.getItem("token");

//             if (!savedToken) {
//                 return;
//             }

//             axios.defaults.headers.common["token"] = savedToken;

//             await checkAuth();
//         };

//         initAuth();

//     }, []);

//     const value = {
//         axios,
//         authUser,
//         onlineUsers,
//         socket,
//         login,
//         logout,
//         updateProfile
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:6001";

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        sessionStorage.getItem("token")
    );

    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");

            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            } else {
                sessionStorage.removeItem("token");
                setToken(null);
                setAuthUser(null);
            }

        } catch (error) {
            console.log("Auth check error:", error.message);
        }
    };

    // Login function
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(
                `/api/auth/${state}`,
                credentials
            );

            if (data.success) {

                setAuthUser(data.userData);

                axios.defaults.headers.common["token"] = data.token;

                setToken(data.token);

                sessionStorage.setItem("token", data.token);

                connectSocket(data.userData);

                toast.success(data.message);

                return true;

            } else {
                toast.error(data.message);
                return false;
            }

        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Logout function
    const logout = () => {

        sessionStorage.removeItem("token");

        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);

        delete axios.defaults.headers.common["token"];

        if (socket) {
            socket.disconnect();
            setSocket(null);
        }

        toast.success("Logged out successfully");
    };

    // Update profile
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put(
                "/api/auth/update-profile",
                body
            );

            if (data.success) {
                setAuthUser(data.user);

                toast.success("Profile updated successfully");

                return true;

            } else {
                toast.error(data.message);
                return false;
            }

        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Connect Socket.IO
    const connectSocket = (userData) => {

        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });

        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    // Restore authentication after refresh
    useEffect(() => {

        const initAuth = async () => {

            const savedToken = sessionStorage.getItem("token");

            if (!savedToken) {
                return;
            }

            axios.defaults.headers.common["token"] = savedToken;

            await checkAuth();
        };

        initAuth();

    }, []);

    const value = {
        token,
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
