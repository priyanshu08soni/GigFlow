import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import baseURL from '../utils/axiosConfig';
const NotificationListener = () => {
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            const socket = io(baseURL);

            socket.emit('join_user', userInfo._id);

            socket.on('notification', (data) => {
                alert(`🔔 Notification: ${data.message}`);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [userInfo]);

    return null;
};

export default NotificationListener;
