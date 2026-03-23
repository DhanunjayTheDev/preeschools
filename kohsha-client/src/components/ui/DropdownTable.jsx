import { useState, useRef, useEffect } from 'react';

export function DropdownTable({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  value,
  onChange,
  columns = [],
  searchable = true,
  icon = '📋',
  className = '',
  required = false,
  displayFormat = (option) => option.label,
  renderRow = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected label when value changes
  useEffect(() => {
    const selected = options.find((opt) => opt.value === value);
    if (selected) {
      setSelectedLabel(displayFormat(selected));
    } else {
      setSelectedLabel('');
    }
  }, [value, options, displayFormat]);

  // Filter options based on search
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.searchFields || []).some((field) =>
        String(field).toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleSelectOption = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2.5 border rounded-lg text-left font-medium transition-all duration-200 flex items-center justify-between  ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-blue-400'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">{icon}</span>
            <span className={selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
              {selectedLabel || placeholder}
            </span>
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-[60] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-80 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                columns.length > 0 ? (
                  // Table View
                  <div className="divide-y divide-gray-100">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                      <div className={`grid gap-3 text-xs font-semibold text-gray-600`} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
                        {columns.map((col) => (
                          <div key={col.key} className="truncate">
                            {col.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rows */}
                    {filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelectOption(option)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                      >
                        {renderRow ? (
                          renderRow(option)
                        ) : (
                          <div className={`grid gap-3 text-sm`} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
                            {columns.map((col) => (
                              <div key={col.key} className="truncate font-medium text-gray-700">
                                {col.render ? col.render(option) : option[col.key] || '-'}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="divide-y divide-gray-100">
                    {filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelectOption(option)}
                        className={`px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-blue-50 ${
                          value === option.value ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{displayFormat(option)}</span>
                          {value === option.value && (
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <svg className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm font-medium">No results found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
