import { useCallback, useState } from 'react';

/**
 * Tiny form helper: keeps values, errors and touched state,
 * validates with a map of { field: (value, allValues) => errorMessage | '' }.
 */
export default function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = useCallback(
    (name, value, all) => (rules[name] ? rules[name](value, all) : ''),
    [rules]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, values) }));
  };

  const validateAll = () => {
    const next = {};
    Object.keys(rules).forEach((name) => {
      const msg = validateField(name, values[name], values);
      if (msg) next[name] = msg;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));
  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, handleBlur, validateAll, setField, reset };
}
