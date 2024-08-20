import React from 'react';
import styles from './Ranking.module.css';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate('/');
    };

    const ranks = [
        '1. djagpdud',
        '2. qkqh',
        '3. dlwnsgud',
        '2. gorqkqh',
        '5. user5',
        '6. user6',
        '7. user7',
        '8. user8',
        '9. user9',
        '10. user10',
    ];

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.title}>너 자신을 알라 너는 딸랑 n등</div>
                <div className={styles.rankBox}>
                    <div className={styles.rankTitle}>RANK</div>
                    <div className={styles.rankList}>
                        {ranks.map((rank, index) => (
                            <div key={index} className={styles.rankItem}>
                                {rank}
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
