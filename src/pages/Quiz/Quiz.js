import React from 'react';
import styles from './Quiz.module.css';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import point from './point.png';
import quiz from './quiz.png';
import awr1 from './awr1.png';
import awr2 from './awr2.png';
import awr3 from './awr3.png';
import num from './num.png';
import Layout from '../../Layout';

const Quiz = () => {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <img className={styles.lefttop} src={lefttop} alt="Left Top" />
                    <img className={styles.righttop} src={righttop} alt="Right Top" />
                </div>
                <div className={styles.pointShow}>
                    <div>
                        <img className={styles.point} src={point} alt="point" />
                        <div className={styles.pointText}>점수:</div>
                    </div>
                </div>
                <div className={styles.quizShow}>
                    <div>
                        <img className={styles.quiz} src={quiz} alt="quiz" />
                        <div className={styles.quizText}>문제: 독일 통일 전쟁을 이끈 프로이센의 총리는 누구입니까?</div>
                    </div>
                </div>
                <div className={styles.answerShow}>
                    <div>
                        <img className={styles.awr1} src={awr1} alt="Answer 1" />
                        <div className={styles.awr}>정답입니다</div>
                        <img className={styles.awr2} src={awr2} alt="Answer 2" />
                        <div className={styles.awr}>정답입니다</div>
                        <img className={styles.awr3} src={awr3} alt="Answer 3" />
                        <div className={styles.awr}>정답입니다</div>
                    </div>
                </div>
                <div className={styles.numshow}>
                    <div>
                        <img className={styles.num} src={num} alt="num" />
                        <div className={styles.numText}>10/10</div>
                    </div>
                </div>
                <div className={styles.bottomdiv}>
                    <img className={styles.leftbottom} src={leftbottom} alt="Left Bottom" />
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;
