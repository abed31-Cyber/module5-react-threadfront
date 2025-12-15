
import React, { useEffect, useState } from 'react';
import CatClawAnimation from './components/CatClawAnimation';

function CatClawEffectProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [soundName, setSoundName] = useState('');

  useEffect(() => {
    const handler = (e) => {
      setSoundName(e.detail?.soundName || '');
      setVisible(true);
      setTimeout(() => setVisible(false), 800);
    };
    window.addEventListener('cat-claw-show', handler);
    return () => window.removeEventListener('cat-claw-show', handler);
  }, []);

  return (
    <>
      {children}
      <CatClawAnimation visible={visible} soundName={soundName} />
    </>
  );
}

export default CatClawEffectProvider;
