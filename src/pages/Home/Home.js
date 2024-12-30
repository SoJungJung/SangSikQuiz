import React, { useEffect, useState } from 'react';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import trump from './trump.png';
import trump2 from './trump12.gif';
import trump3 from './trump3.jpg';
import otto from './otto.png';
import duce from './duce.png';
import cartoon from './cartoon.png';
import cartoon2 from './cartoon2.png';
import audio1 from './audio1.mp3';
import audio2 from './audio2.mp3';
import audio3 from './audio3.mp3';
import gigaDolphin from './gigaDolphin.png';
import styles from './Home.module.css';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';
import WtfOverlay from '../../components/WtfOverlay/WtfOverlay'; // WTF 오버레이 추가

const Home = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio());
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const [stormAnimation, setStormAnimation] = useState(false); // 폭풍 애니메이션 상태
    const [showRankingHint, setShowRankingHint] = useState(false);
    const [showWhyBubble, setShowWhyBubble] = useState(false);
    const [showWtfEffect, setShowWtfEffect] = useState(false); // WTF 오버레이 상태

    useEffect(() => {
        const easterEggTimer = setTimeout(() => {
            setShowEasterEgg(true);
        }, 10000);

        const hintTimer = setTimeout(() => {
            setShowRankingHint(true);
        }, 5000);

        return () => {
            clearTimeout(easterEggTimer);
            clearTimeout(hintTimer);
        };
    }, []);

    const handlePlayAudio = () => {
        if (!isPlaying) {
            const audios = [audio1, audio2, audio3];
            const randomAudio = audios[Math.floor(Math.random() * audios.length)];
            audio.src = randomAudio;
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
        }
    };

    // *** 변경점: 시작하기를 누를 때 이전 퀴즈 데이터(localStorage) 제거 후 새 게임
    const handleClickNext = () => {
        if (nickname.trim() !== '') {
            // 이전 퀴즈 관련 데이터 제거
            localStorage.removeItem('selectedQuizzes');
            localStorage.removeItem('currentQuestionIndex');
            localStorage.removeItem('correctAnswersCount');
            localStorage.removeItem('score');
            localStorage.removeItem('totalQuestions');

            // 닉네임과 초기 점수 설정
            localStorage.setItem('nickname', nickname);
            localStorage.setItem('score', 0);

            // Quiz 페이지로 이동
            navigate('/quiz');
        } else {
            alert('닉네임도 입력 안하고 뭐하노. 게이야~');
        }
    };

    const handleOttoClick = () => {
        // 폭풍 애니메이션 시작
        setStormAnimation(true);
        // WTF 효과 시작
        setShowWtfEffect(true);
        // 3초 뒤 랭킹 페이지로 이동
        setTimeout(() => {
            navigate('/ranking');
        }, 3000);
    };

    return (
        <Layout>
            <div className={`${styles.container} ${stormAnimation ? styles.stormingContainer : ''}`}>
                <div className={styles.topdiv}>
                    <img className={styles.lefttop} src={lefttop} alt="lefttop" />
                    <img className={styles.righttop} src={righttop} alt="righttop" />
                    <div className={styles.title}>
                        싱글벙글
                        <br />
                        상식퀴즈
                    </div>
                </div>
                <br />
                <br />
                <div className={styles.middiv}>
                    <div className={styles.mid1}>
                        <div className={styles.ottoWrapper}>
                            <img
                                className={`${styles.otto} ${stormAnimation ? styles.storming : ''}`}
                                src={otto}
                                alt="otto"
                                title="오토 폰 비스마르크"
                                onClick={handleOttoClick}
                                style={{ cursor: 'pointer' }}
                            />
                            {showRankingHint && !stormAnimation && (
                                <div className={styles.rankingHintBubble}>
                                    <div className={styles.rankingHintText}>
                                        "← 누르면 <span className={styles.highlight}>절대</span> 랭킹으로 안 넘어감"
                                    </div>
                                </div>
                            )}
                            {showWhyBubble && <div className={styles.whyBubble}>"왜 눌렀노~"</div>}
                        </div>
                    </div>
                    <div className={styles.mid2}>
                        <div className={styles.cartoonTextBox}>
                            <img className={styles.cartoon2} src={cartoon2} alt="cartoon2" />
                            <div className={styles.cartoonText}>재밌는!</div>
                        </div>
                        <div className={styles.midMargin}></div>
                        <div className={styles.cartoonTextBox}>
                            <img className={styles.cartoon} src={cartoon} alt="cartoon" />
                            <div className={styles.cartoonText2}>어려운!</div>
                        </div>
                        <input
                            className={styles.nicknameInput}
                            placeholder="닉네임을 입력해라"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            disabled={stormAnimation}
                        />
                        <button className={styles.start} onClick={handleClickNext} disabled={stormAnimation}>
                            시작하기
                        </button>
                    </div>
                    <div className={styles.mid3}>
                        <button className={styles.audioButton} onClick={handlePlayAudio} disabled={stormAnimation}>
                            {isPlaying ? '오디오 정지' : '오디오 재생'}
                        </button>
                        <img
                            className={`${styles.trump} ${stormAnimation ? styles.storming : ''}`}
                            src={trump}
                            alt="trump"
                            title="도널드 트럼프"
                        />
                    </div>
                </div>
                <div className={styles.blw}>
                    <div className={styles.bottomCartoonDiv}>
                        <img className={styles.cartoon3} src={cartoon} alt="cartoon3" />
                        <div className={styles.cartoonText3}>유익한!</div>
                    </div>
                    <img className={styles.leftbottom} src={leftbottom} alt="leftbottom" />
                    <img
                        className={`${styles.duce} ${stormAnimation ? styles.storming : ''}`}
                        src={duce}
                        alt="duce"
                        title="베니토 무솔리니"
                    />
                </div>
                <div className={styles.hint}>10초 기다리면 뭔가 나올지도...?</div>
                {showEasterEgg && <img className={styles.gigaDolphin} src={gigaDolphin} alt="Giga Dolphin" />}
                {/* WTF Overlay */}
                {showWtfEffect && <WtfOverlay />}
            </div>
        </Layout>
    );
};

export default Home;
