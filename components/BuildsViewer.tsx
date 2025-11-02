
import React, { useState, useCallback } from 'react';
import type { Build, Equipment } from '../types';
import { mockBuilds } from '../data/mockData';
import { analyzeBuildWithGemini } from '../services/geminiService';

const RarityBadge: React.FC<{ rarity: Equipment['rarity'] }> = ({ rarity }) => {
    const colors = {
        'Common': 'bg-gray-500/20 text-gray-300 border-gray-500',
        'Uncommon': 'bg-green-500/20 text-green-400 border-green-500',
        'Rare': 'bg-blue-500/20 text-blue-400 border-blue-500',
        'Epic': 'bg-purple-500/20 text-purple-400 border-purple-500',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[rarity]}`}>
            {rarity}
        </span>
    );
};

const BuildsViewer: React.FC = () => {
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(mockBuilds[0]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeBuild = useCallback(async () => {
    if (!selectedBuild) return;
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const result = await analyzeBuildWithGemini(selectedBuild);
      setAnalysis(result);
    } catch (err) {
      // Fix: Updated error message to be more generic and not mention API keys, as per guidelines.
      setError('Failed to get analysis from Gemini. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBuild]);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-300 font-orbitron">Builds Database</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-200 font-orbitron">Available Builds</h3>
            <ul className="space-y-2">
              {mockBuilds.map(build => (
                <li key={build.id}>
                  <button
                    onClick={() => {
                        setSelectedBuild(build);
                        setAnalysis('');
                        setError(null);
                    }}
                    className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                      selectedBuild?.id === build.id ? 'bg-cyan-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span className="font-bold">{build.name}</span>
                    <span className="text-sm text-gray-400 block">{build.class}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          {selectedBuild ? (
            <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg border border-gray-700 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 font-orbitron">{selectedBuild.name}</h3>
                <p className="text-gray-400">{selectedBuild.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-200 font-orbitron">Equipment Loadout</h4>
                <div className="space-y-4">
                  {selectedBuild.equipment.map(item => (
                    <div key={item.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-600">
                      <div className="flex justify-between items-center">
                          <p className="font-bold">{item.name} <span className="text-sm text-gray-500">({item.type})</span></p>
                          <RarityBadge rarity={item.rarity} />
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-700 pt-6">
                 <button 
                    onClick={handleAnalyzeBuild} 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-orbitron"
                  >
                     {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    <span>{isLoading ? 'Analyzing...' : 'Get Gemini Analysis'}</span>
                  </button>
                  {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                  {analysis && (
                    <div className="mt-4 p-4 bg-gray-900/70 rounded-lg border border-indigo-500">
                      <h4 className="text-lg font-semibold mb-2 text-indigo-300 font-orbitron">Gemini Build Analysis</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p>
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-800 bg-opacity-70 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400">Select a build to see details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildsViewer;