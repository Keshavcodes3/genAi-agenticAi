import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../Service/settingService';
import { setUser } from '../../Auth/Redux/auth.slice';

export const useSettings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleUpdate = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await updateProfile(data);
            if (res.data) {
                dispatch(setUser(res.data));
                setSuccess(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, success, handleUpdate };
};
