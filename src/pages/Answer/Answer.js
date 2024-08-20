import React from 'react';
import styles from './Answer.module.css';
import crtAsw from './crtAsw.png';
import rstImgFrame from './rstImgFrame.png';
import rstImgCorrect from './rstImgCorrect.png';
import rstImgWrong from './rstImgWrong.png';
import wrgAsw from './wrgAsw.png';
import Layout from '../../Layout';
import { useLocation } from 'react-router-dom';

const Answer = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isRight = queryParams.get('isRight') === 'true';

    return (
        <Layout>
            <div className={`${styles.container} ${isRight ? styles.greenBackground : styles.redBackground}`}>
                <div className={styles.topdiv}>
                    <div className={styles.crtAswShow}>
                        <img className={styles.crtAsw} src={crtAsw} alt="Correct Answer Icon" />
                        <div className={styles.crtAswShowText}>정답: 오토 폰 비스마르크</div>
                    </div>
                </div>
                <div className={styles.rstImgShow}>
                    <img className={styles.rstImgFrame} src={rstImgFrame} alt="Image Frame" />
                    <img className={styles.rstImg} src={isRight ? rstImgCorrect : rstImgWrong} alt="Result Image" />
                </div>
                {!isRight && (
                    <div className={styles.wrgAswShow}>
                        <div className={styles.wrgAswDiv}>
                            <img className={styles.wrgAsw} src={wrgAsw} alt="Wrong Answer Icon" />
                            <div className={styles.wrgAswShowText}>당신의 답: 헬무트 폰 몰트케</div>
                        </div>
                    </div>
                )}
                <div className={styles.quoteShow}>
                    <div className={styles.quoteText}>
                        {isRight
                            ? '"지식은 우리가 가지고 있는 유일한 영원한 자산이다." - 소크라테스'
                            : '"무지는 지혜의 반대다." - 플라톤'}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Answer;
