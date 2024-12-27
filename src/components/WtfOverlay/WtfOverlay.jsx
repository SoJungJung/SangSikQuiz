import React from 'react';
import styles from './WtfOverlay.module.css';

const WtfOverlay = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.rainbowBg}></div>

            {/* 크게 보이는 주 텍스트들 */}
            <div className={`${styles.wtfText1} ${styles.flyOutDelay}`}>랭킹으로 넘어갑니다!!!!</div>
            <div className={`${styles.wtfText2} ${styles.flyOutDelay}`}>W T F ???</div>
            <div className={`${styles.wtfText3} ${styles.flyOutDelay}`}>W T F ???</div>
            <div className={`${styles.wtfText4} ${styles.flyOutDelay}`}>W T F ???</div>
            <div className={`${styles.wtfText5} ${styles.flyOutDelay}`}>W T F ???</div>

            <div className={`${styles.subText1} ${styles.flyOutDelayLong}`}>이게 무슨 일인가요?!</div>
            <div className={`${styles.subText2} ${styles.flyOutDelayLong}`}>
                고대는 서울대 떨어지면 가는 데 아닌가요?
            </div>
        </div>
    );
};

export default WtfOverlay;
