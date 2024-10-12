import React, { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";
import { FaQuestionCircle } from "react-icons/fa";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  errorMessage?: string | null;
  isDisable: boolean | null;
}

const Input: React.FC<InputProps> = ({ isDisable, label, errorMessage, icon, onChange, ...props }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event);
  };

  return (
    <div className={`${styles.appInputContainer} ${props.type || ""}`}>
      {label && <label>{label}</label>}
      <div className={styles.inputBar}>
        {icon && <span>{icon}</span>}
        {
          !isDisable ?
            <input {...props} onChange={handleInputChange} className={errorMessage ? styles.error : ""} />
            : <input {...props} onChange={handleInputChange} className={errorMessage ? styles.error : ""} disabled />
        }
        {props.type == "password" &&
          <span className={styles.questionMarkIcon}>
            <a target="_blank" href="https://drive.google.com/drive/u/0/folders/18V0mD94B4yJtA3GNFiS5VFMy3sHoZaTO">
              <FaQuestionCircle />
            </a>
          </span>
        }
      </div>
      {
        props.type === "checkbox" ? (
          <label className={styles.checkboxLabel}>
            <span className={`${styles.checkmark} ${props.checked ? styles.visible : ""}`}>✔</span>
          </label>
        ) : null
      }
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div >
  );
};

export default Input;
