import { useDarkMode } from './hooks/useDarkMode';
import { useBoard } from './hooks/useBoard';
import { BoardProvider } from './context/BoardContext';
import { Header } from './components/layout/Header';
import { Board } from './components/board/Board';

function App() {
  const { theme, toggleTheme } = useDarkMode();
  const { state, dispatch } = useBoard();

  return (
    <BoardProvider state={state} dispatch={dispatch}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="max-w-screen-2xl mx-auto px-6 py-6">
          <Board />
        </main>
      </div>
    </BoardProvider>
  );
}

export default App;
