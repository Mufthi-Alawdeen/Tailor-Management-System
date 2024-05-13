import React from "react";
import styles from "./LoadinfMessage.module.css";

const LoadingMessage = ({ isLoading }) => {
  return (
    <>
      
      <div className={styles.loadingContainer}>
        <div className={styles.loadingBar}></div>
        <div className={styles.loadingBar}></div>
        <div className={styles.loadingBar}></div>
        <div className={styles.loadingBar}></div>
        <div className={styles.loadingBar}></div>
      </div>
      {isLoading && (
        <div className={styles.overlay}></div>
      )}
    </>
  );
};

export default LoadingMessage;
