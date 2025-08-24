
import React, { useState, useCallback } from 'react';
import { View, Demo } from './types';
import { DEMOS } from './data/demos';

import WelcomeScreen from './components/WelcomeScreen';
import MainMenu from './components/MainMenu';
import DemoList from './components/DemoList';
import DemoDetail from './components/DemoDetail';
import ConsultationView from './components/ConsultationView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [previousView, setPreviousView] = useState<View>('menu');

  const handleNavigate = useCallback((newView: View, demo: Demo | null) => {
    if(view !== 'demoDetail') {
        setPreviousView(view);
    }
    setView(newView);
    if (demo) {
      setSelectedDemo(demo);
    }
  }, [view]);

  const handleBack = useCallback(() => {
    if (view === 'demoDetail') {
        setView(previousView);
        setSelectedDemo(null);
    } else if (view === 'demoList' || view === 'consultation') {
        setView('menu');
    } else if (view === 'menu') {
        setView('welcome');
    }
  }, [view, previousView]);

  const renderContent = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setView('menu')} />;
      case 'menu':
        return <MainMenu onSelectMode={(mode) => setView(mode)} onBack={handleBack} />;
      case 'demoList':
        return <DemoList demos={DEMOS} onSelectDemo={(demo) => handleNavigate('demoDetail', demo)} onBack={handleBack} />;
      case 'consultation':
        return <ConsultationView onBack={handleBack} onNavigate={handleNavigate} />;
      case 'demoDetail':
        if (!selectedDemo) {
          setView('demoList'); // Failsafe
          return null;
        }
        return <DemoDetail demo={selectedDemo} onBack={handleBack} />;
      default:
        return <WelcomeScreen onStart={() => setView('menu')} />;
    }
  };

  return (
    <main className="h-screen w-screen bg-brand-background text-brand-text-primary font-sans overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15)_0,_transparent_40%)]"></div>
        <div className="relative h-full w-full">
            {renderContent()}
        </div>
    </main>
  );
};

export default App;
