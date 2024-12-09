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
                const canvas = await html2canvas(rankRef.current);
                const imageData = canvas.toDataURL('image/png');

                // 로컬에 이미지 저장
                const link = document.createElement('a');
                link.href = imageData;
                link.download = 'ranking-result.png';
                link.click();

                // Web Share API
                if (navigator.share) {
                    const response = await fetch(imageData);
                    const blob = await response.blob();
                    const file = new File([blob], 'ranking-result.png', { type: 'image/png' });

                    await navigator.share({
                        title: '랭킹 결과 공유',
                        text: '내 랭킹 결과를 확인해봐!',
                        files: [file],
                    });
                } else {
                    alert('이 브라우저는 Web Share API를 지원하지 않습니다.');
                }
            } catch (error) {
                console.error('스크린샷 저장 및 공유 중 오류:', error);
                alert('결과 저장에 실패했습니다.');
            }
        }
    };

    const handleInstagramShare = async () => {
        // 인스타그램 스토리 공유는 공식적으로 웹 API가 없는 상태.
        // 다만 모바일 환경, 인스타그램 앱 설치된 경우 instagram-stories://share 호출 가능.
        // backgroundImage를 Base64로 설정하는 경우:
        if (rankRef.current) {
            try {
                const canvas = await html2canvas(rankRef.current);
                const imageData = canvas.toDataURL('image/png');
                const base64Data = imageData.split(',')[1];

                // Instagram Stories에 공유 시도
                // 공식 문서 참고: https://developers.facebook.com/docs/instagram/sharing-to-stories
                // iOS/Android에서만 작동. 웹 환경에서 동작 불가.
                const formData = new FormData();
                formData.append('com.instagram.sharedSticker.backgroundImage', base64Data);

                // Instagram 앱 호출 (모바일 전용, 앱 설치 필요)
                window.location.href = 'instagram-stories://share';

                // 만약 이를 처리하려면 인스타그램 앱 안에서 처리되어야 하며, 실패 시 대안 메세지:
                setTimeout(() => {
                    alert('인스타그램 앱으로 공유를 시도했습니다. 앱이 설치되어 있고 모바일 환경에서만 작동합니다.');
                }, 1000);
            } catch (error) {
                console.error('인스타그램 공유 오류:', error);
                alert('인스타그램 공유에 실패했습니다.');
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
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.title}>
                    {nickname ? `너 자신을 알라 ${nickname}, 너는 ${userPosition}등` : '너 자신을 알라'}
                </div>
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

                <div className={styles.shareButtons}>
                    <button className={styles.retryButton} onClick={handleRetry}>
                        RETRY?
                    </button>
                    <button className={styles.shareButton} onClick={handleSaveAndShare}>
                        결과 저장 & 공유하기
                    </button>
                    <button className={styles.instagramButton} onClick={handleInstagramShare}>
                        <span className={styles.instagramIcon}></span> 인스타그램 스토리에 공유
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Ranking;
