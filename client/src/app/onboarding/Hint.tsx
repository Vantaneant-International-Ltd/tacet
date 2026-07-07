import type { ReactNode } from "react";
import { Icon } from "../../design/icons";

// A calm, one-line, dismissible nudge. The whole nudge vocabulary of Tacet — no modals,
// no coach-mark spotlights, no walls of text. Shows once, then never again.
export function Hint({
  children,
  onDismiss,
  action,
}: {
  children: ReactNode;
  onDismiss: () => void;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="t-hint" role="note">
      <span className="t-hint__dot" aria-hidden="true" />
      <span className="t-hint__text">{children}</span>
      {action && (
        <button className="t-hint__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      <button className="t-hint__x" aria-label="Dismiss" onClick={onDismiss}>
        <Icon name="close" size={13} />
      </button>
    </div>
  );
}
