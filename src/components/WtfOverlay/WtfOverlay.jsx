import React from 'react';
import styles from './WtfOverlay.module.css';

const WtfOverlay = () => {
    return (
        <div className={styles.overlay}>
            {/* 큰 WTF 텍스트 */}
            <div className={styles.wtfText}>엄혜영 BABO~~~</div>
            <div className={styles.wtfText}>W T F ???</div>
            <div className={styles.subText}>이게 무슨 일인가요?!</div>
            <div className={styles.rainbowBg}>누군가의 주식처럼 후두둑 날아가는!!!</div>
            {/* 알록달록 RGB 배경 */}
            <div className={styles.rainbowBg}>고대는 연대 떨어지면 가는 데 아닌가요?</div>
        </div>
    );
};

export default WtfOverlay;
