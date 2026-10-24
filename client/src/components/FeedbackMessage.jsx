import { CheckIcon } from './Icons';

function FeedbackMessage({ type, message, onDismiss }) {
  if (!message) {
    return null;
  }

  if (type === 'success') {
    return (
      <div className="notice notice-success" role="status">
        <CheckIcon />
        <span>{message}</span>
        {onDismiss && (
          <button
            className="notice-dismiss"
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="notice notice-error" role="alert">
      {message}
    </div>
  );
}

export default FeedbackMessage;
