import React, { useEffect, useState } from "react";
import styles from "./Result.module.css";
import lvlImgFrame from "./lvlImgFrame.png";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Result = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10); // 기본값을 10으로 설정
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // 로컬 스토리지에서 점수와 총 문제 수를 가져옵니다.
    const storedScore = localStorage.getItem("score");
    const storedTotalQuestions = localStorage.getItem("totalQuestions");

    // 점수와 총 문제 수를 상태로 설정합니다.
    setScore(storedScore ? parseInt(storedScore, 10) : 0);
    setTotalQuestions(storedTotalQuestions ? parseInt(storedTotalQuestions, 10) : 10);

    // levels.json 데이터를 fetch로 가져옵니다.
    fetch("/levels.json")
      .then((response) => response.json())
      .then((data) => {
        setLevels(data.levels);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching levels.json:", error);
        setLoading(false);
      });

    // 점수 제출 로직
    const submitScore = async () => {
      const device_id = localStorage.getItem("device_id") || generateDeviceId();
      const nickname = localStorage.getItem("nickname") || "익명";
      const score = storedScore ? parseInt(storedScore, 10) : 0;

      try {
        await fetch(`${BACKEND_URL}/api/submit-score`, {
          // 경로 수정
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_id, score, nickname }),
        });
      } catch (error) {
        console.error("점수 제출 중 오류 발생:", error);
      }
    };

    submitScore();
  }, [BACKEND_URL]);

  // 고유한 디바이스 ID 생성 함수
  const generateDeviceId = () => {
    const uuid = uuidv4();
    localStorage.setItem("device_id", uuid);
    return uuid;
  };

  const handleClickNext = () => {
    navigate("/ranking");
  };

  // 점수에 따라 levelIndex를 결정하는 함수
  const determineLevelIndex = (score) => {
    const maxScore = totalQuestions * 10; // 각 문제당 10점
    const percentage = (score / maxScore) * 100;

    if (percentage >= 90) return 0; // 피터 드러커
    else if (percentage >= 80) return 1; // 소크라테스
    else if (percentage >= 70) return 2; // 조지프 러디어드 키플링
    else if (percentage >= 60) return 3; // 칼 세이건
    else if (percentage >= 50) return 4; // 탈레스
    else if (percentage >= 40) return 5; // 루이 브라유
    else if (percentage >= 30) return 6; // 로버트 메톤
    else if (percentage >= 20) return 7; // 케니스 올센
    else if (percentage >= 10) return 8; // 스티브 발머
    else return 9; // 찰스 듀얼
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // 점수에 따라 레벨 인덱스를 결정하고 해당 데이터를 가져옵니다.
  const levelIndex = determineLevelIndex(score);
  const levelData = levels[levelIndex];

  if (!levelData) {
    return <div>Error: Level data not found.</div>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.topdiv}>
          <div className={styles.levelShowText}>당신의 점수는 {score}점입니다.</div>
        </div>
        <div className={styles.lvlImgShow}>
          <img className={styles.lvlImgFrame} src={lvlImgFrame} alt="" />
          <img className={styles.lvlImg} src={levelData.img} alt={levelData.name} />
        </div>
        <div className={styles.exp}>
          <div className={styles.expShowText}>{levelData.name} 수준</div>
        </div>
        <div className={styles.expQuoteShow}>
          <div>
            <div className={styles.expQuoteText}>"{levelData.quote}"</div>
            <div className={styles.rnkPrdBox}>
              <button className={styles.rnkPrd} onClick={handleClickNext}>
                너의 주제 확인하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Result;
