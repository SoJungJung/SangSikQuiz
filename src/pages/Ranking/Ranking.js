import React, { useEffect, useState } from 'react';
import styles from './Ranking.module.css';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    const navigate = useNavigate();
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [nickname, setNickname] = useState('');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const handleRetry = () => {
        // 로컬 스토리지 초기화
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('correctAnswersCount');
        localStorage.removeItem('score');
        localStorage.removeItem('totalQuestions');
        localStorage.removeItem('selectedQuizzes');

        // 퀴즈 첫 페이지로 이동
        navigate('/');
    };

    const handleShare = async () => {
        const shareText = `내 랭킹은 ${userPosition}등! 너도 도전해봐!`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: '랭킹 공유',
                    text: shareText,
                    url: shareUrl,
                });
                alert('공유 성공!');
            } catch (err) {
                console.error('공유 중 오류 발생:', err);
            }
        } else {
            // Web Share API 미지원 시 클립보드 복사
            const fallbackText = `${shareText}\n${shareUrl}`;
            navigator.clipboard.writeText(fallbackText);
            alert('공유 URL이 클립보드에 복사되었습니다!');
        }
    };

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/ranking`);
                if (!response.ok) throw new Error('Network response was not ok');

                const jsonData = await response.json();
                const nickname = localStorage.getItem('nickname');
                const score = parseInt(localStorage.getItem('score'), 10);

                let highScore = parseInt(localStorage.getItem('highScore'), 10) || 0;
                setNickname(nickname);

                let updatedRankings = jsonData.rankings;

                if (nickname && !isNaN(score)) {
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('highScore', highScore);
                    }

                    updatedRankings = [...updatedRankings, { nickname, score: highScore }];
                    updatedRankings.sort((a, b) => b.score - a.score);

                    updatedRankings.forEach((rank, index) => {
                        rank.position = index + 1;
                    });

                    const userRank = updatedRankings.find(
                        (rank) => rank.nickname === nickname && rank.score === highScore
                    );
                    setUserPosition(userRank ? userRank.position : null);
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.title}>
                    {nickname ? `너 자신을 알라 ${nickname}, 너는 ${userPosition}등` : '너 자신을 알라'}
                </div>
                <div className={styles.rankBox}>
                    <div className={styles.rankTitle}>RANK</div>
                    <div className={styles.rankList}>
                        {rankings.map((rank, index) => (
                            <div key={`${rank.nickname}-${index}`} className={styles.rankItem}>
                                {rank.position}. {rank.nickname} - {rank.score}점
                            </div>
                        ))}
                    </div>
                </div>
                <button className={styles.retryButton} onClick={handleRetry}>
                    RETRY?
                </button>
                <button className={styles.shareButton} onClick={handleShare}>
                    인스타그램에 공유하기
                </button>
            </div>
        </Layout>
    );
};

export default Ranking;
