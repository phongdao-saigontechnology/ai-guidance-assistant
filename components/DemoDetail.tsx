
import React from 'react';
import { Demo } from '../types';
import Icon from './Icon';

interface DemoDetailProps {
  demo: Demo;
  onBack: () => void;
}

const DemoDetail: React.FC<DemoDetailProps> = ({ demo, onBack }) => {
  return (
    <div className="p-8 md:p-12 animate-slide-in-up h-full flex flex-col">
       <div className="flex-shrink-0 mb-8">
         <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors">
            <Icon name="back" className="w-6 h-6" />
            <span>Back to List</span>
        </button>
       </div>
       <div className="flex-grow overflow-y-auto pr-4 -mr-4">
        <span className="text-md font-semibold text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-full">
            {demo.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary my-4">{demo.title}</h1>
        <p className="text-lg text-brand-text-secondary leading-relaxed max-w-4xl">{demo.description}</p>
        
        <div className="my-8 h-px bg-brand-border"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-bold text-brand-text-primary mb-4">Problem Solved</h3>
                <p className="text-brand-text-secondary leading-relaxed">{demo.problemSolved}</p>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-brand-text-primary mb-4">Key Features</h3>
                <ul className="space-y-2">
                    {demo.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Icon name="chevron-right" className="w-5 h-5 text-brand-accent mt-1 mr-2 flex-shrink-0" />
                            <span className="text-brand-text-secondary">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="mt-12 text-center">
            <a
            href={demo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-primary text-white font-bold text-xl py-4 px-10 rounded-lg shadow-lg hover:bg-brand-secondary transition-all duration-300 transform hover:scale-105"
            >
            Launch Demo
            </a>
        </div>
      </div>
    </div>
  );
};

export default DemoDetail;
