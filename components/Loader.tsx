
import React from 'react';

const Loader: React.FC<{ size?: string }> = ({ size = 'w-8 h-8' }) => {
  return (
    <div
      className={`${size} animate-spin rounded-full border-4 border-brand-surface border-t-brand-primary`}
    ></div>
  );
};

export default Loader;
