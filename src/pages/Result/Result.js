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

  //데이터가져오기
  useEffect(() => {
    const storedScore = localStorage.getItem("score");
    const storedTotalQuestions = localStorage.getItem("totalQuestions");

    setScore(storedScore ? parseInt(storedScore, 10) : 0);
    setTotalQuestions(storedTotalQuestions ? parseInt(storedTotalQuestions, 10) : 10);

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

    const submitScore = async () => {
      const device_id = localStorage.getItem("device_id") || generateDeviceId();
      const nickname = localStorage.getItem("nickname") || "익명";
      const score = parseInt(localStorage.getItem("score"), 10) || 0;

      try {
        const response = await fetch(`${BACKEND_URL}/api/submit-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_id, score, nickname }),
        });

        if (!response.ok) {
          throw new Error("점수 제출에 실패했습니다.");
        }

        const data = await response.json();
        console.log("점수 제출 성공:", data);
      } catch (error) {
        console.error("점수 제출 중 오류 발생:", error);
      }
    };

    submitScore();
  }, [BACKEND_URL]);

  const generateDeviceId = () => {
    const uuid = uuidv4();
    localStorage.setItem("device_id", uuid);
    return uuid;
  };

  const handleClickNext = () => {
    navigate("/ranking");
  };

  const determineLevelIndex = (score) => {
    const maxScore = totalQuestions * 10;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 90) return 0;
    else if (percentage >= 80) return 1;
    else if (percentage >= 70) return 2;
    else if (percentage >= 60) return 3;
    else if (percentage >= 50) return 4;
    else if (percentage >= 40) return 5;
    else if (percentage >= 30) return 6;
    else if (percentage >= 20) return 7;
    else if (percentage >= 10) return 8;
    else return 9;
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const levelIndex = determineLevelIndex(score);
  const levelData = levels[levelIndex];

  if (!levelData) {
    return <div className={styles.error}>Error: Level data not found.</div>;
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
