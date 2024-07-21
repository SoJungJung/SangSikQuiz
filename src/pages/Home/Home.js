import React from "react";
import lefttop from "./lefttop.png";
import "./Home.module.css";
import Layout from "../../Layout";

const Home = () => {
  return (
    <Layout>
      <img className="lefttop" src={lefttop} />
      <div>ㅋㅋ</div>
      <input placeholder="닉네임을 입력하세요" />
    </Layout>
  );
};

export default Home;
