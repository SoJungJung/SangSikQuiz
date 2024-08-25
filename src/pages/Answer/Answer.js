import React, { useEffect, useState } from 'react';
import styles from './Answer.module.css';
import crtAsw from './crtAsw.png';
import rstImgFrame from './rstImgFrame.png';
import rstImgCorrect from './rstImgCorrect.png';
import rstImgWrong from './rstImgWrong.png';
import wrgAsw from './wrgAsw.png';
import Layout from '../../Layout';
import { useLocation } from 'react-router-dom';

const Answer = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isRight = queryParams.get('isRight') === 'true';

    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // JSON 파일 요청하기
        fetch('/quote.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData) => {
                // 맞춘 경우와 틀린 경우에 따라 다른 명언을 선택
                const quotesArray = isRight ? jsonData.quotes.correct : jsonData.quotes.incorrect;
                const randomIndex = Math.floor(Math.random() * quotesArray.length);
                setQuote(quotesArray[randomIndex]);
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

    return (
        <Layout>
            <div className={`${styles.container} ${isRight ? styles.greenBackground : styles.redBackground}`}>
                <div className={styles.topdiv}>
                    <div className={styles.crtAswShow}>
                        <img className={styles.crtAsw} src={crtAsw} alt="Correct Answer Icon" />
                        <div className={styles.crtAswShowText}>정답: 오토 폰 비스마르크</div>
                    </div>
                </div>
                <div className={styles.rstImgShow}>
                    <img className={styles.rstImgFrame} src={rstImgFrame} alt="Image Frame" />
                    <img className={styles.rstImg} src={isRight ? rstImgCorrect : rstImgWrong} alt="Result Image" />
                </div>
                {!isRight && (
                    <div className={styles.wrgAswShow}>
                        <div className={styles.wrgAswDiv}>
                            <img className={styles.wrgAsw} src={wrgAsw} alt="Wrong Answer Icon" />
                            <div className={styles.wrgAswShowText}>당신의 답: 헬무트 폰 몰트케</div>
                        </div>
                    </div>
                )}
                <div className={styles.quoteShow}>
                    <div className={styles.quoteText}>{quote && `"${quote.quote}" - ${quote.author}`}</div>
                </div>
            </div>
        </Layout>
    );
};

export default Answer;
