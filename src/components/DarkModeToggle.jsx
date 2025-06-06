import { useState, useEffect } from 'react';

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
  }, [dark]);

  return (
    <div className='toggle-wrapper' onClick={() => setDark(!dark)}>
      <div className={`toggle-track${dark ? ' dark' : ''}`}>
        <div className='toggle-thumb'></div>
      </div>
    </div>
  );
}

export default DarkModeToggle;
