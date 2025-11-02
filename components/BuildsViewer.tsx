
import React, { useState, useCallback, useRef } from 'react';
import type { Build, Equipment } from '../types';
import { mockBuilds } from '../data/mockData';
import { analyzeBuildWithGemini } from '../services/geminiService';
import { useI18n } from '../i18n/I18nContext';
import { UploadIcon } from './icons';

const RarityBadge: React.FC<{ rarity: Equipment['rarity'] }> = ({ rarity }) => {
    const colors = {
        'Common': 'border-gray-500/50 text-gray-300',
        'Uncommon': 'border-green-500/50 text-green-400',
        'Rare': 'border-blue-500/50 text-blue-400',
        'Epic': 'border-purple-500/50 text-purple-400',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border bg-black/20 ${colors[rarity]}`}>
            {rarity}
        </span>
    );
};

const EquipmentStats: React.FC<{ stats: Equipment['stats'] }> = ({ stats }) => {
    const { t } = useI18n();
    if (!stats) return null;

    return (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
            {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-dashed border-[var(--color-border)]">
                    <span className="text-[var(--color-text-secondary)]">{t(`builds.stats.${key}`)}</span>
                    <span className="font-mono text-[var(--color-text-primary)]">{value}</span>
                </div>
            ))}
        </div>
    );
};

const BuildsViewer: React.FC = () => {
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(mockBuilds[0]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contributionMessage, setContributionMessage] = useState('');
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyzeBuild = useCallback(async () => {
    if (!selectedBuild) return;
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const equipmentList = selectedBuild.equipment
        .map(e => `- ${e.name} (${e.type}, ${e.rarity}): ${e.description}`)
        .join('\n');

      const prompt = `
        ${t('gemini.prompt.intro')}

        **${t('gemini.prompt.buildName')}** ${selectedBuild.name}
        **${t('gemini.prompt.raider')}** ${selectedBuild.raider}
        **${t('gemini.prompt.description')}** ${selectedBuild.description}

        **${t('gemini.prompt.equipment')}**
        ${equipmentList}

        ${t('gemini.prompt.analysisHeader')}
      `;

      const result = await analyzeBuildWithGemini(prompt);
      setAnalysis(result);
    } catch (err) {
      setError(t('builds.analysisError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBuild, t]);
  
  const handleContributeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        console.log(`--- Community Contribution: Builds ---`);
        console.log(`Filename: ${file.name}`);
        console.log('Content:', content);
        console.log(`------------------------------------`);
        setContributionMessage(t('builds.contributeSuccess', { filename: file.name }));
        setTimeout(() => setContributionMessage(''), 4000);
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };


  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-[var(--color-primary)] font-orbitron">{t('builds.title')}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="terminal-card p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] font-orbitron">{t('builds.availableBuilds')}</h3>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json,.txt" className="hidden" />
                <button onClick={handleContributeClick} title={t('builds.contributeButton')} className="p-2 rounded-md bg-gray-600/50 hover:bg-gray-500/50 transition-colors">
                    <UploadIcon className="h-5 w-5 text-gray-300" />
                </button>
            </div>
            {contributionMessage && <div className="text-sm text-green-300 mb-2 text-center bg-gray-800/50 p-2 rounded-md">{contributionMessage}</div>}
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {mockBuilds.map(build => (
                <li key={build.id}>
                  <button
                    onClick={() => setSelectedBuild(build)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-l-4
                      ${selectedBuild?.id === build.id
                        ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]'
                        : 'bg-black/20 border-transparent hover:bg-black/40'
                      }`}
                  >
                    <p className={`font-bold ${selectedBuild?.id === build.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>{build.name}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{build.raider}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          {selectedBuild ? (
            <div className="space-y-6">
              <div className="terminal-card p-4 rounded-lg">
                <h3 className="text-2xl font-bold font-orbitron text-[var(--color-primary)]">{selectedBuild.name}</h3>
                <p className="text-md text-[var(--color-text-secondary)] font-semibold">{selectedBuild.raider}</p>
                <p className="mt-2 text-[var(--color-text-primary)]">{selectedBuild.description}</p>
              </div>
              <div className="terminal-card p-4 rounded-lg">
                <h4 className="text-xl font-semibold mb-3 font-orbitron">{t('builds.equipmentLoadout')}</h4>
                <div className="space-y-4">
                  {selectedBuild.equipment.map(item => (
                    <div key={item.id} className="p-3 bg-black/20 rounded-md">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-[var(--color-text-primary)]">{item.name}</p>
                        <RarityBadge rarity={item.rarity} />
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{item.description}</p>
                      <EquipmentStats stats={item.stats} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="terminal-card p-4 rounded-lg">
                <button
                  onClick={handleAnalyzeBuild}
                  disabled={isLoading}
                  className="w-full bg-[var(--color-primary)] hover:bg-white text-black font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-[var(--color-secondary)] disabled:cursor-not-allowed font-orbitron"
                >
                  {isLoading ? t('builds.analyzingButton') : t('builds.analyzeButton')}
                </button>
                {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                {analysis && (
                  <div className="mt-4 prose prose-invert prose-sm max-w-none prose-p:text-[var(--color-text-primary)] prose-headings:text-[var(--color-primary)] prose-strong:text-white">
                     <h4 className="text-xl font-semibold mb-3 font-orbitron">{t('builds.analysisTitle')}</h4>
                     <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full terminal-card p-8 rounded-lg">
              <p className="text-[var(--color-text-secondary)]">{t('builds.selectBuildPrompt')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildsViewer;
