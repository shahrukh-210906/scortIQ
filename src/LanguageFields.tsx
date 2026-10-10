import type { Languages } from './api';

export default function LanguageFields({
  value,
  onChange,
  disabled = false,
}: {
  value: Languages;
  onChange: (value: Languages) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="language-fields" disabled={disabled}>
      <legend>Your learning languages</legend>
      <label htmlFor="teaching-language">Teaching language</label>
      <select
        id="teaching-language"
        value={value.teaching_language}
        onChange={(e) =>
          onChange({
            ...value,
            teaching_language: e.target.value as Languages['teaching_language'],
          })
        }
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="hinglish">Hinglish</option>
      </select>
      <label htmlFor="exam-language">Exam-answer language</label>
      <select
        id="exam-language"
        value={value.exam_language}
        onChange={(e) =>
          onChange({ ...value, exam_language: e.target.value as Languages['exam_language'] })
        }
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
      <p className="form-note">
        Teaching and exam answers can use different languages. Current pilot notes are in English;
        reviewed Hindi notes will follow.
      </p>
    </fieldset>
  );
}
