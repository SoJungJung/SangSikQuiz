import React, { useEffect, useState } from "react";
import styles from "./Ranking.module.css";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";

const Ranking = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [nickname, setNickname] = useState("");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleRetry = () => {
    // 로컬 스토리지 초기화
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("correctAnswersCount");
    localStorage.removeItem("score");
    localStorage.removeItem("totalQuestions");
    localStorage.removeItem("selectedQuizzes");
    // 유저가 이전 닉네임으로 재시도할 수 있도록 nickname은 삭제하지 않음

    // 퀴즈 첫 페이지로 이동
    navigate("/");
  };

  useEffect(() => {
    // 랭킹 데이터 fetch
    fetch(`${BACKEND_URL}/api/ranking`) // 경로 수정
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        // Get the nickname and score from Local Storage
        const nickname = localStorage.getItem("nickname");
        const score = parseInt(localStorage.getItem("score"), 10);

        let highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
        setNickname(nickname);

        let updatedRankings = jsonData.rankings;

        if (nickname && !isNaN(score)) {
          if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
          }

          updatedRankings = [...updatedRankings, { position: updatedRankings.length + 1, nickname, score: highScore }];

          updatedRankings.sort((a, b) => b.score - a.score);

          updatedRankings.forEach((rank, index) => {
            rank.position = index + 1;
          });

          const userRank = updatedRankings.find((rank) => rank.nickname === nickname && rank.score === highScore);
          setUserPosition(userRank ? userRank.position : null);
        }

        setRankings(updatedRankings);
        setLoading(false); // 로딩 상태 해제
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // 로딩 상태 해제
      });
  }, [BACKEND_URL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.title}>
          {nickname ? `너 자신을 알라 ${nickname}, 너는 딸랑 ${userPosition}등` : "너 자신을 알라"}
        </div>
        <div className={styles.rankBox}>
          <div className={styles.rankTitle}>RANK</div>
          <div className={styles.rankList}>
            {rankings.map((rank, index) => (
              <div key={`${rank.nickname}-${index}`} className={styles.rankItem}>
                {rank.position}. {rank.nickname} - {rank.score || rank.high_score}점
              </div>
            ))}
          </div>
        </div>
        <button className={styles.retryButton} onClick={handleRetry}>
          RETRY?
        </button>
      </div>
    </Layout>
  );
};

export default Ranking;
