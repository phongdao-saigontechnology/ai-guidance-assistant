
import React from 'react';
import Icon from './Icon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-primary bg-brand-background p-8 animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 p-6 bg-brand-primary/10 rounded-full">
            <Icon name="robot" className="w-20 h-20 text-brand-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          AI Healthcare Solutions
        </h1>
        <p className="text-xl md:text-2xl text-brand-text-secondary max-w-3xl mb-12">
          Welcome! I'm your personal AI assistant. Let me guide you to the cutting-edge innovations relevant to your work.
        </p>
        <button
          onClick={onStart}
          className="bg-brand-primary text-white font-bold text-2xl py-6 px-12 rounded-full shadow-lg hover:bg-brand-secondary transition-all duration-300 transform hover:scale-105 animate-pulse-slow"
        >
          Tap to Start
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
