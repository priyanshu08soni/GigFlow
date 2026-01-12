import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const NotificationListener = () => {
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            const socket = io('https://gigflow-r4bw.onrender.com');

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
