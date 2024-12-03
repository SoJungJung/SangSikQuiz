import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
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
    const rankRef = useRef(); // 스크린샷 대상 영역 참조

    const handleRetry = () => {
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('correctAnswersCount');
        localStorage.removeItem('score');
        localStorage.removeItem('totalQuestions');
        localStorage.removeItem('selectedQuizzes');

        navigate('/');
    };

    const handleSaveAndShare = async () => {
        if (rankRef.current) {
            try {
                // html2canvas로 스크린샷 생성
                const canvas = await html2canvas(rankRef.current);
                const image = canvas.toDataURL('image/png');

                // 스크린샷 저장
                const link = document.createElement('a');
                link.href = image;
                link.download = 'ranking-result.png';
                link.click();

                // Instagram 공유 (Web Share API 사용)
                if (navigator.share) {
                    await navigator.share({
                        title: '랭킹 결과 공유',
                        text: '내 랭킹 결과를 확인해봐!',
                        files: [new File([image], 'ranking-result.png', { type: 'image/png' })],
                    });
                } else {
                    alert('공유가 지원되지 않는 브라우저입니다.');
                }
            } catch (error) {
                console.error('스크린샷 저장 및 공유 중 오류 발생:', error);
                alert('결과 저장에 실패했습니다.');
            }
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
                {/* 캡처 대상 영역 */}
                <div className={styles.rankBox} ref={rankRef}>
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
                <button className={styles.shareButton} onClick={handleSaveAndShare}>
                    결과 저장하기
                </button>
            </div>
        </Layout>
    );
};

export default Ranking;
