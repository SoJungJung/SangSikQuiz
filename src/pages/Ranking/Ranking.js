import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import styles from './Ranking.module.css';
import Layout from '../../Layout';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    const navigate = useNavigate();
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nickname, setNickname] = useState('');

    // 공유 모달
    const [showProvocation, setShowProvocation] = useState(false);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // 재도전
    const handleRetry = () => {
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('correctAnswersCount');
        localStorage.removeItem('score');
        localStorage.removeItem('totalQuestions');
        localStorage.removeItem('selectedQuizzes');
        // nickname 유지하려면 안 지움

        navigate('/');
    };

    // 실제 공유 로직
    const doShare = async () => {
        try {
            const canvas = await html2canvas(document.body, { scale: 0.5 });
            const imageData = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'ranking-result.png';
            link.click();

            if (navigator.share) {
                const response = await fetch(imageData);
                const blob = await response.blob();
                const file = new File([blob], 'ranking-result.png', { type: 'image/png' });

                await navigator.share({
                    title: '랭킹 결과 공유',
                    text: '내 랭킹 결과를 확인해봐!',
                    files: [file],
                });
            } else {
                alert(
                    '이 브라우저는 Web Share API를 지원하지 않습니다.\n' +
                        '이미지를 저장했습니다. 인스타그램 앱을 열어 스토리에 수동으로 업로드해주세요!'
                );
            }
        } catch (error) {
            console.error('스크린샷 저장 및 공유 중 오류:', error);
            alert('결과 저장에 실패했습니다. 스크린샷이 저장되었는지 확인 후 수동으로 업로드해주세요.');
        }
    };

    // 공유 버튼 클릭 → 도발 모달
    const handleShare = () => {
        setShowProvocation(true);
    };

    // 랭킹 fetch
    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/ranking`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const jsonData = await response.json();
                const userNickname = localStorage.getItem('nickname');
                setNickname(userNickname);

                const updatedRankings = jsonData.rankings || [];

                // 여기서 userPosition 대신 nickname만 세팅
                // 굳이 userPosition을 찾지 않아도 됨
                // if needed, you can find user rank or check if top 100

                setRankings(updatedRankings);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRankings();
    }, [BACKEND_URL]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }
    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <Layout>
            <div className={styles.container}>
                {/* 도발 모달 */}
                {showProvocation && (
                    <div className={styles.provocationOverlay}>
                        <div className={styles.provocationBox}>
                            <h3>결과 공유 안 하면...</h3>
                            <p>
                                이대로 석열이처럼 포기해버리는 건가요?
                                <br />
                                <b>“아니 뭐... {nickname || '익명'} 정도면 자기 점수 공개하기 쪽팔리다는 건가?”</b>
                                <br />
                                <small>이대로 숨기기 없기!</small>
                            </p>
                            <div className={styles.provocationActions}>
                                <button className={styles.provoCancel} onClick={() => setShowProvocation(false)}>
                                    에이 귀찮아 관두자
                                </button>
                                <button
                                    className={styles.provoConfirm}
                                    onClick={() => {
                                        setShowProvocation(false);
                                        doShare();
                                    }}
                                >
                                    그래도 난 자랑한다!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 상단 박스: 닉네임만 출력 */}
                <div className={styles.title}>{nickname ? `안녕하세요, ${nickname}님!` : '너 자신을 알라'}</div>

                {/* 랭킹 박스 */}
                <div className={styles.rankBox}>
                    <div className={styles.rankTitle}>RANK</div>
                    <div className={styles.rankList}>
                        {rankings.map((rank, index) => {
                            // 만약 rank.nickname === nickname이면 highlight
                            const isCurrentUser = rank.nickname === nickname;

                            return (
                                <div
                                    key={`${rank.nickname}-${index}`}
                                    className={`${styles.rankItem} ${isCurrentUser ? styles.highlightMe : ''}`}
                                >
                                    {rank.position}. {rank.nickname} - {rank.high_score}점
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 하단 버튼들 */}
                <div className={styles.shareButtons}>
                    <button className={styles.retryButton} onClick={handleRetry}>
                        RETRY?
                    </button>
                    <button className={styles.instagramButton} onClick={handleShare}>
                        <span className={styles.instagramIcon}></span> 결과 저장 & 공유하기
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Ranking;
