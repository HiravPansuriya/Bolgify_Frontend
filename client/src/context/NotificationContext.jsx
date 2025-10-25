import { createContext, useContext, useState, useEffect } from "react";
import { fetchNotifications, markNotificationAsRead } from "../api/notificationApi";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadNotifications = async () => {
        try {
            const { data } = await fetchNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.notifications.filter(n => !n.isRead).length);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => 
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => prev - 1);
        } catch (err) {
            console.error("Failed to mark notification read:", err);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, loadNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
