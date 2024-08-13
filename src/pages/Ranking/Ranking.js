import React from 'react';
import styles from './Ranking.module.css';
import chama from './chama.gif';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    return (
        <Layout>
            <div className={styles.poatan}>
                <img className={styles.chama} src={chama} alt="chama" />
            </div>
        </Layout>
    );
};

export default Ranking;
