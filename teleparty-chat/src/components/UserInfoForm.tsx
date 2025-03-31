import React, { useState, ChangeEvent } from 'react';
import { Box, TextField, Button, Typography, Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { User } from '../types';

interface UserInfoFormProps {
  onSubmit: (user: User) => void;
  buttonText: string;
  title: string;
  showRoomIdField?: boolean;
  roomIdLabel?: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  onSubmit,
  buttonText,
  title,
  showRoomIdField = false,
  roomIdLabel = 'Room ID',
}) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nickname,
      userIcon,
      ...(showRoomIdField && { roomId }),
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      alert('Image too large. Please select an image under 1MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Convert to base64 string
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUserIcon(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        {title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{ width: 80, height: 80 }}
            src={userIcon}
          >
            {nickname ? nickname.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
          </label>
        </Box>
      </Box>

      <TextField
        fullWidth
        label="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        margin="normal"
        required
        inputProps={{ maxLength: 20 }}
        helperText={`${nickname.length}/20 characters`}
      />

      {showRoomIdField && (
        <TextField
          fullWidth
          label={roomIdLabel}
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          margin="normal"
          required
          inputProps={{ maxLength: 6 }}
          helperText="Enter 6-character room ID"
        />
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={!nickname || (showRoomIdField && !roomId)}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default UserInfoForm;
