'use client'
import getStripe from '@/utils/get-stripe';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Container, Card, CardContent } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from 'next/head';

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }
  
    const stripe = await getStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    }
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{
        background: '#FFFFFF', // Light faint blue
        minHeight: '100vh', // Ensure full height
        fontFamily: 'Arial, sans-serif',
        padding: '20px' // Add some padding
      }}
    >
      <Head>
        <title>RecallAI</title>
        <meta name="description" content="Create flashcards from text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#BD38AC' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold', color: '#fff' }}>
            RecallAI
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: 'center', my: 4, color: '#333' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to RecallAI
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The quickest way to make flashcards!.
        </Typography>
        <Button variant="contained" sx={{ mt: 2, mr: 2, backgroundColor: '#BD38AC' }} href="/generate">
  Get Started
</Button>
      </Box>
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#BD38AC', textAlign: 'center' }}>Features</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Quick Production</Typography>
                <Typography>
                  Put the topic name and sit back to be amazed by the AI generated cards!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Intelligent Flashcards</Typography>
                <Typography>
                  Using Google's Gemini Model, you are sure to cover any topic in depth.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Saved Data</Typography>
                <Typography>
                  If you leave, your flashcards won't! You can study them forever...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#BD38AC' }}>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                backgroundColor: '#fff',
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
                Basic
              </Typography>
              <Typography variant='h6' gutterBottom>
                $5 / month
              </Typography>
              <Typography>
                Access to basic flashcard features with limited storage.
              </Typography>
              <Button variant="contained" sx={{ mt: 2, backgroundColor: '#BD38AC' }}>
  Choose Basic
</Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                backgroundColor: '#fff',
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
                Pro
              </Typography>
              <Typography variant='h6' gutterBottom>
                $10 / month
              </Typography>
              <Typography>
                Unlimited flashcards and storage, given priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: '#BD38AC' }} onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
