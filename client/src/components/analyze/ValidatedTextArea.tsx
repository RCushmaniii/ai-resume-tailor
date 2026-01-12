import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 1. Import Hook
import { VALIDATION_RULES } from '@/lib/validation';

interface ValidatedTextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error: string | null;
  showError: boolean;
  onClear?: () => void;
  disabled?: boolean;
  maxLength?: number;
  onBlur?: () => void;
  hideLabel?: boolean;
}

export function ValidatedTextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  showError,
  onClear,
  disabled = false,
  maxLength = VALIDATION_RULES.MAX_LENGTH,
  onBlur,
  hideLabel = false,
}: ValidatedTextAreaProps) {
  const { t } = useTranslation(); // 2. Initialize Hook
  const [characterCount, setCharacterCount] = useState(value.length);
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [isAtLimit, setIsAtLimit] = useState(false);

  useEffect(() => {
    setCharacterCount(value.length);
    setIsNearLimit(value.length >= maxLength * 0.9);
    setIsAtLimit(value.length >= maxLength);
  }, [value, maxLength]);

  const getCharacterCountColor = () => {
    if (isAtLimit) return 'text-red-500';
    if (isNearLimit) return 'text-orange-500';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {!hideLabel && (
          <Label htmlFor={id} className="text-lg font-semibold">
            {label}
          </Label>
        )}
        <div className={`flex items-center gap-2 ${hideLabel ? 'ml-auto' : ''}`}>
          <span className={`text-xs ${getCharacterCountColor()} transition-colors duration-300`}>
            {/* 3. Localize 'characters' */}
            {characterCount.toLocaleString()} / {maxLength.toLocaleString()} {t('analyze.characters')}
          </span>
          {value && onClear && (
            <button
              onClick={onClear}
              disabled={disabled}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              // 4. Localize tooltip
              title={t('analyze.clearText')}
            >
              <Trash2 className="w-3 h-3" />
              {/* 5. Localize button text */}
              {t('analyze.clear')}
            </button>
          )}
        </div>
      </div>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`min-h-[300px] resize-none font-mono text-sm transition-all duration-200 ${
          showError ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500'
        }`}
        aria-label={label}
        aria-invalid={!!showError}
        aria-describedby={showError ? `${id}-error` : undefined}
        maxLength={maxLength}
      />
      {showError && (
        <div id={`${id}-error`} className="flex items-start gap-2 text-red-600 text-sm animate-in slide-in-from-top-1" role="alert">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
