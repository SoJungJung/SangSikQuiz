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

  // ---------------------------------------
  // 뒤로가기 제한
  // ---------------------------------------
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

  // ---------------------------------------
  // 로딩, 에러 상태
  // ---------------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------------
  // 로컬 스토리지에서 상태 복원
  // ---------------------------------------
  const [selectedQuizzes, setSelectedQuizzes] = useState(() => {
    const stored = localStorage.getItem("selectedQuizzes");
    return stored ? JSON.parse(stored) : [];
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

  // ---------------------------------------
  // 현재 보여줄 문제
  // ---------------------------------------
  const randomQuiz = useMemo(() => {
    if (selectedQuizzes && selectedQuizzes.length > 0 && currentQuestionIndex < selectedQuizzes.length) {
      return selectedQuizzes[currentQuestionIndex];
    }
    return null;
  }, [selectedQuizzes, currentQuestionIndex]);

  // ---------------------------------------
  // 1) 최초 로딩 시 쓰는 함수 (index/점수 0으로 초기화)
  // ---------------------------------------
  const fetchInitialQuizData = useCallback(async () => {
    console.log("[fetchInitialQuizData] 새 퀴즈 데이터를 불러옵니다. (index=0으로 초기화)");

    try {
      setLoading(true);
      const response = await fetch("/example.json");
      if (!response.ok) throw new Error("Network response was not ok");

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

      // 최종 10문제
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

      // 정답 배열도 랜덤
      selectedQuestions.forEach((quiz) => {
        quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
      });

      // 상태 & 로컬스토리지 저장
      setSelectedQuizzes(selectedQuestions);
      localStorage.setItem("selectedQuizzes", JSON.stringify(selectedQuestions));

      setCurrentQuestionIndex(0);
      setCorrectAnswersCount(0);
      setScore(0);

      localStorage.setItem("currentQuestionIndex", 0);
      localStorage.setItem("correctAnswersCount", 0);
      localStorage.setItem("score", 0);

      setLoading(false);
      console.log("[fetchInitialQuizData] 로딩 완료. 0번 문제부터 시작합니다.");
    } catch (err) {
      console.error("[fetchInitialQuizData] 에러:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // ---------------------------------------
  // 2) 중간에 데이터 꼬였을 때 쓰는 함수 (index/점수 유지)
  // ---------------------------------------
  const reFetchQuizData = useCallback(async () => {
    console.log("[reFetchQuizData] 중간에 퀴즈가 꼬여 새 데이터를 받아옵니다. 현재 index:", currentQuestionIndex);
    try {
      setLoading(true);
      const response = await fetch("/example.json");
      if (!response.ok) throw new Error("Network response was not ok");

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

      // 난이도별 랜덤 문제
      const selectRandomQuestions = (questions, min, max) => {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        return questions.sort(() => Math.random() - 0.5).slice(0, count);
      };

      let newQuizzes = [
        ...selectRandomQuestions(levels["super-difficult"], 1, 5),
        ...selectRandomQuestions(levels["difficult"], 1, 5),
        ...selectRandomQuestions(levels["intermediate"], 1, 5),
        ...selectRandomQuestions(levels["easy"], 1, 5),
      ];

      newQuizzes = newQuizzes.sort(() => Math.random() - 0.5).slice(0, 10);

      newQuizzes.forEach((quiz) => {
        quiz.answer = quiz.answer.sort(() => Math.random() - 0.5);
      });

      // **index, 점수는 유지**. 문제 배열만 갈아끼움.
      setSelectedQuizzes(newQuizzes);
      localStorage.setItem("selectedQuizzes", JSON.stringify(newQuizzes));

      // currentQuestionIndex, correctAnswersCount, score는 그대로.
      // 다만, 만약 index가 10 이상이면 이미 다 푼 상태이므로 곧바로 결과로 갈 수도 있음.
      console.log("[reFetchQuizData] 새 퀴즈 데이터 로딩 완료. 문제를 이어서 진행합니다.");
      setLoading(false);
    } catch (err) {
      console.error("[reFetchQuizData] 에러:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [currentQuestionIndex]);

  // ---------------------------------------
  // 컴포넌트 마운트/업데이트 시점에서 처리
  // ---------------------------------------
  useEffect(() => {
    // 1) 처음 시작할 때 selectedQuizzes가 없으면 새로 로드
    if (!selectedQuizzes || selectedQuizzes.length === 0) {
      console.log("[Quiz.js] 초기 퀴즈 데이터가 없어 fetchInitialQuizData 실행");
      fetchInitialQuizData();
    } else {
      // 이미 데이터가 있다면 로딩 풀기
      setLoading(false);
      console.log("[Quiz.js] 기존 퀴즈 데이터 존재. index:", currentQuestionIndex);
    }
  }, [selectedQuizzes, fetchInitialQuizData, currentQuestionIndex]);

  /**
   * 사용자가 정답을 클릭했을 때:
   * - 항상 Answer 페이지로 이동
   * - Answer.js가 "10문제 끝났으면 result로" 판단
   */
  const handleDivClick = useCallback(
    (answer, isRight) => {
      if (!randomQuiz) {
        console.log("[handleDivClick] randomQuiz가 없어서 클릭을 무시합니다.");
        return;
      }

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

      console.log(
        `[handleDivClick] ${currentQuestionIndex + 1}번째 문제 풀었음. ` +
          `정답 여부=${isRight}, 다음 index=${newQuestionIndex}`
      );

      // **무조건** /answer로 이동
      navigate(
        `/answer?isRight=${isRight}&correctAnswer=${encodeURIComponent(
          correctAnswer
        )}&selectedAnswer=${encodeURIComponent(selectedAnswer)}`
      );
    },
    [randomQuiz, currentQuestionIndex, correctAnswersCount, score, navigate]
  );

  // ---------------------------------------
  // 3) randomQuiz가 없는데 selectedQuizzes는 있는데(=꼬임) => 리페치
  // ---------------------------------------
  useEffect(() => {
    // 이미 로딩 중이면(=spinner 띄우는 중이면) 굳이 중복 호출 X
    if (!loading && !randomQuiz && selectedQuizzes.length > 0) {
      console.log("[Quiz.js] randomQuiz가 없지만 selectedQuizzes가 있음 -> reFetchQuizData 수행");
      reFetchQuizData();
    }
  }, [randomQuiz, selectedQuizzes, loading, reFetchQuizData]);

  // ---------------------------------------
  // UI 렌더링
  // ---------------------------------------
  // 로딩 중이면 스피너 표시
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

  // 혹시나 randomQuiz가 아직도 없을 경우 -> 다시 스피너 + 로그 (reFetchQuizData가 진행 중일 것)
  if (!randomQuiz) {
    console.log("[Quiz.js] 현재 randomQuiz가 없습니다. 재시도 중...");
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
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

        {/* 문제 영역 */}
        <div className={styles.quizShow}>
          <QuizText text={randomQuiz?.quiz || "퀴즈 데이터를 불러오는 중..."} />
        </div>

        {/* 보기(정답) 영역 */}
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

        {/* 진행 상황 (1/10) */}
        <div className={styles.numShow}>{currentQuestionIndex + 1} / 10</div>

        <div className={styles.bottomdiv}>
          <img className={styles.leftbottom} src={leftbottom} alt="Left Bottom" />
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;
