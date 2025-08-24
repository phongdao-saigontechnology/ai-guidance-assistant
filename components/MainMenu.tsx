
import React from 'react';
import Icon from './Icon';

interface MainMenuProps {
  onSelectMode: (mode: 'demoList' | 'consultation') => void;
  onBack: () => void;
}

const MenuButton: React.FC<{
  onClick: () => void;
  icon: 'list' | 'chat';
  title: string;
  description: string;
}> = ({ onClick, icon, title, description }) => (
  <button
    onClick={onClick}
    className="relative w-full max-w-md p-8 bg-brand-surface border border-brand-border rounded-2xl text-left hover:border-brand-primary hover:bg-brand-primary/10 transition-all duration-300 transform hover:-translate-y-1 group"
  >
    <div className="flex items-start">
      <div className="p-4 bg-brand-primary/20 rounded-lg mr-6">
        <Icon name={icon} className="w-8 h-8 text-brand-primary" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-brand-text-primary mb-1">{title}</h3>
        <p className="text-brand-text-secondary">{description}</p>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-6 text-brand-text-secondary group-hover:text-brand-primary transition-colors">
        <Icon name="chevron-right" className="w-7 h-7" />
      </div>
    </div>
  </button>
);


const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-slide-in-up">
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors">
            <Icon name="back" className="w-6 h-6" />
            <span>Welcome</span>
        </button>
      <h2 className="text-4xl font-bold text-brand-text-primary mb-4 text-center">How can I help you today?</h2>
      <p className="text-xl text-brand-text-secondary mb-12 text-center">Choose an option below to get started.</p>
      <div className="flex flex-col gap-6 w-full items-center">
        <MenuButton
          onClick={() => onSelectMode('consultation')}
          icon="chat"
          title="Start Consultation"
          description="Answer a few questions to get a personalized demo recommendation."
        />
        <MenuButton
          onClick={() => onSelectMode('demoList')}
          icon="list"
          title="Browse All Demos"
          description="Explore our full catalog of AI healthcare solutions at your own pace."
        />
      </div>
    </div>
  );
};

export default MainMenu;
