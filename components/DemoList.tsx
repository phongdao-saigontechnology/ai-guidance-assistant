
import React from 'react';
import { Demo } from '../types';
import DemoCard from './DemoCard';
import Icon from './Icon';

interface DemoListProps {
  demos: Demo[];
  onSelectDemo: (demo: Demo) => void;
  onBack: () => void;
}

const DemoList: React.FC<DemoListProps> = ({ demos, onSelectDemo, onBack }) => {
  return (
    <div className="p-8 animate-fade-in h-full flex flex-col">
      <div className="flex-shrink-0 mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors mb-4">
            <Icon name="back" className="w-6 h-6" />
            <span>Main Menu</span>
        </button>
        <h2 className="text-4xl font-bold text-brand-text-primary">All Demos</h2>
        <p className="text-lg text-brand-text-secondary mt-2">
          Explore our full suite of AI-powered healthcare solutions.
        </p>
      </div>
      <div className="flex-grow overflow-y-auto pr-4 -mr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} onSelect={onSelectDemo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoList;
