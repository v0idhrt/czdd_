import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import AppealsComp from "../Appeals/Appeals";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import Appeals from "../../assets/Appeals.svg?react";
import Arrow from "../../assets/arrow.svg?react";
import Footer3 from "../Footer3/Footer3";
import Modal from "../../components/Modal/Modal"
import Backdrop from "../../components/Backdrop/Backdrop"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const LoginForm = () => {
    const navigate = useNavigate(); // Инициализация useNavigate
    const [Appeal, setAppeal] = useState(true)
    const [animationClass, setAnimationClass] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Store error as an object
    const [loading, setLoading] = useState(false); // Indicate loading state
    const [full_name, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhone] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmitAppeal = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            const response = await api.post('/requests', {full_name, phone_number, email, message});
            setLoading(false);

            if(response.status === 201){
                
                setFullName('');
                setPhone('');
                setEmail('');
                setMessage('');
                alert('Спасибо за обращение, мы рассмотрим вашу заявку в близжайшее время')
                toggleAppeal()
            }else{
                console.log('ERROR');
            }
        } catch (error) {
            setLoading(false);
            console.error(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear any previous error
        setLoading(true);

        try {
            const response = await api.post('/login', { username, password });
            setLoading(false);
      
      
            if (response.status === 200) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('username', response.data.username);
              localStorage.setItem('userId', response.data.id);
              useNavigate('/home')
              // localStorage.setItem('role', response.data.role); //Store role if present
              navigate('/home'); // Redirect to protected route
            } else {
              setError({ message: 'Ошибка авторизации. ' + response.data.error, status: response.status });
            }
          } catch (error) {
            setLoading(false); // Reset loading state
            setError({ message: 'Ошибка авторизации. Проверьте подключение к сети или правильность введенных данных.', status: error.response?.status || 500 }); // Better error handling
            console.error('Ошибка при авторизации:', error);
          }
        };

        if(error?.status === 401){
        }else(useNavigate('/home'))

    useEffect(() => {
        setAnimationClass('fadeIn');
        const timer = setTimeout(() => setAnimationClass(''), 300); // Длительность анимации
        return () => clearTimeout(timer);
    }, [Appeal]);

    const handleGuestLogin = () => {
        navigate('/home'); // Переход на страницу /home
    };


    const handleAppeal = (full_name, phone_number, email, message) => {

    }

    const toggleAppeal = (value) => {
        value ? setAppeal(false) : setAppeal(true);
    }

    return Appeal ? (
        <>
        <section className={`${styles.LoginSection} ${styles[animationClass]}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.HeaderForm}>Вход для 
                работника ЦОДД</h1>
                <input className={styles.LoginInput} type="name" placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input className={styles.LoginInput} type="password" placeholder="Пароль" value={password}
                    onChange={(e) => setPassword(e.target.value)}required />
                <div className={styles.ButtonWrapper}>
                    <button className={styles.ButtonWorker} type="submit">Войти</button>
                    <button className={styles.ButtonGuest}type="button">Войти как гость</button>
                </div>
            </form>
            <div className={styles.AppealsWrapper}>
                <div className={styles.AppealsVisual}>
                    <div className={styles.iconWrapper}><Appeals /></div>
                    <h1 className={styles.AppealsHeader}>Обращения</h1>
                    <p className={styles.AppealsText}>Имеются какие-то вопросы или предложения?
                    Напишите нам!</p>
                </div>
                <button className={styles.AppealsButton} onClick={() => toggleAppeal(Appeal)}>Написать обращение</button>
            </div>
        </section>
        <Footer3 />
        </>
    ):(
        <>
        <section className={`${styles.AppealSection} ${styles[animationClass]}`}>
            <form className={styles.formUser} onSubmit={handleSubmitAppeal}>
                <div className={styles.FormWrapper}>
                    <h1 className={styles.HeaderForm}>Обращение</h1>
                    <input className={styles.AppealInput} type="name" id="name" placeholder="ФИО" value={full_name} onChange={(e) => setFullName(e.target.value)} required />
                    <input className={styles.AppealInput} type="phone" id="phone" placeholder="Телефон" value={phone_number} onChange={(e) => setPhone(e.target.value)}  required></input>
                    <input className={styles.AppealInput} type="email" id="email" placeholder="Электронная почта"  value={email} onChange={(e) => setEmail(e.target.value)}  required />
                    <button className={styles.ButtonWorker} type="submit">Отправить</button>
                </div>
                <div className={styles.messageWrapper}>
                    <Arrow onClick={()=>toggleAppeal()} className={styles.Arrow}/>
                    <textarea
                    required
                    className={styles.messageInput}
                    placeholder="Обращение"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} 
                    ></textarea>
                </div>
            </form>
            
        </section>
        <Footer3 />
        </>
    )

}

export default LoginForm;