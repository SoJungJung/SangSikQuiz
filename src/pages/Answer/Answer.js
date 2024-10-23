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

    // 뒤로 가기 방지 관련 변수
    const backPressCountRef = useRef(0);
    const maxBackPress = 3; // 뒤로 가기 시도 횟수 제한

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

    // 뒤로 가기 방지 기능 추가
    useEffect(() => {
        const preventGoBack = () => {
            backPressCountRef.current += 1;

            console.log('뒤로가기를 시도했습니다.');

            if (backPressCountRef.current >= maxBackPress) {
                alert('뒤로가기 하지마! 한번만 더 하면 너 진짜 바보야!');
                console.log('조롱 메시지 출력됨');
            } else {
                alert('뒤로가기는 안됩니다!');
                console.log(`현재 뒤로가기 시도 횟수: ${backPressCountRef.current}`);
            }

            window.history.pushState(null, '', window.location.href);
        };

        // 컴포넌트 마운트 시 히스토리 스택에 현재 상태를 추가
        window.history.pushState(null, '', window.location.href);

        // popstate 이벤트 리스너 추가
        window.addEventListener('popstate', preventGoBack);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('popstate', preventGoBack);
        };
    }, []);

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
