import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Quiz from './pages/Quiz/Quiz';
import Answer from './pages/Answer/Answer';
import Result from './pages/Result/Result';
import Ranking from './pages/Ranking/Ranking';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/answer" element={<Answer />} />
                    <Route path="/result" element={<Result />} />
                    <Route path="/ranking" element={<Ranking />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
