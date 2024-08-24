import React, { useEffect, useState } from 'react';
import styles from './Quiz.module.css';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import point from './point.png';
import quiz from './quiz.png';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
    const navigate = useNavigate();

    const handleDivClick = (isRight) => {
        navigate(`/answer?isRight=${isRight}`);
        console.log('함수 실행일 수도');
    };

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [randomNumber, setRandomNumber] = useState(null);

    useEffect(() => {
        const number = Math.floor(Math.random() * 10);
        setRandomNumber(number);
    }, []);

    useEffect(() => {
        // JSON 파일 요청하기
        fetch('/example.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // 데이터가 로드되었는지 확인
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log(data.difficult[1].answer[0].TRUE);
    let nowQuiz = data.difficult[randomNumber];
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <img className={styles.lefttop} src={lefttop} alt="Left Top" />
                    <img className={styles.righttop} src={righttop} alt="Right Top" />
                    <div className={styles.pointShow}>
                        <div>
                            <img className={styles.point} src={point} alt="point" />
                        </div>
                        <div className={styles.pointText}>점수:</div>
                    </div>
                </div>
                <div className={styles.quizShow}>
                    <img className={styles.quiz} src={quiz} alt="quiz" />
                    <div className={styles.quizText}>{nowQuiz.quiz}</div>
                </div>
                <div className={styles.answerShow}>
                    <div className={styles.answerDiv} onClick={() => handleDivClick(true)}>
                        <div className={styles.circle}>
                            <div className={styles.circleText}>1</div>
                        </div>
                        <div className={styles.rectangle}>
                            <div className={styles.rectangleText}>{nowQuiz.answer[0].TRUE}</div>
                        </div>
                    </div>
                    <div className={`${styles.answerDiv} ${styles.midAnswerDiv}`} onClick={() => handleDivClick(false)}>
                        <div className={styles.circle2}>
                            <div className={styles.circleText}>2</div>
                        </div>
                        <div className={styles.rectangle}>
                            <div className={styles.rectangleText}>{nowQuiz.answer[1].FALSE}</div>
                        </div>
                    </div>
                    <div className={styles.answerDiv}>
                        <div className={styles.circle3}>
                            <div className={styles.circleText}>3</div>
                        </div>
                        <div className={styles.rectangle}>
                            <div className={styles.rectangleText}>{nowQuiz.answer[2].FALSE}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.numShow}>0 / 10</div>
                <div className={styles.bottomdiv}>
                    <img className={styles.leftbottom} src={leftbottom} alt="Left Bottom" />
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;
