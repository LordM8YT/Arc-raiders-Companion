
import React, { useState } from 'react';
import Header from './components/Header';
import QuestTracker from './components/QuestTracker';
import BuildsViewer from './components/BuildsViewer';
import SkillTreePlanner from './components/SkillTreePlanner';
import Welcome from './components/Welcome';

export type View = 'quests' | 'builds' | 'skilltree';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('skilltree');
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <Welcome onEnter={() => setShowWelcome(false)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'quests':
        return <QuestTracker />;
      case 'builds':
        return <BuildsViewer />;
      case 'skilltree':
        return <SkillTreePlanner />;
      default:
        return <SkillTreePlanner />;
    }
  };

  return (
    <div className="min-h-screen hex-background text-[var(--color-text-primary)]">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;