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
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 상태 추가
  const [selectedQuizzes, setSelectedQuizzes] = useState([]); // 선택된 퀴즈 상태
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 문제 인덱스
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // 정답 개수
  const [score, setScore] = useState(0); // 점수 상태
  const [notLoading, setNotLoading] = useState(false); // 퀴즈 완료 여부

  //1. 뒤로가기 제한 기능 구현
  const maxBackPress = 3; // 뒤로가기 조롱 메시지 출력 조건
  const backPressCountRef = useRef(0); // useState가 아닌 useRef로 선언하여 불필요한 렌더링 없이 횟수 저장(변수 역할)
  useEffect(() => {
    const preventGoBack = () => {
      backPressCountRef.current += 1;

      if (backPressCountRef.current >= maxBackPress) {
        alert("뒤로가기 계엄령! 한번만 더 하면 너 진짜 박정희야!");
      } else {
        alert("뒤로가기 금지! 금지!! 금.지.!!!");
      }
      // HTML5의 History API를 사용해 현재 페이지의 상태를 조작하는 코드
      // 현재 URL을 다시 히스토리에 추가하여 다시 돌아오도록 함.
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    // addEventListener는 DOM 요소에 특정 이벤트가 발생했을 때 실행될 **이벤트 핸들러(콜백 함수)**를 등록하는 메서드입니다.
    // 이를 통해 브라우저에서 발생하는 다양한 사용자 이벤트(클릭, 키 입력, 스크롤 등) 또는 시스템 이벤트를 감지하고 처리할 수 있습니다.
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  useEffect(() => {
    // 비동기로 퀴즈 데이터를 가져오는 함수
    const fetchQuizData = async () => {
      try {
        const response = await fetch("/example.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();

        // 난이도별로 데이터를 정리
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

        // 난이도별로 랜덤한 문제를 선택
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

        // 답변도 랜덤으로 섞음
        selectedQuestions.forEach((quiz) => {
          quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
        });

        setSelectedQuizzes(selectedQuestions);
        localStorage.setItem("selectedQuizzes", JSON.stringify(selectedQuestions));
        setIsDataLoaded(true); // 데이터 로드 완료 상태 설정
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const randomQuiz = isDataLoaded && selectedQuizzes[currentQuestionIndex]; // 데이터가 로드되었는지 확인 후 현재 문제 설정

  // 사용자가 선택지를 클릭했을 때 실행되는 함수
  const handleDivClick = useCallback(
    (answer, isRight) => {
      if (!randomQuiz) return; // randomQuiz가 없으면 아무것도 실행하지 않음

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
        // 마지막 문제가 아니면 결과 화면으로 이동
        navigate(
          `/answer?isRight=${isRight}&correctAnswer=${encodeURIComponent(
            correctAnswer
          )}&selectedAnswer=${encodeURIComponent(selectedAnswer)}`
        );
      } else {
        setNotLoading(true); // 마지막 문제일 경우 퀴즈 완료 상태로 변경
      }
    },
    [randomQuiz, currentQuestionIndex, correctAnswersCount, score, navigate]
  );

  useEffect(() => {
    // 퀴즈가 완료되었을 때 결과 페이지로 이동
    if (notLoading) {
      navigate(`/result`);
    }
  }, [notLoading, navigate]);

  // 로딩 상태 처리
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러 발생 시 처리
  if (error) {
    return <div>Error: {error}</div>;
  }

  // 데이터가 아직 로드되지 않은 경우 처리
  if (!isDataLoaded) {
    return <div>Quiz data is loading...</div>;
  }

  // randomQuiz가 없는 경우 처리
  if (!randomQuiz) {
    return <div>No quiz available.</div>;
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
