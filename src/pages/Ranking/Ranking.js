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

  // 사용자 닉네임/순위
  const [userPosition, setUserPosition] = useState(null);
  const [nickname, setNickname] = useState("");

  // 도발 모달(컨펌) 표시 여부
  const [showProvocation, setShowProvocation] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // 재도전 버튼
  const handleRetry = () => {
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("correctAnswersCount");
    localStorage.removeItem("score");
    localStorage.removeItem("totalQuestions");
    localStorage.removeItem("selectedQuizzes");
    // nickname은 유지(원하면 지워도 됨)

    navigate("/");
  };

  // 실제 공유 로직 (스크린샷 + 저장 + Web Share)
  const doShare = async () => {
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

  // 공유 버튼 클릭 시: 먼저 도발 모달 표시
  const handleShare = () => {
    setShowProvocation(true);
  };

  // 랭킹 데이터 fetch
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/ranking`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        const userNickname = localStorage.getItem("nickname");
        const score = parseInt(localStorage.getItem("score"), 10);
        let highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;

        setNickname(userNickname);

        // 랭킹 데이터
        let updatedRankings = jsonData.rankings || [];

        // 사용자 순위 찾기
        if (userNickname) {
          const userHighScore = Math.max(score, highScore);
          const userRank = updatedRankings.find(
            (rank) => rank.nickname === userNickname && rank.high_score === userHighScore
          );

          if (userRank) {
            setUserPosition(userRank.position);
          } else {
            setUserPosition(null); // top100 밖이거나 없는 경우
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

  // 뒤로가기 구현
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className={styles.container}>
        {/* 도발/컨펌 모달 */}
        {showProvocation && (
          <div className={styles.provocationOverlay}>
            <div className={styles.provocationBox}>
              <h3>결과 공유 안 하면...</h3>
              <p>
                이대로 석열이처럼 포기해버리는 건가요?
                <br />
                <b>“아니 뭐... {nickname || "익명"} 정도면 자기 점수 공개하기 쪽팔리다는 건가?”</b>
                <br />
                <small>이대로 숨기기 없기!</small>
              </p>
              <div className={styles.provocationActions}>
                <button className={styles.provoCancel} onClick={() => setShowProvocation(false)}>
                  에이 귀찮아 관두자
                </button>
                <button
                  className={styles.provoConfirm}
                  onClick={() => {
                    setShowProvocation(false);
                    doShare(); // 실제 공유 실행
                  }}
                >
                  그래도 난 자랑한다!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 뒤로가기 버튼 */}
        <span className={styles.backButton} onClick={handleGoHome} style={{ fontSize: "1.5rem", cursor: "pointer" }}>
          ←
        </span>

        <br />
        <br />

        {/* 
                  닉네임이 있으면 "너 자신을 알라 {nickname}, 너는 {userPosition}등"
                  만약 userPosition이 없으면(랭킹 100등 밖) "너는 100등 밖등"
                  닉네임이 없다면 기본 문구만
                */}
        <div className={styles.title}>
          {nickname ? `너 자신을 알라 ${nickname}, 너는 ${userPosition || "100등 밖"}등` : "너 자신을 알라"}
        </div>

        <div className={styles.rankBox}>
          <div className={styles.rankTitle}>RANK</div>
          <div className={styles.rankList}>
            {rankings.map((rank, index) => {
              // 하이라이트 여부
              const isCurrentUser = rank.nickname === nickname;

              return (
                <div
                  key={`${rank.nickname}-${index}`}
                  // 만약 현재 유저라면 highlight 클래스 추가
                  className={`${styles.rankItem} ${isCurrentUser ? styles.highlightMe : ""}`}
                >
                  {rank.position}. {rank.nickname} - {rank.high_score}점
                </div>
              );
            })}
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
