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
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null);
  const maxBackPress = 3; // 뒤로가기 조롱 메시지 출력 조건

  // 뒤로가기 횟수를 추적하기 위한 useRef
  const backPressCountRef = useRef(0);

  const [selectedQuizzes, setSelectedQuizzes] = useState(() => {
    const storedQuizzes = localStorage.getItem("selectedQuizzes");
    return storedQuizzes ? JSON.parse(storedQuizzes) : null;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    () => parseInt(localStorage.getItem("currentQuestionIndex"), 10) || 0
  );
  const [correctAnswersCount, setCorrectAnswersCount] = useState(
    () => parseInt(localStorage.getItem("correctAnswersCount"), 10) || 0
  );
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score"), 10) || 0);
  const randomQuiz = selectedQuizzes ? selectedQuizzes[currentQuestionIndex] : null;

  // 뒤로가기 방지 기능 추가
  useEffect(() => {
    const preventGoBack = () => {
      backPressCountRef.current += 1;

      console.log("뒤로가기를 시도했습니다.");

      if (backPressCountRef.current >= maxBackPress) {
        alert("뒤로가기 하지마! 한번만 더 하면 너 진짜 바보야!");
        console.log("조롱 메시지 출력됨");
      } else {
        alert("뒤로가기는 안됩니다!");
        console.log(`현재 뒤로가기 시도 횟수: ${backPressCountRef.current}`);
      }

      // 현재 페이지를 다시 히스토리에 푸시하여 뒤로 가기 방지
      window.history.pushState(null, "", window.location.href);
    };

    // 컴포넌트 마운트 시 히스토리 스택에 현재 상태를 추가
    window.history.pushState(null, "", window.location.href);

    // popstate 이벤트 리스너 추가
    window.addEventListener("popstate", preventGoBack);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  // 퀴즈 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchQuizData = async () => {
      console.log("fetch 퀴즈 데이터 실행 중");
      console.log(selectedQuizzes);
      try {
        setLoading(true);
        if (!selectedQuizzes || selectedQuizzes.length === 0) {
          console.log("selectedQuizzes가 없어서 새로운 데이터를 가져옵니다.");
          const response = await fetch("/example.json");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const jsonData = await response.json();

          // 난이도별 문제 분류
          const levels = {
            "super-difficult": [],
            difficult: [],
            intermediate: [],
            easy: [],
          };

          // 각 난이도별로 문제를 그룹화
          Object.keys(jsonData).forEach((level) => {
            jsonData[level].forEach((item) => {
              levels[level].push({ ...item, level });
            });
          });

          // 난이도별 문제 선택 로직 (최소 1개, 최대 5개)
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

          // 전체 문제 중에서 10개를 무작위로 선택
          selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

          // 선택된 퀴즈의 답변도 섞기
          selectedQuestions.forEach((quiz) => {
            quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
          });

          // 상태 및 로컬 스토리지에 저장
          setSelectedQuizzes(selectedQuestions);
          localStorage.setItem("selectedQuizzes", JSON.stringify(selectedQuestions));
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

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
      localStorage.setItem("currentQuestionIndex", newQuestionIndex);
      localStorage.setItem("correctAnswersCount", newCorrectAnswersCount);
      localStorage.setItem("score", newScore);

      // 마지막 문제인지 확인
      if (newQuestionIndex < 10) {
        navigate(
          `/answer?isRight=${isRight}&correctAnswer=${encodeURIComponent(
            correctAnswer
          )}&selectedAnswer=${encodeURIComponent(selectedAnswer)}`
        );
      } else {
        // 퀴즈 완료 시 점수와 총 문제 수를 로컬 스토리지에 저장
        localStorage.setItem("score", newScore);
        localStorage.setItem("totalQuestions", 10); // 총 문제 수 저장

        // 불필요한 데이터만 삭제
        localStorage.removeItem("selectedQuizzes");
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("correctAnswersCount");

        // 로딩 상태 활성화
        setLoading(true);

        // navigate 전에 약간의 지연을 줘서 로딩 상태 관리
        setTimeout(() => {
          setLoading(false); // 로딩 상태 해제
          navigate(`/result`);
        }, 500); // navigate를 지연시켜서 무한 로딩 방지
      }
    },
    [randomQuiz, currentQuestionIndex, correctAnswersCount, score, navigate]
  );

  // 현재 문제의 난이도를 콘솔에 출력
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

  // JSX 반환
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
          <div className={styles.quizText}>{randomQuiz.quiz}</div>
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
