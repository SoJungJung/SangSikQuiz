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
        navigate('/');
    };

    useEffect(() => {
        // Fetch the rankings JSON data
        fetch('/rankings.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData) => {
                // Get the nickname and score from Local Storage
                const nickname = localStorage.getItem('nickname');
                const score = parseInt(localStorage.getItem('score'), 10);
                setNickname(nickname);

                let updatedRankings = jsonData.rankings;

                if (nickname && !isNaN(score)) {
                    // Add the current user's score to the rankings
                    updatedRankings = [...updatedRankings, { position: updatedRankings.length + 1, nickname, score }];

                    // Sort the rankings based on score in descending order
                    updatedRankings.sort((a, b) => b.score - a.score);

                    // Update the position of each rank
                    updatedRankings.forEach((rank, index) => {
                        rank.position = index + 1;
                    });

                    // Find the user's position
                    const userRank = updatedRankings.find((rank) => rank.nickname === nickname && rank.score === score);
                    setUserPosition(userRank.position);
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
                    {nickname ? `너 자신을 알라 ${nickname} 너는 딸랑 ${userPosition}등` : '너 자신을 알라'}
                </div>
                <div className={styles.rankBox}>
                    <div className={styles.rankTitle}>RANK</div>
                    <div className={styles.rankList}>
                        {rankings.map((rank) => (
                            <div key={rank.position} className={styles.rankItem}>
                                {rank.position}. {rank.nickname} - {rank.score}점
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
