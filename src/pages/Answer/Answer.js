import React, { useEffect, useState, useRef } from 'react';
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

    const backPressCountRef = useRef(0);
    const maxBackPress = 3;

    const textContainerRef = useRef(null); // 텍스트 크기 조정을 위한 Ref

    // 글씨 크기 조정 로직
    useEffect(() => {
        const adjustFontSize = () => {
            const container = textContainerRef.current;
            if (!container) return;

            let fontSize = 26; // 기본 글씨 크기
            while (container.scrollHeight > container.clientHeight && fontSize > 14) {
                fontSize -= 1; // 크기를 줄임
                container.style.fontSize = `${fontSize}px`;
            }
        };

        adjustFontSize();
    }, [quote, correctAnswer, selectedAnswer]); // 텍스트 변경 시마다 실행

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

    useEffect(() => {
        const preventGoBack = () => {
            backPressCountRef.current += 1;
            if (backPressCountRef.current >= maxBackPress) {
                alert('뒤로가기 계엄령 선포!');
            } else {
                alert('뒤로가기 비상계엄!');
            }
            window.history.pushState(null, '', window.location.href);
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', preventGoBack);

        return () => {
            window.removeEventListener('popstate', preventGoBack);
        };
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    const handleContinue = () => {
        const currentIndex = parseInt(localStorage.getItem('currentQuestionIndex'), 10) || 0;
        if (currentIndex >= 10) {
            navigate('/result');
        } else {
            navigate('/quiz');
        }
    };

    return (
        <Layout>
            <div className={`${styles.container} ${isRight ? styles.greenBackground : styles.redBackground}`}>
                <div className={styles.topdiv}>
                    <div className={styles.crtAswShow}>
                        <div className={styles.crtAsw}></div>
                        <div className={styles.crtAswShowText} ref={textContainerRef}>
                            정답: {correctAnswer}
                        </div>
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
