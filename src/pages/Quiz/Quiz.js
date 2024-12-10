import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Quiz.module.css';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import point from './point.png';
import Layout from '../../Layout';

const Quiz = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const maxBackPress = 3;
    const backPressCountRef = useRef(0);

    const [selectedQuizzes, setSelectedQuizzes] = useState(() => {
        const storedQuizzes = localStorage.getItem('selectedQuizzes');
        return storedQuizzes ? JSON.parse(storedQuizzes) : [];
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
        () => parseInt(localStorage.getItem('currentQuestionIndex'), 10) || 0
    );
    const [correctAnswersCount, setCorrectAnswersCount] = useState(
        () => parseInt(localStorage.getItem('correctAnswersCount'), 10) || 0
    );
    const [score, setScore] = useState(() => parseInt(localStorage.getItem('score'), 10) || 0);

    const randomQuiz = selectedQuizzes.length > 0 ? selectedQuizzes[currentQuestionIndex] : null;

    const [notLoading, setNotLoading] = useState(false);

    // 오답 클릭 시 해당 인덱스를 기록해볼 용도의 상태
    const [firedAnswerIndex, setFiredAnswerIndex] = useState(null);

    useEffect(() => {
        const preventGoBack = () => {
            backPressCountRef.current += 1;
            if (backPressCountRef.current >= maxBackPress) {
                alert('뒤로가기 하지마! 한번만 더 하면 너 진짜 바보야!');
            } else {
                alert('뒤로가기는 안됩니다!');
            }

            window.history.pushState(null, '', window.location.href);
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', preventGoBack);

        return () => {
            window.removeEventListener('popstate', preventGoBack);
        };
    }, []);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                if (!selectedQuizzes || selectedQuizzes.length === 0) {
                    const response = await fetch('/example.json');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const jsonData = await response.json();

                    const levels = {
                        'super-difficult': [],
                        difficult: [],
                        intermediate: [],
                        easy: [],
                    };

                    Object.keys(jsonData).forEach((level) => {
                        jsonData[level].forEach((item) => {
                            levels[level].push({ ...item, level });
                        });
                    });

                    const selectRandomQuestions = (questions, min, max) => {
                        const count = Math.floor(Math.random() * (max - min + 1)) + min;
                        return questions.sort(() => Math.random() - 0.5).slice(0, count);
                    };

                    let selectedQuestions = [
                        ...selectRandomQuestions(levels['super-difficult'], 1, 5),
                        ...selectRandomQuestions(levels['difficult'], 1, 5),
                        ...selectRandomQuestions(levels['intermediate'], 1, 5),
                        ...selectRandomQuestions(levels['easy'], 1, 5),
                    ];

                    selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

                    selectedQuestions.forEach((quiz) => {
                        quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
                    });

                    setSelectedQuizzes(selectedQuestions);
                    localStorage.setItem('selectedQuizzes', JSON.stringify(selectedQuestions));
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [selectedQuizzes]);

    const handleDivClick = useCallback(
        (answer, isRight, index) => {
            if (!randomQuiz) return;

            const correctAnswer = randomQuiz.answer.find((ans) => ans.TRUE)?.TRUE;
            const selectedAnswer = answer.TRUE || answer.FALSE;

            if (!isRight) {
                // 오답인 경우 해당 보기 날아가는 애니메이션 후 로직 처리
                setFiredAnswerIndex(index);
                setTimeout(() => {
                    proceedNext(isRight, correctAnswer, selectedAnswer);
                }, 700); // 애니메이션 시간 후 다음 단계로
            } else {
                proceedNext(isRight, correctAnswer, selectedAnswer);
            }
        },
        [randomQuiz, currentQuestionIndex, correctAnswersCount, score, navigate]
    );

    const proceedNext = (isRight, correctAnswer, selectedAnswer) => {
        const newQuestionIndex = currentQuestionIndex + 1;
        const newCorrectAnswersCount = isRight ? correctAnswersCount + 1 : correctAnswersCount;
        const newScore = isRight ? score + 10 : score;

        setCurrentQuestionIndex(newQuestionIndex);
        setCorrectAnswersCount(newCorrectAnswersCount);
        setScore(newScore);

        localStorage.setItem('currentQuestionIndex', newQuestionIndex);
        localStorage.setItem('correctAnswersCount', newCorrectAnswersCount);
        localStorage.setItem('score', newScore);

        if (newQuestionIndex < 10) {
            navigate(
                `/answer?isRight=${isRight}&correctAnswer=${encodeURIComponent(
                    correctAnswer
                )}&selectedAnswer=${encodeURIComponent(selectedAnswer)}`
            );
        } else {
            localStorage.setItem('score', newScore);
            localStorage.setItem('totalQuestions', 10);

            localStorage.removeItem('selectedQuizzes');
            localStorage.removeItem('currentQuestionIndex');
            localStorage.removeItem('correctAnswersCount');
            setNotLoading(true);
        }
    };

    useEffect(() => {
        if (notLoading) {
            navigate(`/result`);
        }
    }, [notLoading, navigate]);

    if (loading) {
        return <div className={styles.loading}>Loading... 로딩중...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    if (!randomQuiz) {
        return <div className={styles.noQuiz}>퀴즈 데이터가 없습니다!</div>;
    }

    const circleClasses = [styles.circle, styles.circle2, styles.circle3];

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <img className={styles.lefttop} src={lefttop} alt="Left Top" />
                    <img className={styles.righttop} src={righttop} alt="Right Top" />
                    <div className={styles.pointShow}>
                        <img className={styles.point} src={point} alt="point" />
                        <div className={styles.pointText}>점수: {score}</div>
                    </div>
                </div>

                <div className={styles.quizShow}>
                    <div className={styles.quizText}>{randomQuiz.quiz}</div>
                </div>

                <div className={styles.answerShow}>
                    {randomQuiz.answer.map((ans, index) => {
                        const isRight = ans.TRUE !== undefined;
                        const isFired = firedAnswerIndex === index; // 오답 클릭한 경우
                        return (
                            <div
                                key={index}
                                className={`${styles.answerDiv} ${index === 1 ? styles.midAnswerDiv : ''} ${
                                    isFired ? styles.fired : ''
                                }`}
                                onClick={() => handleDivClick(ans, isRight, index)}
                            >
                                <div className={circleClasses[index % circleClasses.length]}>
                                    <div className={styles.circleText}>{index + 1}</div>
                                </div>
                                <div className={styles.rectangle}>
                                    <div className={styles.rectangleText}>{isRight ? ans.TRUE : ans.FALSE}</div>
                                </div>
                            </div>
                        );
                    })}
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
