import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Dialog({ title, onClose, children, closeLabel = "Закрыть" }: { title: string; onClose: () => void; children: ReactNode; closeLabel?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  return <dialog ref={ref} className="player-dialog" aria-labelledby={heading} onCancel={e => { e.preventDefault(); onClose(); }}>
    <div className="dialog-heading"><h2 id={heading}>{title}</h2><button className="icon-button" aria-label={closeLabel} onClick={onClose}><X size={18} /></button></div>
    <div className="dialog-content">{children}</div>
  </dialog>;
}
