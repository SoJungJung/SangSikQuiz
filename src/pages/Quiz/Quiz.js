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
    const [randomQuiz, setRandomQuiz] = useState(null);

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
                // Combine all quizzes from all difficulty levels into one array
                const allQuizzes = [
                    ...jsonData.easy,
                    ...jsonData.intermediate,
                    ...jsonData.difficult,
                    ...jsonData['super-difficult'],
                ];

                // Pick a random quiz from the combined array
                const randomIndex = Math.floor(Math.random() * allQuizzes.length);
                setRandomQuiz(allQuizzes[randomIndex]);
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

    // 정답과 오답의 색상을 다르게 설정
    const circleClasses = [styles.circle, styles.circle2, styles.circle3];

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
                    <div className={styles.quizText}>{randomQuiz.quiz}</div>
                </div>
                <div className={styles.answerShow}>
                    {randomQuiz.answer.map((ans, index) => (
                        <div
                            key={index}
                            className={`${styles.answerDiv} ${index === 1 ? styles.midAnswerDiv : ''}`}
                            onClick={() => handleDivClick(ans.TRUE !== undefined)}
                        >
                            <div className={circleClasses[index % circleClasses.length]}>
                                <div className={styles.circleText}>{index + 1}</div>
                            </div>
                            <div className={styles.rectangle}>
                                <div className={styles.rectangleText}>{ans.TRUE ? ans.TRUE : ans.FALSE}</div>
                            </div>
                        </div>
                    ))}
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
