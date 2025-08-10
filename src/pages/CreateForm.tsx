
import { useState as useReactState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import {
  addField,
  deleteField,
  reorderFields,
  saveForm
} from '../features/forms/formsSlice';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import FieldEditor from '../components/FieldEditor/FieldEditor';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { hasCycle } from '../utils/cycleCheck';

export default function CreateForm() {
  const dispatch = useDispatch();
  const builder = useSelector((state: RootState) => state.forms.builder);
  const fields = builder?.fields || [];
  const [selectedId, setSelectedId] = useReactState<string | null>(null);

  const [openSave, setOpenSave] = useReactState(false);
  const [formName, setFormName] = useReactState('');

  const handleAdd = () => {
    const id = uuidv4();
    dispatch(
      addField({
        id,
        type: 'text',
        label: 'New Field',
        required: false,
        defaultValue: '',
        options: [],
        validation: {},
        derived: null
      })
    );
    setSelectedId(id);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteField(id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSave = () => {
    if (!builder) return;
    if (hasCycle(builder.fields)) {
      alert('Cannot save: Derived fields have circular dependencies.');
      return;
    }
    dispatch(saveForm({ name: formName || 'Untitled Form' }));
    setOpenSave(false);
    setFormName('');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    dispatch(reorderFields(reordered));
  };

  const selectedField = fields.find((f) => f.id === selectedId) || null;

  return (
    <Grid container spacing={3} sx={{ p: 3, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Left Panel */}
      {/* <Grid item xs={4}> */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(180deg, #ffffff, #f0f4ff)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#2b3a55', fontWeight: 600 }}>
          Form Builder
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(78,84,200,0.4)',
              '&:hover': { background: 'linear-gradient(90deg, #5d63d1, #9ea3ff)' }
            }}
          >
            Add Field
          </Button>

          <Button
            variant="outlined"
            color="success"
            onClick={() => setOpenSave(true)}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              borderColor: '#2ecc71',
              color: '#27ae60',
              '&:hover': { background: '#eafaf1', borderColor: '#27ae60' }
            }}
          >
            Save Form
          </Button>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields-list">
              {(provided) => (
                <List ref={provided.innerRef} {...provided.droppableProps} sx={{ mt: 2 }}>
                  {fields.map((f, index) => (
                    <Droppable droppableId="fields-list">
                      {(provided) => (
                        <List ref={provided.innerRef} {...provided.droppableProps} sx={{ mt: 2 }}>
                          {fields.map((f, index) => (
                            <Draggable key={f.id} draggableId={f.id} index={index}>
                              {(provided) => (
                                // Native element wrapper to handle ref & drag props:
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    listStyle: 'none',
                                    marginBottom: 8,
                                    borderRadius: 8,
                                    backgroundColor: f.id === selectedId ? '#e8eaf6' : '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => setSelectedId(f.id)}
                                  aria-selected={f.id === selectedId}
                                  tabIndex={0}
                                >
                                  <ListItem
                                    disablePadding
                                    secondaryAction={
                                      <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(f.id);
                                        }}
                                        sx={{ color: '#e74c3c', '&:hover': { color: '#c0392b' } }}
                                        aria-label={`Delete field ${f.label}`}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    }
                                  >
                                    <ListItemText
                                      primary={f.label}
                                      secondary={f.type}
                                      primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                  </ListItem>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                      )}
                    </Droppable>

                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
      </Paper>
      {/* </Grid> */}

      {/* Right Panel */}
      {/* <Grid item xs={8}> */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: '#ffffff',
          minHeight: '80vh',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        {selectedField ? (
          <FieldEditor field={selectedField} />
        ) : (
          <Typography variant="body1" sx={{ color: 'gray', mt: 5, textAlign: 'center' }}>
            Select a field to edit
          </Typography>
        )}
      </Paper>
      {/* </Grid> */}

      {/* Save Form Dialog */}
      <Dialog open={openSave} onClose={() => setOpenSave(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSave(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
              '&:hover': { background: 'linear-gradient(90deg, #5d63d1, #9ea3ff)' }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
