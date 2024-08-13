import React from 'react';
import styles from './Quiz.module.css';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import point from './point.png';
import quiz from './quiz.png';
import awr from './awr.png';
import num from './num.png';
import Layout from '../../Layout';

const Quiz = () => {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <img className={styles.lefttop} src={lefttop} alt="Left Top" />
                    <img className={styles.righttop} src={righttop} alt="Right Top" />
                    <div className={styles.pointShow}>
                        <div>
                            <img className={styles.point} src={point} alt="point" />
                        </div>
                        <div className={styles.pointText}>점수:</div>
                    </div>
                </div>
                <div className={styles.quizShow}>
                    <img className={styles.quiz} src={quiz} alt="quiz" />
                    <div className={styles.quizText}>문제: 독일 통일 전쟁을 이끈 프로이센의 총리는 누구입니까?</div>
                </div>
                <div className={styles.answerShow}>
                    <div className={styles.answerDiv}>
                        <div className={styles.circle}>
                            <div className={styles.circleText}>1</div>
                        </div>
                        <div className={styles.rectangle}>
                            <div className={styles.rectangleText}>정답입니다</div>
                        </div>
                    </div>
                    <div className={styles.answerDiv}>
                        <div className={styles.circle2}>
                            <div className={styles.circleText2}>2</div>
                        </div>
                        <div className={styles.rectangle}>
                            <div className={styles.rectangleText}>정답입니다</div>
                        </div>
                    </div>
                    <div className={styles.answerDiv}>
                        <div className={styles.circle3}>
                            <div className={styles.circleText3}>3</div>
                        </div>
                        <div className={styles.rectangle}>
                            <div className={styles.rectangleText}>정답입니다</div>
                        </div>
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
