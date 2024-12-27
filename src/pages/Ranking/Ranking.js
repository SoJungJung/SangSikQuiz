import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import styles from "./Ranking.module.css";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";

const Ranking = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [nickname, setNickname] = useState("");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleRetry = () => {
    // *** 변경점: 필요한 키만 지우거나, 정말 새로 시작하려면 clear() 가능.
    // localStorage.clear();
    // 대신 필요한 키만 지우는 경우:
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("correctAnswersCount");
    localStorage.removeItem("score");
    localStorage.removeItem("totalQuestions");
    localStorage.removeItem("selectedQuizzes");
    // nickname을 계속 유지하고 싶다면 주석 처리 or 지우지 않아도 됨.
    // localStorage.removeItem('nickname');

    navigate("/");
  };

  const handleShare = async () => {
    try {
      // 전체 페이지 스크린샷 (축소)
      const canvas = await html2canvas(document.body, { scale: 0.5 });
      const imageData = canvas.toDataURL("image/png");

      // 로컬에 이미지 저장
      const link = document.createElement("a");
      link.href = imageData;
      link.download = "ranking-result.png";
      link.click();

      // Web Share API 시도
      if (navigator.share) {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const file = new File([blob], "ranking-result.png", { type: "image/png" });

        await navigator.share({
          title: "랭킹 결과 공유",
          text: "내 랭킹 결과를 확인해봐!",
          files: [file],
        });
      } else {
        alert(
          "이 브라우저는 Web Share API를 지원하지 않습니다.\n이미지를 저장했습니다. " +
            "인스타그램 앱을 열어 스토리에 수동으로 업로드해주세요!"
        );
      }
    } catch (error) {
      console.error("스크린샷 저장 및 공유 중 오류:", error);
      alert("결과 저장에 실패했습니다. 스크린샷이 저장되었는지 확인 후 수동으로 업로드해주세요.");
    }
  };

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/ranking`);
        if (!response.ok) throw new Error("Network response was not ok");

        const jsonData = await response.json();
        const userNickname = localStorage.getItem("nickname");
        const score = parseInt(localStorage.getItem("score"), 10);
        let highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;

        setNickname(userNickname);

        //서버로부터 받아온 랭킹 데이터 활용
        let updatedRankings = jsonData.rankings || [];
        // *** 변경점: rank.high_score 로 맞춰주기
        // userHighScore = Math.max(현재 점수, 기존 highScore)
        const userHighScore = Math.max(score, highScore);

        // 사용자 순위 찾기
        if (userNickname) {
          const userRank = updatedRankings.find(
            (rank) => rank.nickname === userNickname && rank.high_score === userHighScore
          );

          if (userRank) {
            setUserPosition(userRank.position);
          } else {
            setUserPosition(null);
          }
        }

        setRankings(updatedRankings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRankings();
  }, [BACKEND_URL]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.title}>
          {nickname ? `너 자신을 알라 ${nickname}, 너는 ${userPosition}등` : "너 자신을 알라"}
        </div>
        <div className={styles.rankBox}>
          <div className={styles.rankTitle}>RANK</div>
          <div className={styles.rankList}>
            {rankings.map((rank, index) => (
              <div key={`${rank.nickname}-${index}`} className={styles.rankItem}>
                {/* *** rank.high_score 로 변경 */}
                {userRank.position}. {rank.nickname} - {rank.high_score}점
              </div>
            ))}
          </div>
        </div>

        <div className={styles.shareButtons}>
          <button className={styles.retryButton} onClick={handleRetry}>
            RETRY?
          </button>
          <button className={styles.instagramButton} onClick={handleShare}>
            <span className={styles.instagramIcon}></span> 결과 저장 & 공유하기
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Ranking;
