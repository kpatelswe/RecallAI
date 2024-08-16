import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Container 
      maxWidth="100vw" 
      sx={{ 
        background: 'FFFFFF', // Gradient background
        minHeight: '100vh', // Ensure full height
        padding: '20px', // Add some padding
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: '#BD38AC' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: '#fff'
            }}
          >
            RecallAI
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Login
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ 
          backgroundColor: '#fff', 
          padding: '40px', 
          borderRadius: '8px', 
          boxShadow: 3, 
          marginTop: '40px'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#BD38AC' }}>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Container>
  );
}