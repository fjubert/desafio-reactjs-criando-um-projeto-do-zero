import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={`${styles.headerContainer} ${commonStyles.container}`}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="logo" />
      </div>
    </header>
  );
}
