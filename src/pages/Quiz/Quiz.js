import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Quiz.module.css';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import point from './point.png';
import quiz from './quiz.png';
import Layout from '../../Layout';

const Quiz = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedQuizzes, setSelectedQuizzes] = useState(() => {
        const storedQuizzes = localStorage.getItem('selectedQuizzes');
        return storedQuizzes ? JSON.parse(storedQuizzes) : null;
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
        () => parseInt(localStorage.getItem('currentQuestionIndex'), 10) || 0
    );
    const [correctAnswersCount, setCorrectAnswersCount] = useState(
        () => parseInt(localStorage.getItem('correctAnswersCount'), 10) || 0
    );
    const [score, setScore] = useState(() => parseInt(localStorage.getItem('score'), 10) || 0);

    const randomQuiz = selectedQuizzes ? selectedQuizzes[currentQuestionIndex] : null;

    // 문제 선택 로직
    const handleDivClick = useCallback(
        (answer, isRight) => {
            const correctAnswer = randomQuiz.answer.find((ans) => ans.TRUE)?.TRUE;
            const selectedAnswer = answer.TRUE || answer.FALSE;

            // 상태 업데이트 및 로컬 스토리지에 저장
            const newQuestionIndex = currentQuestionIndex + 1;
            const newCorrectAnswersCount = isRight ? correctAnswersCount + 1 : correctAnswersCount;
            const newScore = isRight ? score + 10 : score;

            setCurrentQuestionIndex(newQuestionIndex);
            setCorrectAnswersCount(newCorrectAnswersCount);
            setScore(newScore);

            // 로컬 스토리지에 저장
            localStorage.setItem('currentQuestionIndex', newQuestionIndex);
            localStorage.setItem('correctAnswersCount', newCorrectAnswersCount);
            localStorage.setItem('score', newScore);

            // 마지막 문제인지 확인
            if (newQuestionIndex < 10) {
                navigate(
                    `/answer?isRight=${isRight}&correctAnswer=${encodeURIComponent(
                        correctAnswer
                    )}&selectedAnswer=${encodeURIComponent(selectedAnswer)}`
                );
            } else {
                // 퀴즈 완료 시 로컬 스토리지 초기화
                localStorage.removeItem('selectedQuizzes');
                localStorage.removeItem('currentQuestionIndex');
                localStorage.removeItem('correctAnswersCount');
                localStorage.removeItem('score');
                navigate(`/result`);
            }
        },
        [randomQuiz, currentQuestionIndex, correctAnswersCount, score, navigate]
    );

    // 퀴즈 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                if (!selectedQuizzes) {
                    const response = await fetch('/example.json');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const jsonData = await response.json();

                    // 모든 퀴즈를 하나의 배열로 수집
                    let allQuestions = [];
                    Object.keys(jsonData).forEach((level) => {
                        const questions = jsonData[level].map((item) => ({ ...item, level }));
                        allQuestions = allQuestions.concat(questions);
                    });

                    if (allQuestions.length < 10) {
                        throw new Error('Not enough questions available.');
                    }

                    // 모든 퀴즈를 섞은 후 10개를 선택
                    allQuestions.sort(() => Math.random() - 0.5);
                    const quizzes = allQuestions.slice(0, 10);

                    // 선택된 퀴즈의 답변도 섞기
                    quizzes.forEach((quiz) => {
                        quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
                    });

                    // 상태 및 로컬 스토리지에 저장
                    setSelectedQuizzes(quizzes);
                    localStorage.setItem('selectedQuizzes', JSON.stringify(quizzes));
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [selectedQuizzes]);

    // **현재 문제의 난이도를 콘솔에 출력**
    useEffect(() => {
        if (randomQuiz) {
            console.log(`Current question difficulty level: ${randomQuiz.level}`);
        }
    }, [randomQuiz]);

    // 로딩 상태 처리
    if (loading || !randomQuiz) {
        return <div>Loading...</div>;
    }

    // 에러 상태 처리
    if (error) {
        return <div>Error: {error}</div>;
    }

    const circleClasses = [styles.circle, styles.circle2, styles.circle3];

    // JSX
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
                        <div className={styles.pointText}>점수: {score}</div>
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
                            onClick={() => handleDivClick(ans, ans.TRUE !== undefined)}
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
                <div className={styles.numShow}>{currentQuestionIndex + 1} / 10</div>
                <div className={styles.bottomdiv}>
                    <img className={styles.leftbottom} src={leftbottom} alt="Left Bottom" />
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;
