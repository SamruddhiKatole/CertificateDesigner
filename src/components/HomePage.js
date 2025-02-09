// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [currentCertToRename, setCurrentCertToRename] = useState(null);
  const [newName, setNewName] = useState('');

  // Load certificates from localStorage on mount.
  useEffect(() => {
    const savedCerts = JSON.parse(localStorage.getItem('certificates')) || [];
    setCertificates(savedCerts);
  }, []);

  // Create a new certificate.
  const handleCreate = () => {
    const newCert = {
      id: Date.now().toString(),
      name: `Certificate ${new Date().toLocaleDateString()}`,
      pages: [
        {
          id: 1,
          texts: [],
          shapes: [],
          backgroundColor: '#ffffff',
          backgroundImage: null,
          eSignature: null,
        },
      ],
    };
    const updatedCerts = [...certificates, newCert];
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
    setCertificates(updatedCerts);
    navigate(`/designer/${newCert.id}`);
  };

  // Navigate to the certificate editor.
  const handleEdit = (id) => {
    navigate(`/designer/${id}`);
  };

  // Delete a certificate.
  const handleDelete = (id) => {
    const updatedCerts = certificates.filter((cert) => cert.id !== id);
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
    setCertificates(updatedCerts);
  };

  // Open the rename dialog.
  const handleRename = (cert) => {
    setCurrentCertToRename(cert);
    setNewName(cert.name || '');
    setRenameDialogOpen(true);
  };

  // Confirm the renaming action.
  const confirmRename = () => {
    const updatedCerts = certificates.map((cert) =>
      cert.id === currentCertToRename.id ? { ...cert, name: newName } : cert
    );
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
    setCertificates(updatedCerts);
    setRenameDialogOpen(false);
  };


  const handleDownload = (id) => {
    navigate(`/designer/${id}?download=true`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Certificate Designer
      </Typography>
      <Button variant="contained" onClick={handleCreate} sx={{ marginBottom: 2 }}>
        Create Certificate
      </Button>
      <Typography variant="h5" gutterBottom>
        Saved Certificates
      </Typography>
      <Grid container spacing={2}>
        {certificates.map((cert) => (
          <Grid item xs={12} sm={6} md={4} key={cert.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cert.name || `Certificate ${cert.id}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {`Pages: ${cert.pages.length}`}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleEdit(cert.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(cert.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleRename(cert)}>
                  <DriveFileRenameOutlineIcon />
                </IconButton>
                <IconButton onClick={() => handleDownload(cert.id)}>
                  <DownloadIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Certificate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Certificate Name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRename} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HomePage;
