
import React from 'react';
import { Demo } from '../types';
import Icon from './Icon';

interface DemoCardProps {
  demo: Demo;
  onSelect: (demo: Demo) => void;
  className?: string;
}

const DemoCard: React.FC<DemoCardProps> = ({ demo, onSelect, className = '' }) => {
  return (
    <div
      onClick={() => onSelect(demo)}
      className={`bg-brand-surface border border-brand-border rounded-lg p-6 flex flex-col justify-between cursor-pointer hover:border-brand-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
    >
      <div>
        <span className="text-sm font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
          {demo.category}
        </span>
        <h3 className="text-xl font-bold mt-4 mb-2 text-brand-text-primary">{demo.title}</h3>
        <p className="text-brand-text-secondary text-sm leading-relaxed">
          {demo.description}
        </p>
      </div>
      <div className="flex items-center justify-end mt-6 text-brand-primary font-semibold text-sm">
        <span>View Details</span>
        <Icon name="chevron-right" className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
};

export default DemoCard;
