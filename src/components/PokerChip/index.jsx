import styles from './PokerChip.module.css';

export const PokerChip = ({ color, value, delay }) => {
  return (
    <div
      className={styles['poker-chip']}
      style={{
        '--chip-color': color,
        '--delay': `${delay}s`
      }}
    >
      <div className={styles['chip-inner']}>
        <span className={styles['chip-value']}>{value}</span>
      </div>
    </div>
  );
};
