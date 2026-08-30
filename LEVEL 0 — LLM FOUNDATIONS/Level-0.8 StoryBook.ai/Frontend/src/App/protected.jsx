import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Features/Auth/Hooks/useAuth'
import Loader from './Skeleton'
const Protected = ({ children }) => {
    const { loading, user } = useSelector((state) => state.auth)
    const { getMeUser } = useAuth()
    useEffect(() => {
        const getUser = async () => {
            await getMeUser();
        }
        getUser()
    }, [])
    if (loading) {
        return <Loader />
    }
    if (!user) {
        return <Navigate to={'/login'} replace />
    }
    return children
}

export default Protected