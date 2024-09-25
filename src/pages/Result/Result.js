import React, { useEffect, useState } from 'react';
import styles from './Result.module.css';
import level from './level.png';
import lvlImgFrame from './lvlImgFrame.png';

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
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Result = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(10); // 기본값을 10으로 설정
    const [loading, setLoading] = useState(true);

    // 점수에 따른 레벨 데이터 배열
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
        {
            img: lvlImg6,
            name: '루이 브라유',
            quote: '지식은 불을 켜고 어둠을 몰아낸다.',
            description: '점자 발명가',
        },
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
            description: 'DEC의 설립자',
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
        // 로컬 스토리지에서 점수와 총 문제 수를 가져옵니다.
        const storedScore = localStorage.getItem('score');
        const storedTotalQuestions = localStorage.getItem('totalQuestions');

        // 점수와 총 문제 수를 상태로 설정합니다.
        setScore(storedScore ? parseInt(storedScore, 10) : 0);
        setTotalQuestions(storedTotalQuestions ? parseInt(storedTotalQuestions, 10) : 10);

        setLoading(false);
    }, []);

    const handleClickNext = () => {
        navigate('/ranking');
    };

    // 점수에 따라 levelIndex를 결정하는 함수
    const determineLevelIndex = (score) => {
        const maxScore = totalQuestions * 10; // 각 문제당 10점
        const percentage = (score / maxScore) * 100;

        if (percentage >= 90) return 0; // 피터 드러커
        else if (percentage >= 80) return 1; // 소크라테스
        else if (percentage >= 70) return 2; // 조지프 러디어드 키플링
        else if (percentage >= 60) return 3; // 칼 세이건
        else if (percentage >= 50) return 4; // 탈레스
        else if (percentage >= 40) return 5; // 루이 브라유
        else if (percentage >= 30) return 6; // 로버트 메톤
        else if (percentage >= 20) return 7; // 케니스 올센
        else if (percentage >= 10) return 8; // 스티브 발머
        else return 9; // 찰스 듀얼
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // 점수에 따라 레벨 인덱스를 결정하고 해당 데이터를 가져옵니다.
    const levelIndex = determineLevelIndex(score);
    const levelData = levels[levelIndex];

    if (!levelData) {
        return <div>Error: Level data not found.</div>;
    }

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
                    <img className={styles.lvlImgFrame} src={lvlImgFrame} alt="" />
                    <img className={styles.lvlImg} src={levelData.img} alt={levelData.name} />
                </div>
                <div className={styles.expShow}>
                    <div className={styles.expShowDiv}>
                        <div className={styles.exp} alt="exp" />
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
