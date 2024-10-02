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

    const handleRetry = () => {
        // 로컬 스토리지 초기화
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('correctAnswersCount');
        localStorage.removeItem('score');
        localStorage.removeItem('totalQuestions');

        // 퀴즈 첫 페이지로 이동
        navigate('/');
    };

    useEffect(() => {
        // 백엔드에서 랭킹 데이터 가져오기
        fetch('/api/ranking')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('네트워크 응답에 문제가 있습니다');
                }
                return response.json();
            })
            .then((jsonData) => {
                // 로컬 스토리지에서 닉네임과 점수 가져오기
                const nickname = localStorage.getItem('nickname');
                const score = parseInt(localStorage.getItem('score'), 10);

                setNickname(nickname);

                let updatedRankings = jsonData.rankings;

                if (nickname && !isNaN(score)) {
                    // 사용자 랭킹 찾기
                    const userRank = updatedRankings.find(
                        (rank) => rank.nickname === nickname && rank.high_score === score
                    );
                    if (userRank) {
                        setUserPosition(userRank.position);
                    } else {
                        // 사용자 랭킹이 없을 경우 순위를 계산합니다.
                        updatedRankings.forEach((rank, index) => {
                            rank.position = index + 1;
                            if (rank.nickname === nickname && rank.high_score === score) {
                                setUserPosition(rank.position);
                            }
                        });
                    }
                }

                setRankings(updatedRankings);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
                    {nickname ? `너 자신을 알라 ${nickname}, 너는 딸랑 ${userPosition}등` : '너 자신을 알라'}
                </div>
                <div className={styles.rankBox}>
                    <div className={styles.rankTitle}>RANK</div>
                    <div className={styles.rankList}>
                        {rankings.map((rank) => (
                            <div key={rank.position} className={styles.rankItem}>
                                {rank.position}. {rank.nickname} - {rank.high_score}점
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
