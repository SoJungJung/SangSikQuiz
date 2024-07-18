import React from 'react';
import lefttop from './lefttop.png';
import './Home.module.css';

const Home = () => {
    return (
        <div>
            <img className="lefttop" src={lefttop} />
            <div>ㅋㅋ</div>
            <input placeholder="닉네임을 입력하세요" />
        </div>
    );
};

export default Home;
