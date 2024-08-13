import React from 'react';
import styles from './Answer.module.css';
import crtAsw from './crtAsw.png';
import rstImgFrame from './rstImgFrame.png';
import rstImg from './rstImg.png';
import wrgAsw from './wrgAsw.png';
import quote from './quote.png';
import Layout from '../../Layout';

const Answer = () => {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <div className={styles.crtAswShow}>
                        <img className={styles.crtAsw} src={crtAsw} alt="crtAsw" />
                        <div className={styles.crtAswShowText}>정답: 오토 폰 비스마르크</div>
                    </div>
                </div>
                <div className={styles.rstImgShow}>
                    <img className={styles.rstImgFrame} src={rstImgFrame} alt="rstImgFrame" />
                    <img className={styles.rstImg} src={rstImg} alt="rstImg" />
                </div>
                <div className={styles.wrgAswShow}>
                    <div className={styles.wrgAswDiv}>
                        <img className={styles.wrgAsw} src={wrgAsw} alt="wrgAsw" />
                        <div className={styles.wrgAswShowText}>당신의 답: 헬무트 몰트게</div>
                    </div>
                </div>
                <div className={styles.quoteShow}>
                    <div>
                        <div className={styles.quoteText}>"무지는 지혜의 반대다." - 플라톤</div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Answer;
