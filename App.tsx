
import React, { useState } from 'react';
import Header from './components/Header';
import QuestTracker from './components/QuestTracker';
import BuildsViewer from './components/BuildsViewer';
import SkillTreePlanner from './components/SkillTreePlanner';

type View = 'quests' | 'builds' | 'skilltree';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('skilltree');

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
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5')"}}>
      <div className="min-h-screen bg-black bg-opacity-70 backdrop-blur-sm">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
