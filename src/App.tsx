// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import CreateForm from './pages/CreateForm';
// import PreviewForm from './pages/PreviewForm';
// import MyForms from './pages/MyForms';
// import { AppBar, Toolbar, Button, Container } from '@mui/material';

// export default function App() {
//   return (
//     <Router>
//       <AppBar position="static">
//         <Toolbar>
//           <Button color="inherit" component={Link} to="/create">Create</Button>
//           <Button color="inherit" component={Link} to="/preview">Preview</Button>
//           <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
//         </Toolbar>
//       </AppBar>
//       <Container sx={{ mt: 2 }}>
//         <Routes>
//           <Route path="/create" element={<CreateForm />} />
//           <Route path="/preview" element={<PreviewForm />} />
//           <Route path="/myforms" element={<MyForms />} />
//         </Routes>
//       </Container>
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';
import { AppBar, Toolbar, Button, Container, Typography, Box } from '@mui/material';

export default function App() {
  return (
    <Router>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #4a6cf7, #7b42f6)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/create"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              letterSpacing: 0.5
            }}
          >
            Form Builder
          </Typography>

          <Box>
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={{ fontWeight: 500 }}
            >
              Create
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/preview"
              sx={{ fontWeight: 500 }}
            >
              Preview
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/myforms"
              sx={{ fontWeight: 500 }}
            >
              My Forms
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </Router>
  );
}
