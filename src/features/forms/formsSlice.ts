import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSchema, FieldSchema } from '../../types';

type FormsState = {
  builder: FormSchema | null;
  saved: FormSchema[];
  activePreview?: FormSchema | null;
};

const initialState: FormsState = {
  builder: { id: 'tmp', name: '', createdAt: new Date().toISOString(), fields: [] },
  saved: [],
  activePreview: null
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<FieldSchema>) {
      state.builder?.fields.push(action.payload);
    },
    updateField(state, action: PayloadAction<{ id: string; patch: Partial<FieldSchema> }>) {
      const field = state.builder?.fields.find(f => f.id === action.payload.id);
      if (field) Object.assign(field, action.payload.patch);
    },
    deleteField(state, action: PayloadAction<string>) {
      if (state.builder) {
        state.builder.fields = state.builder.fields.filter(f => f.id !== action.payload);
      }
    },
    reorderFields(state, action: PayloadAction<FieldSchema[]>) {
      if (state.builder) {
        state.builder.fields = action.payload;
      }
    },
    saveForm(state, action: PayloadAction<{ name: string }>) {
      if (!state.builder) return;
      const newForm: FormSchema = {
        ...state.builder,
        id: crypto.randomUUID(),
        name: action.payload.name,
        createdAt: new Date().toISOString()
      };
      state.saved.push(newForm);
    },
    loadSavedForms(state, action: PayloadAction<FormSchema[]>) {
      state.saved = action.payload;
    },
    setActivePreview(state, action: PayloadAction<string | null>) {
      state.activePreview = action.payload
        ? state.saved.find(f => f.id === action.payload) || null
        : null;
    }
  }
});

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadSavedForms,
  setActivePreview
} = formsSlice.actions;

export default formsSlice.reducer;
