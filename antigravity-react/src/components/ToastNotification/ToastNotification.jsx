"use client";

// MODULES //
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

// STYLES //
import styles from "./ToastNotification.module.scss";

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const { message, type = "info" } = toast;

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${styles[type] || styles.info}`}>
        <div className={styles.icon}>
          {type === "success" && <CheckCircle2 size={18} />}
          {type === "error" && <AlertCircle size={18} />}
          {type === "info" && <Info size={18} />}
        </div>
        <div className={styles.message}>{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#8b949e",
              cursor: "pointer",
              padding: 0,
              marginLeft: "0.5rem",
              display: "flex",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
