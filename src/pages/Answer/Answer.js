import React, { useEffect, useState } from 'react';
import styles from './Answer.module.css';
import Layout from '../../Layout';
import { useLocation, useNavigate } from 'react-router-dom';

import rstImgCorrect1 from './rstImgCorrect1.png';
import rstImgCorrect2 from './rstImgCorrect2.jpg';
import rstImgCorrect3 from './rstImgCorrect3.jpg';
import rstImgCorrect4 from './rstImgCorrect4.jpg';
import rstImgCorrect5 from './rstImgCorrect5.jpeg';
import rstImgCorrect6 from './rstImgCorrect6.png';
import rstImgCorrect7 from './rstImgCorrect7.jpg';
import rstImgCorrect8 from './rstImgCorrect8.jpeg';
import rstImgCorrect9 from './rstImgCorrect9.jpeg';
import rstImgCorrect10 from './rstImgCorrect10.webp';
import rstImgWrong1 from './rstImgWrong1.gif';
import rstImgWrong2 from './rstImgWrong2.jpg';
import rstImgWrong3 from './rstImgWrong3.jpg';
import rstImgWrong4 from './rstImgWrong4.jpg';
import rstImgWrong5 from './rstImgWrong5.jpg';
import rstImgWrong6 from './rstImgWrong6.jpeg';
import rstImgWrong7 from './rstImgWrong7.jpeg';
import rstImgWrong8 from './rstImgWrong8.jpeg';
import rstImgWrong9 from './rstImgWrong9.jpeg';

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
                setQuote(quotesArray[randomIndex]);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });

        if (isRight) {
            const correctImages = [
                rstImgCorrect1,
                rstImgCorrect2,
                rstImgCorrect3,
                rstImgCorrect4,
                rstImgCorrect5,
                rstImgCorrect6,
                rstImgCorrect7,
                rstImgCorrect8,
                rstImgCorrect9,
                rstImgCorrect10,
            ];
            const randomCorrectImage = correctImages[Math.floor(Math.random() * correctImages.length)];
            setSelectedImage(randomCorrectImage);
        } else {
            const wrongImages = [
                rstImgWrong1,
                rstImgWrong2,
                rstImgWrong3,
                rstImgWrong4,
                rstImgWrong5,
                rstImgWrong6,
                rstImgWrong7,
                rstImgWrong8,
                rstImgWrong9,
            ];
            const randomWrongImage = wrongImages[Math.floor(Math.random() * wrongImages.length)];
            setSelectedImage(randomWrongImage);
        }
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
