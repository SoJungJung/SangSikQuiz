import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Quiz.module.css";
import lefttop from "./lefttop.png";
import leftbottom from "./leftbottom.png";
import righttop from "./righttop.png";
import point from "./point.png";
import Layout from "../../Layout";

const Quiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [notLoading, setNotLoading] = useState(false); // 결과 화면 전환 상태 관리

  // 1. 뒤로가기 제한 기능 구현
  const maxBackPress = 3; // 뒤로가기 제한 횟수
  const backPressCountRef = useRef(0); // 뒤로가기 버튼 누른 횟수 저장 (리렌더링 방지)

  useEffect(() => {
    const preventGoBack = () => {
      backPressCountRef.current += 1;

      if (backPressCountRef.current >= maxBackPress) {
        alert("뒤로가기 계엄령! 한번만 더 하면 너 진짜 박정희야!");
      } else {
        alert("뒤로가기 금지! 금지!! 금.지.!!!");
      }
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  // 로컬 스토리지에서 퀴즈 데이터와 관련 상태를 가져오기
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

  // randomQuiz를 계산: selectedQuizzes와 currentQuestionIndex를 활용해 동적으로 결정
  const randomQuiz = useMemo(() => {
    if (selectedQuizzes.length > 0 && currentQuestionIndex < selectedQuizzes.length) {
      return selectedQuizzes[currentQuestionIndex];
    }
    return null;
  }, [selectedQuizzes, currentQuestionIndex]);

  // 퀴즈 데이터 가져오기
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!selectedQuizzes || selectedQuizzes.length === 0) {
          const response = await fetch("/example.json");

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const jsonData = await response.json();

          // 난이도별로 문제 분류
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

          // 난이도별로 랜덤 문제를 선택
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

          // 정답도 랜덤으로 섞음
          selectedQuestions.forEach((quiz) => {
            quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
          });

          setSelectedQuizzes(selectedQuestions);
          localStorage.setItem("selectedQuizzes", JSON.stringify(selectedQuestions));
        }
        setLoading(false); // 로딩 완료
      } catch (err) {
        setError(err.message);
        setLoading(false); // 에러 발생 시 로딩 종료
      }
    };

    fetchQuizData();
  }, [selectedQuizzes]);

  // 정답 클릭 핸들러
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

  // 로딩 및 에러 처리
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!randomQuiz) {
    if (selectedQuizzes.length === 0) {
      return <div>퀴즈 데이터를 로드 중입니다...</div>;
    }
    return <div>No quiz data available</div>;
  }

  // UI 렌더링
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
