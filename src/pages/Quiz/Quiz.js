import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Quiz.module.css";
import lefttop from "./lefttop.png";
import leftbottom from "./leftbottom.png";
import righttop from "./righttop.png";
import point from "./point.png";
import Layout from "../../Layout";
import QuizText from "./QuizText";

const Quiz = () => {
  const QuizAnswer = ({ text }) => {
    const textRef = useRef(null);

    useEffect(() => {
      const adjustFontSize = () => {
        const element = textRef.current;
        if (element) {
          let fontSize = 24; // 기본 폰트 크기
          while (element.scrollHeight > element.clientHeight && fontSize > 10) {
            fontSize -= 1; // 글자 크기 줄이기
            element.style.fontSize = `${fontSize}px`;
          }
        }
      };
      adjustFontSize();
    }, [text]);

    return (
      <div className="rectangleText" ref={textRef}>
        {text}
      </div>
    );
  };

  const navigate = useNavigate();

  // 로딩, 에러, 뒤로가기 제한 관련 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maxBackPress = 3;
  const backPressCountRef = useRef(0);

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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    return parseInt(localStorage.getItem("currentQuestionIndex"), 10) || 0;
  });

  const [correctAnswersCount, setCorrectAnswersCount] = useState(() => {
    return parseInt(localStorage.getItem("correctAnswersCount"), 10) || 0;
  });

  const [score, setScore] = useState(() => {
    return parseInt(localStorage.getItem("score"), 10) || 0;
  });

  // 현재 풀 문제
  const randomQuiz = useMemo(() => {
    if (selectedQuizzes.length > 0 && currentQuestionIndex < selectedQuizzes.length) {
      return selectedQuizzes[currentQuestionIndex];
    }
    return null;
  }, [selectedQuizzes, currentQuestionIndex]);

  // 퀴즈 데이터를 가져오는 함수
  const fetchQuizData = useCallback(async () => {
    try {
      const response = await fetch("/example.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      // 난이도별 분류
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

      // 난이도별 랜덤 문제 고르기
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

      // 최종 10문제로 추려냄
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

      // 각 문제 answer도 랜덤 섞기
      selectedQuestions.forEach((quiz) => {
        quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
      });

      // 상태 & 로컬스토리지에 저장
      setSelectedQuizzes(selectedQuestions);
      localStorage.setItem("selectedQuizzes", JSON.stringify(selectedQuestions));

      // 기존 인덱스, 점수 정보 리셋
      setCurrentQuestionIndex(0);
      setCorrectAnswersCount(0);
      setScore(0);

      localStorage.setItem("currentQuestionIndex", 0);
      localStorage.setItem("correctAnswersCount", 0);
      localStorage.setItem("score", 0);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // 최초 로딩 시 & selectedQuizzes가 비었을 때만 fetch
  useEffect(() => {
    if (!selectedQuizzes || selectedQuizzes.length === 0) {
      // 새 퀴즈 데이터 로드
      fetchQuizData();
    } else {
      setLoading(false);
    }
  }, [selectedQuizzes, fetchQuizData]);

  /**
   * 사용자가 답을 클릭하면,
   *  - 항상 Answer 페이지로 이동
   *  - Answer 페이지에서 마지막 문제인지 체크 후 /result 또는 /quiz로 보냄
   */
  const handleDivClick = useCallback(
    (answer, isRight) => {
      if (!randomQuiz) return;

      const correctAnswer = randomQuiz.answer.find((ans) => ans.TRUE)?.TRUE;
      const selectedAnswer = answer.TRUE || answer.FALSE;

      const newQuestionIndex = currentQuestionIndex + 1;
      const newCorrectAnswersCount = isRight ? correctAnswersCount + 1 : correctAnswersCount;
      const newScore = isRight ? score + 10 : score;

      // 상태/스토리지 업데이트
      setCurrentQuestionIndex(newQuestionIndex);
      setCorrectAnswersCount(newCorrectAnswersCount);
      setScore(newScore);

      localStorage.setItem("currentQuestionIndex", newQuestionIndex);
      localStorage.setItem("correctAnswersCount", newCorrectAnswersCount);
      localStorage.setItem("score", newScore);

      // **무조건** Answer 페이지로 이동
      navigate(
        `/answer?isRight=${isRight}&correctAnswer=${encodeURIComponent(
          correctAnswer
        )}&selectedAnswer=${encodeURIComponent(selectedAnswer)}`
      );
    },
    [randomQuiz, currentQuestionIndex, correctAnswersCount, score, navigate]
  );

  // 만약 randomQuiz가 null인데, selectedQuizzes도 비어있지 않다면 로컬스토리지가 꼬인 상황
  // => 로컬스토리지를 초기화하고 다시 fetch
  useEffect(() => {
    if (!randomQuiz && selectedQuizzes.length > 0 && !loading) {
      // 이미 퀴즈가 있는데 현재 Quiz를 못 뽑아오는 상황이면 꼬임으로 간주
      localStorage.removeItem("selectedQuizzes");
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("correctAnswersCount");
      localStorage.removeItem("score");

      setSelectedQuizzes([]);
      setCurrentQuestionIndex(0);
      setCorrectAnswersCount(0);
      setScore(0);

      // 다시 로딩 시도
      setLoading(true);
      fetchQuizData();
    }
  }, [randomQuiz, selectedQuizzes, loading, fetchQuizData]);

  // 로딩 중엔 스피너(회전 아이콘)를 표시
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  // 퀴즈가 없으면 (fetch 성공했는데 10문제 분배 실패 등)
  if (!randomQuiz) {
    // selectedQuizzes가 0개라면 또다시 로딩 중이거나 초기화 상황
    if (selectedQuizzes.length === 0) {
      return (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
        </div>
      );
    }
    // 꼬였을 경우도 잠깐 No quiz data available이 뜰 수 있으나
    // 위의 useEffect에서 다시 fetchQuizData()를 실행하고 있으므로
    // 잠깐 뒤 새 퀴즈가 로딩되어 화면이 바뀔 것임
    return <div>No quiz data available ... 로딩 중...</div>;
  }

  // 실제 퀴즈 UI
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
          <QuizText text={randomQuiz?.quiz || "퀴즈 데이터를 불러오는 중..."} />{" "}
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
                <QuizAnswer text={ans.TRUE || ans.FALSE} />
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
