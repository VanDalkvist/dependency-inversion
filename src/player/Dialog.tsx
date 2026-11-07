import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

function outside(dialog: HTMLDialogElement, x: number, y: number) {
  const rect = dialog.getBoundingClientRect();
  return x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom;
}

export default function Dialog({
  title,
  onClose,
  children,
  closeLabel = "Закрыть",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedOutside = useRef(false);
  const heading = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      if (
        (opener instanceof HTMLElement || opener instanceof SVGElement) &&
        opener.isConnected
      )
        opener.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="player-dialog"
      aria-labelledby={heading}
      onMouseDown={(event) => {
        pressedOutside.current = event.target === event.currentTarget && outside(event.currentTarget, event.clientX, event.clientY);
      }}
      onClick={(event) => {
        if (pressedOutside.current && event.target === event.currentTarget && outside(event.currentTarget, event.clientX, event.clientY)) onClose();
        pressedOutside.current = false;
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-heading">
        <h2 id={heading}>{title}</h2>
        <button
          className="icon-button"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <div className="dialog-content">{children}</div>
    </dialog>
  );
}
