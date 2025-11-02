
import React, { useState } from 'react';
import type { Quest } from '../types';
import { mockQuests } from '../data/mockData';

const FactionBadge: React.FC<{ faction: Quest['faction'] }> = ({ faction }) => {
  const colors = {
    'Iron Assembly': 'bg-red-500/20 text-red-400 border-red-500',
    'Free Rangers': 'bg-green-500/20 text-green-400 border-green-500',
    'ARC': 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[faction]}`}>
      {faction}
    </span>
  );
};

const QuestTracker: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(mockQuests);

  const toggleQuestStatus = (id: number) => {
    setQuests(quests.map(q => 
      q.id === id ? { ...q, status: q.status === 'complete' ? 'incomplete' : 'complete' } : q
    ));
  };

  const completedQuests = quests.filter(q => q.status === 'complete');
  const incompleteQuests = quests.filter(q => q.status === 'incomplete');

  return (
    <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-cyan-300 font-orbitron">Quest Log</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-200 border-b-2 border-cyan-500 pb-2 font-orbitron">In Progress</h3>
                <div className="space-y-4">
                    {incompleteQuests.map(quest => (
                        <div key={quest.id} className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg border border-gray-700 hover:border-cyan-500 transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-bold text-cyan-400">{quest.title}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{quest.description}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <FactionBadge faction={quest.faction} />
                                  <button onClick={() => toggleQuestStatus(quest.id)} className="mt-2 text-sm bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded-full transition-colors">
                                      Complete
                                  </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-200 border-b-2 border-gray-600 pb-2 font-orbitron">Completed</h3>
                <div className="space-y-4">
                    {completedQuests.map(quest => (
                        <div key={quest.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 opacity-60">
                            <div className="flex justify-between items-start">
                               <div>
                                    <h4 className="text-lg font-bold text-gray-500 line-through">{quest.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{quest.description}</p>
                                </div>
                               <div className="flex flex-col items-end space-y-2">
                                  <FactionBadge faction={quest.faction} />
                                  <button onClick={() => toggleQuestStatus(quest.id)} className="mt-2 text-sm bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded-full transition-colors">
                                      Undo
                                  </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default QuestTracker;
