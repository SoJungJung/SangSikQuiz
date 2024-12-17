import React, { useEffect, useState } from 'react';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import trump from './trump.png';
import otto from './otto.png';
import duce from './duce.png';
import cartoon from './cartoon.png';
import cartoon2 from './cartoon2.png';
import audio1 from './audio1.mp3';
import audio2 from './audio2.mp3';
import audio3 from './audio3.mp3';
import gigaDolphin from './gigaDolphin.png'; // 기가-돌핀 이미지
import styles from './Home.module.css';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio());
    const [backendMessage, setBackendMessage] = useState('Loading...');
    const [showEasterEgg, setShowEasterEgg] = useState(false);

    useEffect(() => {
        fetch('https://port-0-sangsik-backend-m2l7w1ydc2132f7e.sel4.cloudtype.app/api/ping')
            .then((response) => response.json())
            .then((data) => setBackendMessage(data.message))
            .catch((error) => {
                console.error('Error connecting to the backend:', error);
                setBackendMessage('Error connecting to the backend');
            });
    }, []);

    useEffect(() => {
        // 10초 뒤 이스터에그 표시
        const timer = setTimeout(() => {
            setShowEasterEgg(true);
        }, 10000);
        return () => clearTimeout(timer);
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

    const handleClickNext = () => {
        if (nickname.trim() !== '') {
            localStorage.setItem('nickname', nickname);
            localStorage.setItem('score', 0);
            navigate('/quiz');
        } else {
            alert('Please enter a nickname.');
        }
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.topdiv}>
                    <img className={styles.lefttop} src={lefttop} alt="lefttop" />
                    <img className={styles.righttop} src={righttop} alt="righttop" />
                    <div className={styles.title}>
                        싱글벙글
                        <br />
                        상식퀴즈
                    </div>
                </div>
                <div className={styles.middiv}>
                    <div className={styles.mid1}>
                        <img className={styles.otto} src={otto} alt="otto" title="오토 폰 비스마르크" />
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
                        />
                        <button className={styles.start} onClick={handleClickNext}>
                            시작하기
                        </button>
                    </div>
                    <div className={styles.mid3}>
                        <button className={styles.audioButton} onClick={handlePlayAudio}>
                            {isPlaying ? '오디오 정지' : '오디오 재생'}
                        </button>
                        <img className={styles.trump} src={trump} alt="trump" title="도널드 트럼프" />
                    </div>
                </div>
                <div className={styles.blw}>
                    <div className={styles.bottomCartoonDiv}>
                        <img className={styles.cartoon3} src={cartoon} alt="cartoon3" />
                        <div className={styles.cartoonText3}>유익한!</div>
                    </div>
                    <img className={styles.leftbottom} src={leftbottom} alt="leftbottom" />
                    <img className={styles.duce} src={duce} alt="duce" title="베니토 무솔리니" />
                </div>

                {/* 힌트 텍스트 */}
                <div className={styles.hint}>10초 기다리면 뭔가 나올지도...?</div>

                {/* 이스터에그: 10초 후 나타나는 기가-돌핀 */}
                {showEasterEgg && <img className={styles.gigaDolphin} src={gigaDolphin} alt="Giga Dolphin" />}

                {/* 디버깅용 백엔드 메시지 표시 */}
                <div className={styles.backendMessage}>Backend: {backendMessage}</div>
            </div>
        </Layout>
    );
};

export default Home;
