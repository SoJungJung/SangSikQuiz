import React, { useEffect, useRef } from "react";
import styles from "./Quiz.module.css";

const QuizText = ({ text }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const adjustFontSize = () => {
      const element = textRef.current;
      if (element) {
        let fontSize = 25; // 기본 폰트 크기
        while (element.scrollHeight > element.clientHeight && fontSize > 16) {
          fontSize -= 1; // 글자 크기를 줄임
          element.style.fontSize = `${fontSize}px`;
        }
      }
    };
    adjustFontSize();
  }, [text]);

  return (
    <div
      ref={textRef}
      style={{
        maxHeight: "150px",
        overflow: "hidden",
        textAlign: "center",
        wordWrap: "break-word",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
      }}
      className={styles.quizText}
    >
      {text}
    </div>
  );
};

export default QuizText;
