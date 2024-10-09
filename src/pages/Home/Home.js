import React, { useEffect, useState } from 'react';
import lefttop from './lefttop.png';
import leftbottom from './leftbottom.png';
import righttop from './righttop.png';
import trump from './trump.png';
import otto from './otto.png';
import duce from './duce.png';
import cartoon from './cartoon.png';
import cartoon2 from './cartoon2.png';
import audio1 from './audio1.mp3'; // Import your first MP3 file
import audio2 from './audio2.mp3';
import audio3 from './audio3.mp3'; // Import your second MP3 file
import styles from './Home.module.css';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');

    // Function to handle playing random audio on component mount
    useEffect(() => {
        // const audios = [audio1, audio2, audio3]; // Array of audio files
        // const randomAudio = audios[Math.floor(Math.random() * audios.length)]; // Select one randomly
        // const audio = new Audio(randomAudio); // Create new audio object
        // audio.play(); // Play the selected audio
        // // Optional: Clean up when the component unmounts
        // return () => {
        //     audio.pause(); // Pause audio if still playing
        //     audio.currentTime = 0; // Reset the audio to the beginning
        // };
        localStorage.clear();
    }, []);

    const handleClickNext = () => {
        if (nickname.trim() !== '') {
            localStorage.setItem('nickname', nickname); // Save nickname to Local Storage
            localStorage.setItem('score', 0); // Initialize score to 0
            navigate('/quiz'); // Navigate to quiz
        } else {
            alert('Please enter a nickname.'); // Alert if nickname is empty
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
                        <img className={styles.otto} src={otto} alt="otto" />
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
                        <img className={styles.trump} src={trump} alt="trump" />
                    </div>
                </div>
                <div className={styles.blw}>
                    <div className={styles.bottomCartoonDiv}>
                        <img className={styles.cartoon3} src={cartoon} alt="cartoon3" />
                        <div className={styles.cartoonText3}>유익한!</div>
                    </div>
                    <img className={styles.leftbottom} src={leftbottom} alt="leftbottom" />
                    <img className={styles.duce} src={duce} alt="duce" />
                </div>
            </div>
        </Layout>
    );
};

export default Home;
