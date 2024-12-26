import React, { useEffect } from "react";
import { FiCheckCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import styles from "@/styles/Success.module.css";

const Success = () => {
    useEffect(() => {
        // Bileşen yüklendiğinde konfeti patlat
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);
    return (
        <div className={styles["success-container"]}>
            <div className={styles["success-content"]}>
                <FiCheckCircle size={72} className={styles["success-icon"]} />
                <h1 className={styles["success-title"]}>Tebrikler, Çekiliş Başvurunuz Başarıyla Alındı!</h1>
                <p className={styles["success-text"]}>
                    Çekilişe katılım talebiniz başarıyla alınmıştır. Talihlilerden biri olmanız halinde size tarafımızca ulaşılacaktır.
                    Sağlıklı ve mutlu günlerde sporun keyfini çıkarmanızı dileriz!
                </p>
                <a href="/" className={styles["success-link"]}>Anasayfaya Dön</a>
            </div>
        </div>
    );
}

export default Success;