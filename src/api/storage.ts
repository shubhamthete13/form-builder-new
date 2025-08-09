import type { FormSchema } from '../types';

const STORAGE_KEY = 'upliance_forms_v1';

// Save forms array to localStorage
export const saveFormsToStorage = (forms: FormSchema[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
};

// Load forms array from localStorage
export const loadFormsFromStorage = (): FormSchema[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};
