import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AppealsInfo.module.css";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const AppealsInfo = () => {
    const [messages, setMessages] = useState([]); // Массив заявок
    const [expandedId, setExpandedId] = useState(null); // ID развернутого элемента

    // Функция для получения заявок
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("JWT token not found");

            const response = await api.get("api/requests", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            setMessages(response.data); // Устанавливаем заявки
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    // Функция для переключения состояния расширения
    const toggleExpand = (id) => {
        setExpandedId((prevId) => (prevId === id ? null : id)); // Скрыть, если нажали повторно
    };

    const toggleDepand = (id => [
        setDepanded((prevId) <= (prevId === id ? null : id))
    ])

    // Получение заявок при загрузке компонента
    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <section className={styles.AppealsInfo}>
            {messages.length > 0 ? (
                messages.map((message) => {
                    const isExpanded = expandedId === message.id;
                    return (
                        <div
                            key={message.id}
                            className={`${styles.Appeal} ${isExpanded ? styles.Expanded : ""}`}
                            onClick={() => toggleExpand(message.id)}
                        >
                            <div className={styles.AppealLeftInfo}>
                                <h1 className={styles.AppealName}>{message.full_name}</h1>
                                <div className={styles.AppealContacts}>
                                    <a href={`tel:${message.phone_number}`} className={styles.AppealLink}>
                                        {message.phone_number}
                                    </a>
                                    <a href={`mailto:${message.email}`} className={styles.AppealLink}>
                                        {message.email}
                                    </a>
                                </div>
                            </div>
                            <div className={styles.AppealRightInfo}>
                                <div className={styles.time}>{message.created_date}</div>
                                <div className={styles.time}>{message.created_time}</div>
                            </div>
                            {/* Показ сообщения только если элемент раскрыт */}
                            {isExpanded && (
                                <div className={styles.Message}>
                                    <p>{message.message}</p>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <p className={styles.NoAppeals}>Нет доступных обращений</p>
            )}
        </section>
    );
};

export default AppealsInfo;
