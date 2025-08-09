import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { updateField } from '../../features/forms/formsSlice';
import type { FieldSchema, FieldKind } from '../../types';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Stack
} from '@mui/material';
import { useState } from 'react';
import { Parser } from 'expr-eval';

type Props = {
  field: FieldSchema;
};

const fieldTypes: FieldKind[] = [
  'text',
  'number',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'date'
];

export default function FieldEditor({ field }: Props) {
  const dispatch = useDispatch();
  const allFields = useSelector((state: RootState) => state.forms.builder?.fields || []);
  const [formulaError, setFormulaError] = useState<string | null>(null);

  const handleChange = (patch: Partial<FieldSchema>) => {
    dispatch(updateField({ id: field.id, patch }));
  };

  return (
    <Stack spacing={2}>
      {/* Label */}
      <TextField
        label="Label"
        value={field.label}
        onChange={(e) => handleChange({ label: e.target.value })}
        fullWidth
      />

      {/* Field Type */}
      <TextField
        select
        label="Type"
        value={field.type}
        onChange={(e) => handleChange({ type: e.target.value as FieldKind })}
        fullWidth
      >
        {fieldTypes.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      {/* Required */}
      <FormControlLabel
        control={
          <Checkbox
            checked={!!field.required}
            onChange={(e) => handleChange({ required: e.target.checked })}
          />
        }
        label="Required"
      />

      {/* Options (for select/radio/checkbox) */}
      {(field.type === 'select' ||
        field.type === 'radio' ||
        field.type === 'checkbox') && (
        <TextField
          label="Options (comma separated)"
          value={field.options?.join(',') || ''}
          onChange={(e) =>
            handleChange({
              options: e.target.value
                .split(',')
                .map((o) => o.trim())
                .filter((o) => o)
            })
          }
          fullWidth
        />
      )}

      {/* Validation: Min Length */}
      <TextField
        type="number"
        label="Min Length"
        value={field.validation?.minLength || ''}
        onChange={(e) =>
          handleChange({
            validation: {
              ...field.validation,
              minLength: e.target.value
                ? Number(e.target.value)
                : undefined
            }
          })
        }
      />

      {/* Validation: Max Length */}
      <TextField
        type="number"
        label="Max Length"
        value={field.validation?.maxLength || ''}
        onChange={(e) =>
          handleChange({
            validation: {
              ...field.validation,
              maxLength: e.target.value
                ? Number(e.target.value)
                : undefined
            }
          })
        }
      />

      {/* Validation: Email */}
      <FormControlLabel
        control={
          <Checkbox
            checked={!!field.validation?.email}
            onChange={(e) =>
              handleChange({
                validation: {
                  ...field.validation,
                  email: e.target.checked
                }
              })
            }
          />
        }
        label="Email format"
      />

      {/* Derived Field Toggle */}
      <FormControlLabel
        control={
          <Checkbox
            checked={!!field.derived}
            onChange={(e) => {
              handleChange({
                derived: e.target.checked
                  ? { parents: [], formula: '' }
                  : null
              });
            }}
          />
        }
        label="Derived Field"
      />

      {/* Derived Field Settings */}
      {field.derived && (
        <>
          {/* Parents: multi-select using comma-separated IDs */}
          <TextField
            label="Parent Field IDs (comma separated)"
            value={field.derived.parents.join(',')}
            onChange={(e) =>
              handleChange({
                derived: {
                  ...field.derived!,
                  parents: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s)
                }
              })
            }
            helperText={
              'Available IDs: ' +
              allFields
                .filter((f) => f.id !== field.id)
                .map((f) => f.id)
                .join(', ')
            }
            fullWidth
          />

          {/* Formula with syntax validation */}
          <TextField
            label="Formula (use p_<id> for parents)"
            value={field.derived.formula}
            onChange={(e) => {
              const formula = e.target.value;
              try {
                Parser.parse(formula); // Test syntax
                setFormulaError(null);
                handleChange({
                  derived: { ...field.derived!, formula }
                });
              } catch {
                setFormulaError('Invalid formula syntax');
                handleChange({
                  derived: { ...field.derived!, formula }
                });
              }
            }}
            error={!!formulaError}
            helperText={
              formulaError || 'Example: p_parentId1 + p_parentId2'
            }
            fullWidth
          />
        </>
      )}
    </Stack>
  );
}
