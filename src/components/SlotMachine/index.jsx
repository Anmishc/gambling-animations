import {useState, useCallback, useEffect, useRef} from 'react';
import { Dice5, Sparkles } from 'lucide-react';
import styles from './SlotMachine.module.css';

const SYMBOLS = ['7️⃣', '💎', '🎰', '🎲', '⭐️', '🔥'];
const SPIN_DURATION = 2000;
const REEL_DELAY = 200;

export const SlotMachine = () => {
  const [slots, setSlots] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const buttonRef = useRef(null);

  const checkWin = useCallback((newSlots) => {
    return newSlots.every(symbol => symbol === newSlots[0]);
  }, []);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsWinning(false);

    const finalSlots = [];
    const willWin = Math.random() < 0.3;

    if (willWin) {
      const winningSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      finalSlots.push(winningSymbol, winningSymbol, winningSymbol);
    } else {
      for (let i = 0; i < 3; i++) {
        let symbol;
        do {
          symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        } while (i === 2 && finalSlots[0] === finalSlots[1] && symbol === finalSlots[0]);
        finalSlots.push(symbol);
      }
    }

    const reels = document.querySelectorAll(`.${styles['slot-symbol']}`);
    reels.forEach((reel, index) => {
      reel.classList.add(styles[`spinning-reel-${index + 1}`]);

      setTimeout(() => {
        reel.classList.remove(styles[`spinning-reel-${index + 1}`]);
        setSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = finalSlots[index];
          return newSlots;
        });

        if (index === reels.length - 1) {
          setTimeout(() => {
            setIsSpinning(false);
            const won = checkWin(finalSlots);
            setIsWinning(won);
          }, 300);
        }
      }, SPIN_DURATION + (index * REEL_DELAY));
    });
  };

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (centerY - y) / 10;
      const rotateY = (x - centerX) / 10;

      btn.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      btn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={styles['slot-machine-container']}>
      <div className={styles['machine-top-light']} />
      <div className={styles['machine-display']}>
        <div className={`${styles['slot-display']} ${isSpinning ? styles['machine-shake'] : ''}`}>
          {slots.map((symbol, index) => (
            <div key={index} className={styles['slot-symbol']}>
              {symbol}
              <div className={styles['slot-blur']}>{symbol}</div>
            </div>
          ))}
        </div>
      </div>
      {isWinning && (
        <div className={styles['win-celebration']}>
          <Sparkles className={styles['celebration-sparkle-1']} />
          <Sparkles className={styles['celebration-sparkle-2']} />
          <Sparkles className={styles['celebration-sparkle-3']} />
        </div>
      )}
      <button
        ref={buttonRef}
        className={`${styles['spin-button']} ${isWinning ? styles.winning : ''}`}
        onClick={spin}
        disabled={isSpinning}
      >
        <Dice5 className={`w-6 h-6 ${isSpinning ? styles['spin-icon'] : ''}`} />
        <span>{isSpinning ? 'Spinning...' : 'Spin!'}</span>
      </button>
    </div>
  );
};
