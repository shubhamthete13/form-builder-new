// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../app/store';
// import { setActivePreview } from '../features/forms/formsSlice';
// import { useNavigate } from 'react-router-dom';
// import { List, ListItem, ListItemText, Paper } from '@mui/material';

// export default function MyForms() {
//   const forms = useSelector((state: RootState) => state.forms.saved);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleOpenPreview = (id: string) => {
//     dispatch(setActivePreview(id));
//     navigate('/preview');
//   };

//   if (forms.length === 0) {
//     return <Paper sx={{ p: 2 }}>No saved forms yet.</Paper>;
//   }

//   return (
//     <List>
//       {forms.map((form) => (
//         <ListItem
//           key={form.id}
//           component="button"
//           onClick={() => handleOpenPreview(form.id)}
//           sx={{ textAlign: 'left' }}
//         >
//           <ListItemText
//             primary={form.name}
//             secondary={`Created: ${new Date(form.createdAt).toLocaleString()}`}
//           />
//         </ListItem>
//       ))}
//     </List>
//   );
// }
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { setActivePreview } from '../features/forms/formsSlice';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';

export default function MyForms() {
  const forms = useSelector((state: RootState) => state.forms.saved);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenPreview = (id: string) => {
    dispatch(setActivePreview(id));
    navigate('/preview');
  };

  if (forms.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(180deg, #ffffff, #f0f4ff)',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h6" sx={{ color: '#2b3a55', fontWeight: 500 }}>
          No saved forms yet.
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
          Start by creating a new form.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(180deg, #ffffff, #f0f4ff)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#2b3a55', fontWeight: 600 }}>
        My Saved Forms
      </Typography>

      <List>
        {forms.map((form) => (
          <ListItem
            key={form.id}
            component="div"
            onClick={() => handleOpenPreview(form.id)}
            sx={{
              cursor: 'pointer',
              mb: 1.5,
              borderRadius: 2,
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: '#f1f3ff',
                transform: 'scale(1.01)'
              }
            }}
          >
            <ListItemText
              primary={form.name}
              secondary={`Created: ${new Date(form.createdAt).toLocaleString()}`}
              primaryTypographyProps={{
                fontWeight: 500,
                color: '#2b3a55'
              }}
              secondaryTypographyProps={{
                color: 'gray',
                fontSize: '0.85rem'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
