export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure?', 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        {/* Dialog */}
        <div className="relative bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className={`p-6 border-b ${isDangerous ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-bold ${isDangerous ? 'text-red-900' : 'text-gray-900'}`}>
              {isDangerous ? '⚠️ ' : '❓ '}{title}
            </h3>
          </div>

          {/* Message */}
          <div className="p-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all flex items-center gap-2 ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
