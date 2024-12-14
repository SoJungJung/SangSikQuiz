import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Quiz.module.css";
import lefttop from "./lefttop.png";
import leftbottom from "./leftbottom.png";
import righttop from "./righttop.png";
import point from "./point.png";
import Layout from "../../Layout";

const Quiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 초기 로딩 상태는 true
  const [error, setError] = useState(null);

  const [notLoading, setNotLoading] = useState(false);
  const maxBackPress = 3; // 뒤로가기 조롱 메시지 출력 조건
  const backPressCountRef = useRef(0);

  useEffect(() => {
    const preventGoBack = () => {
      backPressCountRef.current += 1;

      if (backPressCountRef.current >= maxBackPress) {
        alert("뒤로가기 하지마! 한번만 더 하면 너 진짜 바보야!");
      } else {
        alert("뒤로가기는 안됩니다!");
      }

      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  const [selectedQuizzes, setSelectedQuizzes] = useState(() => {
    const storedQuizzes = localStorage.getItem("selectedQuizzes");
    return storedQuizzes ? JSON.parse(storedQuizzes) : [];
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    () => parseInt(localStorage.getItem("currentQuestionIndex"), 10) || 0
  );
  const [correctAnswersCount, setCorrectAnswersCount] = useState(
    () => parseInt(localStorage.getItem("correctAnswersCount"), 10) || 0
  );
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score"), 10) || 0);

  const randomQuiz = selectedQuizzes.length > 0 ? selectedQuizzes[currentQuestionIndex] : null;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!selectedQuizzes || selectedQuizzes.length === 0) {
          const response = await fetch("/example.json");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const jsonData = await response.json();

          const levels = {
            "super-difficult": [],
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
            ...selectRandomQuestions(levels["super-difficult"], 1, 5),
            ...selectRandomQuestions(levels["difficult"], 1, 5),
            ...selectRandomQuestions(levels["intermediate"], 1, 5),
            ...selectRandomQuestions(levels["easy"], 1, 5),
          ];

          selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

          selectedQuestions.forEach((quiz) => {
            quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
          });

          setSelectedQuizzes(selectedQuestions);
          localStorage.setItem("selectedQuizzes", JSON.stringify(selectedQuestions));
        }
        setLoading(false); // 데이터를 가져온 후 로딩 상태를 false로 변경
      } catch (err) {
        setError(err.message);
        setLoading(false); // 에러가 발생해도 로딩 상태를 false로 변경
      }
    };

    fetchQuizData();
  }, [selectedQuizzes]);

  const handleDivClick = useCallback(
    (answer, isRight) => {
      if (!randomQuiz) return;

      const correctAnswer = randomQuiz.answer.find((ans) => ans.TRUE)?.TRUE;
      const selectedAnswer = answer.TRUE || answer.FALSE;

      const newQuestionIndex = currentQuestionIndex + 1;
      const newCorrectAnswersCount = isRight ? correctAnswersCount + 1 : correctAnswersCount;
      const newScore = isRight ? score + 10 : score;

      setCurrentQuestionIndex(newQuestionIndex);
      setCorrectAnswersCount(newCorrectAnswersCount);
      setScore(newScore);

      localStorage.setItem("currentQuestionIndex", newQuestionIndex);
      localStorage.setItem("correctAnswersCount", newCorrectAnswersCount);
      localStorage.setItem("score", newScore);

      if (newQuestionIndex < 10) {
        navigate(
          `/answer?isRight=${isRight}&correctAnswer=${encodeURIComponent(
            correctAnswer
          )}&selectedAnswer=${encodeURIComponent(selectedAnswer)}`
        );
      } else {
        localStorage.setItem("score", newScore);
        localStorage.setItem("totalQuestions", 10);

        localStorage.removeItem("selectedQuizzes");
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("correctAnswersCount");
        setNotLoading(true);
      }
    },
    [randomQuiz, currentQuestionIndex, correctAnswersCount, score, navigate]
  );

  useEffect(() => {
    if (notLoading) {
      navigate(`/result`);
    }
  }, [notLoading, navigate]);

  // 로딩 상태 처리
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!randomQuiz) {
    return <div>No quiz data available</div>; // 퀴즈 데이터가 없을 때 처리
  }

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
          <div className={styles.quizText}>{randomQuiz?.quiz || "퀴즈 데이터를 불러오는 중..."}</div>
        </div>
        <div className={styles.answerShow}>
          {randomQuiz.answer.map((ans, index) => (
            <div
              key={index}
              className={`${styles.answerDiv} ${index === 1 ? styles.midAnswerDiv : ""}`}
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
