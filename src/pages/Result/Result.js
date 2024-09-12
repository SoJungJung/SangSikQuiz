import React, { useEffect, useState } from 'react';
import styles from './Result.module.css';
import level from './level.png';
import lvlImgFrame from './lvlImgFrame.png';

// Importing 10 different images
import lvlImg1 from './lvlImg1.jpg';
import lvlImg2 from './lvlImg2.jpg';
import lvlImg3 from './lvlImg3.jpg';
import lvlImg4 from './lvlImg4.jpg';
import lvlImg5 from './lvlImg5.jpg';
import lvlImg6 from './lvlImg6.jpg';
import lvlImg7 from './lvlImg7.jpg';
import lvlImg8 from './lvlImg8.jpg';
import lvlImg9 from './lvlImg9.jpg';
import lvlImg10 from './lvlImg10.jpg';

import exp from './exp.png';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Result = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    // Array for images, names, and quotes based on the score ranges
    const levels = [
        {
            img: lvlImg1,
            name: '피터 드러커',
            quote: '미래를 예측하는 가장 좋은 방법은 그것을 창조하는 것이다.',
            description: '경영학의 아버지',
        },
        {
            img: lvlImg2,
            name: '소크라테스',
            quote: '무지는 무서운 병이다. 지식은 우리가 가진 최고의 자산이다.',
            description: '고대 그리스 철학자',
        },
        {
            img: lvlImg3,
            name: '조지프 러디어드 키플링',
            quote: '무지를 두려워 말라. 거짓 지식을 두려워하라.',
            description: '노벨 문학상 수상자',
        },
        {
            img: lvlImg4,
            name: '칼 세이건',
            quote: '과학은 우리가 알고 있는 모든 것을 바꿀 것이다.',
            description: '천문학자, 우주학자',
        },
        {
            img: lvlImg5,
            name: '탈레스',
            quote: '지식은 말하는 사람이 아니라, 듣는 사람의 것이다.',
            description: '고대 그리스 수학자, 철학자',
        },
        { img: lvlImg6, name: '루이 브라유', quote: '지식은 불을 켜고 어둠을 몰아낸다.', description: '점자 발명가' },
        {
            img: lvlImg7,
            name: '로버트 메톤',
            quote: '1929년 이후, 주식시장은 더 이상 대폭락이 일어나지 않을 것이다.',
            description: '미국 경제학자',
        },
        {
            img: lvlImg8,
            name: '케니스 올센',
            quote: '개인이 자기 집에 컴퓨터를 가질 이유가 없다.',
            description: 'IBM의 설립자',
        },
        {
            img: lvlImg9,
            name: '스티브 발머',
            quote: '아이폰은 기업 시장에서 전혀 성공하지 못할 것이다.',
            description: '마이크로소프트의 전 CEO',
        },
        {
            img: lvlImg10,
            name: '찰스 듀얼',
            quote: '발명될 만한 것은 이미 다 발명되었다.',
            description: '미국 특허청장',
        },
    ];

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

    // Determine the level based on the score
    const levelIndex = determineLevelIndex(score); // Update here with the new function
    const levelData = levels[levelIndex];

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <div className={styles.levelShow}>
                        <img className={styles.level} src={level} alt="level" />
                        <div className={styles.levelShowText}>당신의 점수는 {score}점입니다.</div>
                    </div>
                </div>
                <div className={styles.lvlImgShow}>
                    <img className={styles.lvlImgFrame} src={lvlImgFrame} alt="lvlImgFrame" />
                    <img className={styles.lvlImg} src={levelData.img} alt="level image" />
                </div>
                <div className={styles.expShow}>
                    <div className={styles.expShowDiv}>
                        <img className={styles.exp} src={exp} alt="exp" />
                        <div className={styles.expShowText}>{levelData.name} 수준</div>
                    </div>
                </div>
                <div className={styles.expQuoteShow}>
                    <div>
                        <div className={styles.expQuoteText}>"{levelData.quote}"</div>
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
