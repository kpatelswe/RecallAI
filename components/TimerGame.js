'use client';

import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Box, Button, Typography, Container, Grid } from "@mui/material";

export default function TimerGame() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);

  useEffect(() => {
    async function getFlashcards() {
      try {
        if (!user) return;
        const colRef = collection(doc(collection(db, 'users'), user.id), 'your-flashcards-collection');
        const docs = await getDocs(colRef);
        const flashcards = [];

        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(flashcards);
        generateMultipleChoiceQuestions(flashcards);
      } catch (error) {
        console.error("Failed to fetch flashcards:", error);
      }
    }

    async function generateMultipleChoiceQuestions(flashcards) {
      const updatedFlashcards = await Promise.all(flashcards.map(async (flashcard) => {
        const options = await getMultipleChoiceOptions(flashcard.front, flashcard.back);
        return { ...flashcard, options };
      }));
      setFlashcards(updatedFlashcards);
    }

    async function getMultipleChoiceOptions(question, correctAnswer) {
      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, correctAnswer })
        });
        const data = await response.json();
        return data.options;  // Assuming the API returns options as an array
      } catch (error) {
        console.error("Failed to get multiple choice options:", error);
        return [];
      }
    }

    getFlashcards();
  }, [user]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <Typography>Loading...</Typography>;
  }

  if (gameOver) {
    return (
      <Container 
        maxWidth="lg" 
        sx={{ 
          background: '#FFFFFF', 
          minHeight: '100vh', 
          padding: '20px', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#BD38AC', mb: 4, textAlign: 'center' }}>
          Game Over!
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#333' }}>
          Your score: {score}/{flashcards.length}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 4, backgroundColor: '#BD38AC' }} 
          onClick={() => window.location.reload()}
        >
          Play Again
        </Button>
      </Container>
    );
  }

  const currentFlashcard = flashcards[currentCardIndex];

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        background: '#FFFFFF',
        minHeight: '100vh', 
        padding: '20px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#BD38AC', mb: 4, textAlign: 'center' }}>
        Timer Game
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', color: '#333' }}>
        Time left: {timeLeft} seconds
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000' }}>
          {currentFlashcard?.front || "No flashcards available"}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {currentFlashcard?.options?.map((option, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              onClick={() => handleAnswer(option === currentFlashcard.back)}
            >
              {option}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
