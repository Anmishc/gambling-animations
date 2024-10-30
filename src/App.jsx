import { useEffect, useRef } from 'react';
import { SlotMachine } from './components/SlotMachine';
import { PokerChip } from './components/PokerChip';
import { SnowScene } from './components/SnowScene';

function App() {
  const titleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    if (titleRef.current) observer.observe(titleRef.current);
    if (textRef.current) observer.observe(textRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 overflow-hidden">
      <SnowScene />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="chips-container">
          <PokerChip color="#e74c3c" value="100" delay={0} />
          <PokerChip color="#f1c40f" value="500" delay={0.2} />
          <PokerChip color="#2ecc71" value="1000" delay={0.4} />
        </div>
        <div className="space-y-8 flex flex-col items-center">
          <SlotMachine />
          <p
            ref={textRef}
            className="slide-element text-gray-400 text-center mt-8 max-w-md"
          >
            Click the slot machine to spin, hover over the button for 3D effects,
            and watch the chips dance!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
