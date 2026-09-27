import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import toast from 'react-hot-toast'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const { socket, axios } = useContext(AuthContext)

    // Get all users
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users')

            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Get messages
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)

            if (data.success) {
                setMessages(data.messages)

                // Clear unseen count for this user
                setUnseenMessages((prev) => {
                    const updated = { ...prev }
                    delete updated[userId]
                    return updated
                })
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Send message
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(
                `/api/messages/send/${selectedUser._id}`,
                messageData
            )

            if (data.success) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    data.newMessage
                ])
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Receive new messages
    const subscribeToMessages = () => {

        if (!socket) return

        socket.on('newMessage', async (newMessage) => {

            if (
                selectedUser &&
                newMessage.senderId === selectedUser._id
            ) {

                // Chat is already open, so message is seen
                newMessage.seen = true

                setMessages((prevMessages) => [
                    ...prevMessages,
                    newMessage
                ])

                // Save seen status in database
                try {
                    await axios.put(`/api/messages/mark/${newMessage._id}`)
                } catch (error) {
                    console.log('Mark seen error:', error.message)
                }

            } else {

                // Increase unseen message count
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]:
                        prev[newMessage.senderId]
                            ? prev[newMessage.senderId] + 1
                            : 1
                }))
            }
        })
    }

    // Stop receiving messages
    const unsubscribeFromMessages = () => {

        if (socket) {
            socket.off('newMessage')
        }
    }

    useEffect(() => {

        subscribeToMessages()

        return () => {
            unsubscribeFromMessages()
        }

    }, [socket, selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}