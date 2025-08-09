export type FieldKind =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export type ValidationRule = {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: { minLen: number; requireNumber: boolean } | null;
};

export type DerivedConfig = {
  parents: string[];  // parent field ids
  formula: string;    // e.g. "p_field1 + p_field2"
};

export type FieldSchema = {
  id: string;           // uuid
  type: FieldKind;
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[];   // for select/radio/checkbox
  validation?: ValidationRule;
  derived?: DerivedConfig | null;
};

export type FormSchema = {
  id: string;
  name: string;
  createdAt: string;    // ISO date
  fields: FieldSchema[];
};
