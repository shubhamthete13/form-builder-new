// import { useSelector } from 'react-redux';
// import type { RootState } from '../app/store';
// import { useState, useEffect } from 'react';
// import { evaluateDerived } from '../utils/derivedEvaluator';
// import { validateValue } from '../utils/validations';
// import {
//   TextField,
//   FormControlLabel,
//   Checkbox,
//   MenuItem,
//   Button,
//   Stack
// } from '@mui/material';

// export default function PreviewForm() {
//   const activeForm = useSelector((state: RootState) => state.forms.activePreview);
//   const [values, setValues] = useState<Record<string, any>>({});
//   const [errors, setErrors] = useState<Record<string, string | null>>({});

//   // Reset when form changes
//   useEffect(() => {
//     if (activeForm) {
//       setValues({});
//       setErrors({});
//     }
//   }, [activeForm]);

//   if (!activeForm) {
//     return <div>No form selected to preview.</div>;
//   }

//   const handleChange = (id: string, value: any) => {
//     const newValues = { ...values, [id]: value };

//     // Recompute derived fields
//     activeForm.fields.forEach(f => {
//       if (f.derived) {
//         newValues[f.id] = evaluateDerived(f.derived, newValues);
//       }
//     });

//     setValues(newValues);

//     // Validate
//     const newErrors = { ...errors };
//     const field = activeForm.fields.find(f => f.id === id);
//     if (field) {
//       const result = validateValue(value, field.validation, field.required);
//       newErrors[id] = result.valid ? null : result.message || 'Invalid';
//     }
//     setErrors(newErrors);
//   };

//   const handleSubmit = () => {
//     const newErrors: Record<string, string | null> = {};
//     let isValid = true;
//     activeForm.fields.forEach(f => {
//       const result = validateValue(values[f.id], f.validation, f.required);
//       if (!result.valid) {
//         isValid = false;
//         newErrors[f.id] = result.message || 'Invalid';
//       }
//     });
//     setErrors(newErrors);
//     if (isValid) {
//       alert('Form submitted: ' + JSON.stringify(values, null, 2));
//     }
//   };

//   return (
//     <Stack spacing={2}>
//       {activeForm.fields.map(f => {
//         const val = values[f.id] ?? '';
//         const err = errors[f.id] ?? null;

//         // Derived fields are read-only
//         const isDerived = !!f.derived;

//         if (f.type === 'text' || f.type === 'number' || f.type === 'date') {
//           return (
//             <TextField
//               key={f.id}
//               label={f.label}
//               type={f.type === 'number' ? 'number' : f.type}
//               value={val}
//               onChange={(e) => handleChange(f.id, e.target.value)}
//               error={!!err}
//               helperText={err || ''}
//               fullWidth
//               InputProps={{ readOnly: isDerived }}
//             />
//           );
//         }

//         if (f.type === 'textarea') {
//           return (
//             <TextField
//               key={f.id}
//               label={f.label}
//               value={val}
//               onChange={(e) => handleChange(f.id, e.target.value)}
//               error={!!err}
//               helperText={err || ''}
//               fullWidth
//               multiline
//               rows={4}
//               InputProps={{ readOnly: isDerived }}
//             />
//           );
//         }

//         if (f.type === 'select') {
//           return (
//             <TextField
//               select
//               key={f.id}
//               label={f.label}
//               value={val}
//               onChange={(e) => handleChange(f.id, e.target.value)}
//               error={!!err}
//               helperText={err || ''}
//               fullWidth
//               SelectProps={{ readOnly: isDerived }}
//             >
//               {(f.options || []).map(opt => (
//                 <MenuItem key={opt} value={opt}>{opt}</MenuItem>
//               ))}
//             </TextField>
//           );
//         }

//         if (f.type === 'checkbox') {
//           return (
//             <FormControlLabel
//               key={f.id}
//               control={
//                 <Checkbox
//                   checked={!!val}
//                   onChange={(e) => handleChange(f.id, e.target.checked)}
//                   disabled={isDerived}
//                 />
//               }
//               label={f.label}
//             />
//           );
//         }

//         if (f.type === 'radio') {
//           return (
//             <Stack key={f.id}>
//               <label>{f.label}</label>
//               {(f.options || []).map(opt => (
//                 <FormControlLabel
//                   key={opt}
//                   control={
//                     <Checkbox
//                       checked={val === opt}
//                       onChange={() => handleChange(f.id, opt)}
//                       disabled={isDerived}
//                     />
//                   }
//                   label={opt}
//                 />
//               ))}
//               {err && <div style={{ color: 'red' }}>{err}</div>}
//             </Stack>
//           );
//         }

//         return null;
//       })}

//       <Button variant="contained" onClick={handleSubmit}>
//         Submit
//       </Button>
//     </Stack>
//   );
// }


import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useState, useEffect } from 'react';
import { evaluateDerived } from '../utils/derivedEvaluator';
import { validateValue } from '../utils/validations';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Button,
  Stack,
  Paper,
  Typography
} from '@mui/material';

export default function PreviewForm() {
  const activeForm = useSelector((state: RootState) => state.forms.activePreview);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (activeForm) {
      setValues({});
      setErrors({});
    }
  }, [activeForm]);

  if (!activeForm) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(180deg, #ffffff, #f0f4ff)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h6" sx={{ color: '#2b3a55' }}>
          No form selected to preview.
        </Typography>
      </Paper>
    );
  }

  const handleChange = (id: string, value: any) => {
    const newValues = { ...values, [id]: value };

    activeForm.fields.forEach((f) => {
      if (f.derived) {
        newValues[f.id] = evaluateDerived(f.derived, newValues);
      }
    });

    setValues(newValues);

    const newErrors = { ...errors };
    const field = activeForm.fields.find((f) => f.id === id);
    if (field) {
      const result = validateValue(value, field.validation, field.required);
      newErrors[id] = result.valid ? null : result.message || 'Invalid';
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;
    activeForm.fields.forEach((f) => {
      const result = validateValue(values[f.id], f.validation, f.required);
      if (!result.valid) {
        isValid = false;
        newErrors[f.id] = result.message || 'Invalid';
      }
    });
    setErrors(newErrors);
    if (isValid) {
      alert('Form submitted: ' + JSON.stringify(values, null, 2));
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(180deg, #ffffff, #f0f4ff)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2b3a55' }}>
        Preview: {activeForm.name}
      </Typography>

      <Stack spacing={2}>
        {activeForm.fields.map((f) => {
          const val = values[f.id] ?? '';
          const err = errors[f.id] ?? null;
          const isDerived = !!f.derived;

          const commonStyles = {
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
          };

          if (['text', 'number', 'date'].includes(f.type)) {
            return (
              <TextField
                key={f.id}
                label={f.label}
                type={f.type === 'number' ? 'number' : f.type}
                value={val}
                onChange={(e) => handleChange(f.id, e.target.value)}
                error={!!err}
                helperText={err || ''}
                fullWidth
                InputProps={{ readOnly: isDerived }}
                sx={commonStyles}
              />
            );
          }

          if (f.type === 'textarea') {
            return (
              <TextField
                key={f.id}
                label={f.label}
                value={val}
                onChange={(e) => handleChange(f.id, e.target.value)}
                error={!!err}
                helperText={err || ''}
                fullWidth
                multiline
                rows={4}
                InputProps={{ readOnly: isDerived }}
                sx={commonStyles}
              />
            );
          }

          if (f.type === 'select') {
            return (
              <TextField
                select
                key={f.id}
                label={f.label}
                value={val}
                onChange={(e) => handleChange(f.id, e.target.value)}
                error={!!err}
                helperText={err || ''}
                fullWidth
                SelectProps={{ readOnly: isDerived }}
                sx={commonStyles}
              >
                {(f.options || []).map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          if (f.type === 'checkbox') {
            return (
              <FormControlLabel
                key={f.id}
                control={
                  <Checkbox
                    checked={!!val}
                    onChange={(e) => handleChange(f.id, e.target.checked)}
                    disabled={isDerived}
                  />
                }
                label={f.label}
              />
            );
          }

          if (f.type === 'radio') {
            return (
              <Stack key={f.id}>
                <Typography sx={{ fontWeight: 500 }}>{f.label}</Typography>
                {(f.options || []).map((opt) => (
                  <FormControlLabel
                    key={opt}
                    control={
                      <Checkbox
                        checked={val === opt}
                        onChange={() => handleChange(f.id, opt)}
                        disabled={isDerived}
                      />
                    }
                    label={opt}
                  />
                ))}
                {err && <Typography color="error">{err}</Typography>}
              </Stack>
            );
          }

          return null;
        })}

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            mt: 2,
            background: 'linear-gradient(90deg, #4a6cf7, #7b42f6)',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(90deg, #3b5bdb, #6930c3)'
            }
          }}
        >
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
