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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [randomQuiz, setRandomQuiz] = useState(null);
    //문제 카운트 및 점수 상태 추가
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [score, setScore] = useState(0);

    //handleDivClick 업데이트
    const handleDivClick = (isRight) => {
        if (isRight) {
            setCorrectAnswersCount((prevCount) => prevCount + 1);
            setScore((prevScore) => prevScore + 10);
        }

        if (currentQuestionIndex < 9) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            navigate(`/answer?isRight=${isRight}`);
        } else {
            navigate(`/result?score=${score + (isRight ? 10 : 0)}`);
        }

        console.log('함수 실행일 수도');
    };

    // Function to shuffle the answers
    const shuffleAnswers = (answers) => {
        return answers.sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        // Fetch JSON file
        fetch('/example.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData) => {
                // Function to randomly select n items from an array
                const getRandomItems = (array, n, level) => {
                    const shuffled = array.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, n).map((item) => ({ ...item, level }));
                };

                // Select quizzes based on difficulty
                const superDifficultQuizzes = getRandomItems(jsonData['super-difficult'], 2, 'super-difficult');
                const difficultQuizzes = getRandomItems(jsonData.difficult, 2, 'difficult');
                const intermediateQuizzes = getRandomItems(jsonData.intermediate, 4, 'intermediate');
                const easyQuizzes = getRandomItems(jsonData.easy, 2, 'easy');

                // Combine selected quizzes
                const selectedQuizzes = [
                    ...superDifficultQuizzes,
                    ...difficultQuizzes,
                    ...intermediateQuizzes,
                    ...easyQuizzes,
                ];

                // Log the level of each quiz
                selectedQuizzes.forEach((quiz) => console.log(`Quiz Level: ${quiz.level}`));

                // Pick a random quiz from the combined selected quizzes
                const randomIndex = Math.floor(Math.random() * selectedQuizzes.length);
                const selectedQuiz = selectedQuizzes[randomIndex];

                // Shuffle the answers of the selected quiz
                selectedQuiz.answer = shuffleAnswers(selectedQuiz.answer);

                setRandomQuiz(selectedQuiz);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Check if data is loading
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Set different colors for correct and incorrect answers
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
                <div className={styles.numShow}>{currentQuestionIndex + 1} / 10</div>
                <div className={styles.bottomdiv}>
                    <img className={styles.leftbottom} src={leftbottom} alt="Left Bottom" />
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;
