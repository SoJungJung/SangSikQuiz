import React, { useEffect, useState } from 'react';
import styles from './Result.module.css';
import level from './level.png';
import lvlImgFrame from './lvlImgFrame.png';
import lvlImg from './lvlImg.jpg';
import exp from './exp.png';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Result = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        // Load results from local storage
        const storedScore = localStorage.getItem('score');
        const storedCorrectAnswersCount = localStorage.getItem('correctAnswersCount');
        const storedTotalQuestions = localStorage.getItem('totalQuestions');

        setScore(storedScore ? parseInt(storedScore, 10) : 0);
        setCorrectAnswersCount(storedCorrectAnswersCount ? parseInt(storedCorrectAnswersCount, 10) : 0);
        setTotalQuestions(storedTotalQuestions ? parseInt(storedTotalQuestions, 10) : 0);
    }, []);

    const handleClickNext = () => {
        navigate('/ranking');
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <div className={styles.levelShow}>
                        <img className={styles.level} src={level} alt="level" />
                        <div className={styles.levelShowText}>당신의 점수는 {score}점입니다.</div>
                        <div className={styles.levelShowText}>
                            맞춘 문제 수: {correctAnswersCount}개 / 총 문제 수: {totalQuestions}개
                        </div>
                    </div>
                </div>
                <div className={styles.lvlImgShow}>
                    <img className={styles.lvlImgFrame} src={lvlImgFrame} alt="lvlImgFrame" />
                    <img className={styles.lvlImg} src={lvlImg} alt="lvlImg" />
                </div>
                <div className={styles.expShow}>
                    <div className={styles.expShowDiv}>
                        <img className={styles.exp} src={exp} alt="exp" />
                        <div className={styles.expShowText}>스티브 발머 수준</div>
                    </div>
                </div>
                <div className={styles.expQuoteShow}>
                    <div>
                        <div className={styles.expQuoteText}>"아이폰은 기업 시장에서 전혀 성공하지 못할 것이다."</div>
                        <div className={styles.rnkPrdBox}>
                            <button className={styles.rnkPrd} onClick={handleClickNext}>
                                너의 주제 확인하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Result;
