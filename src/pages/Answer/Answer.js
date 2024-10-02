import React, { useEffect, useState } from 'react';
import styles from './Answer.module.css';
import Layout from '../../Layout';
import { useLocation, useNavigate } from 'react-router-dom';

const Answer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const isRight = queryParams.get('isRight') === 'true';
    const correctAnswer = queryParams.get('correctAnswer');
    const selectedAnswer = queryParams.get('selectedAnswer');

    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetch('/quote.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData) => {
                const quotesArray = isRight ? jsonData.quotes.correct : jsonData.quotes.incorrect;
                const randomIndex = Math.floor(Math.random() * quotesArray.length);
                const selectedQuote = quotesArray[randomIndex];
                setQuote(selectedQuote);
                setSelectedImage(selectedQuote.image);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [isRight]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleContinue = () => {
        navigate('/quiz');
    };

    return (
        <Layout>
            <div className={`${styles.container} ${isRight ? styles.greenBackground : styles.redBackground}`}>
                <div className={styles.topdiv}>
                    <div className={styles.crtAswShow}>
                        <div className={styles.crtAsw}></div>
                        <div className={styles.crtAswShowText}>정답: {correctAnswer}</div>
                    </div>
                </div>
                <div className={styles.rstImgShow}>
                    <img className={styles.rstImg} src={selectedImage} alt="ResultThing" />
                </div>
                {!isRight && (
                    <div className={styles.wrgAswShow}>
                        <div className={styles.wrgAswDiv}>
                            <div className={styles.wrgAsw}></div>
                            <div className={styles.wrgAswShowText}>당신의 답: {selectedAnswer}</div>
                        </div>
                    </div>
                )}
                <div className={styles.quoteShow}>
                    <div className={styles.quoteText}>{quote && `"${quote.quote}" - ${quote.author}`}</div>
                </div>
                <div>
                    <button className={styles.cntButton} onClick={handleContinue}>
                        다음 문제로
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Answer;
