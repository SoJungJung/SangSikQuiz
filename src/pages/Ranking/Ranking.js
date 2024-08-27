import React, { useEffect, useState } from 'react';
import styles from './Ranking.module.css';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    const navigate = useNavigate();
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setRankings(jsonData.rankings);
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
                <div className={styles.title}>너 자신을 알라 너는 딸랑 n등</div>
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
