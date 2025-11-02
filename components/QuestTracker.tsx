
import React, { useState, useRef } from 'react';
import type { Quest } from '../types';
import { mockQuests } from '../data/mockData';
import { useI18n } from '../i18n/I18nContext';
import { UploadIcon } from './icons';

const FactionBadge: React.FC<{ faction: Quest['faction'] }> = ({ faction }) => {
  const colors = {
    'Iron Assembly': 'border-red-500/50 text-red-400',
    'Free Rangers': 'border-green-500/50 text-green-400',
    'ARC': 'border-cyan-500/50 text-cyan-400',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border bg-black/20 ${colors[faction]}`}>
      {faction}
    </span>
  );
};

const QuestCard: React.FC<{ quest: Quest; onToggle: (id: number) => void }> = ({ quest, onToggle }) => {
    const { t } = useI18n();
    const isComplete = quest.status === 'complete';

    return (
        <div className={`p-4 rounded-lg terminal-card transition-all duration-300 ${isComplete ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className={`text-lg font-bold ${isComplete ? 'text-[var(--color-text-secondary)] line-through' : 'text-[var(--color-primary)]'}`}>{quest.title}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{quest.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
                    <FactionBadge faction={quest.faction} />
                    <button onClick={() => onToggle(quest.id)} className={`mt-2 text-sm font-bold py-1 px-3 rounded-full transition-colors ${isComplete ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'}`}>
                        {isComplete ? t('quests.undoButton') : t('quests.completeButton')}
                    </button>
                </div>
            </div>
            {!isComplete && (
                <div className="mt-4 border-t border-[var(--color-border)] pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h5 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">{t('quests.objectives')}</h5>
                        <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] space-y-1">
                            {quest.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">{t('quests.rewards')}</h5>
                        <ul className="list-disc list-inside text-sm text-[var(--color-primary)] space-y-1">
                            {quest.rewards.map((rew, i) => <li key={i}>{rew}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};


const QuestTracker: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [contributionMessage, setContributionMessage] = useState('');
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncMessage('');

    setTimeout(() => {
      setQuests(prevQuests => {
        const firstIncompleteIndex = prevQuests.findIndex(q => q.status === 'incomplete');
        if (firstIncompleteIndex !== -1) {
          const newQuests = [...prevQuests];
          newQuests[firstIncompleteIndex] = { ...newQuests[firstIncompleteIndex], status: 'complete' };
          setSyncMessage(t('quests.syncSuccess'));
          return newQuests;
        }
        setSyncMessage(t('quests.syncAllComplete'));
        return prevQuests;
      });
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 3000); // Clear message after 3s
    }, 2000);
  };
  
  const handleContributeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        console.log(`--- Community Contribution: Quests ---`);
        console.log(`Filename: ${file.name}`);
        console.log('Content:', content);
        console.log(`------------------------------------`);
        setContributionMessage(t('quests.contributeSuccess', { filename: file.name }));
        setTimeout(() => setContributionMessage(''), 4000);
      };
      reader.readAsText(file);
    }
    event.target.value = ''; // Reset file input
  };


  const toggleQuestStatus = (id: number) => {
    setQuests(quests.map(q => 
      q.id === id ? { ...q, status: q.status === 'complete' ? 'incomplete' : 'complete' } : q
    ));
  };

  const completedQuests = quests.filter(q => q.status === 'complete');
  const incompleteQuests = quests.filter(q => q.status === 'incomplete');

  return (
    <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-[var(--color-primary)] font-orbitron text-center sm:text-left">{t('quests.title')}</h2>
            <div className="relative flex flex-col sm:flex-row gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json,.txt" className="hidden" />
                <button
                    onClick={handleContributeClick}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-orbitron"
                >
                    <UploadIcon className="h-5 w-5" />
                    <span>{t('quests.contributeButton')}</span>
                </button>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-orbitron"
                >
                    {isSyncing && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    <span>{isSyncing ? t('quests.syncingButton') : t('quests.syncButton')}</span>
                </button>
                <div className="absolute top-full mt-2 text-sm right-0 w-max text-right">
                  {syncMessage && <div className="text-purple-300 bg-gray-800 px-3 py-1 rounded-md shadow-lg">{syncMessage}</div>}
                  {contributionMessage && <div className="text-green-300 bg-gray-800 px-3 py-1 rounded-md shadow-lg mt-1">{contributionMessage}</div>}
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-[var(--color-text-primary)] border-b-2 border-[var(--color-primary)] pb-2 font-orbitron">{t('quests.inProgress')}</h3>
                <div className="space-y-4">
                    {incompleteQuests.map(quest => (
                       <QuestCard key={quest.id} quest={quest} onToggle={toggleQuestStatus} />
                    ))}
                     {incompleteQuests.length === 0 && <p className="text-[var(--color-text-secondary)] italic mt-4">{t('quests.noQuests')}</p>}
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-[var(--color-text-primary)] border-b-2 border-[var(--color-border)] pb-2 font-orbitron">{t('quests.completed')}</h3>
                <div className="space-y-4">
                    {completedQuests.map(quest => (
                        <QuestCard key={quest.id} quest={quest} onToggle={toggleQuestStatus} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default QuestTracker;
