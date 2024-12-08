import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ children, onClose }) => (
    <div className={styles.Modal}>
        <div className={styles.ModalContent}>
            {children}
            <button className={styles.CloseButton} onClick={onClose}>
                Закрыть
            </button>
        </div>
    </div>
);

export default Modal;
