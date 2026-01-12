import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const NotificationListener = () => {
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            const socket = io('http://localhost:5000');

            socket.emit('join_user', userInfo._id);

            socket.on('notification', (data) => {
                // Simple alert for now - user requested "instant notification"
                // In a real app we'd use a toast library like react-hot-toast
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
