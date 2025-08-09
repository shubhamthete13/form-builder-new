import { configureStore } from '@reduxjs/toolkit';
import formsReducer, { loadSavedForms } from '../features/forms/formsSlice';
import { saveFormsToStorage, loadFormsFromStorage } from '../api/storage';

export const store = configureStore({
  reducer: {
    forms: formsReducer
  }
});

// Load saved forms on app start
store.dispatch(loadSavedForms(loadFormsFromStorage()));

// Save forms to storage whenever they change
store.subscribe(() => {
  const state = store.getState();
  saveFormsToStorage(state.forms.saved);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
