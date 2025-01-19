'use client'

import { Box, Container, Typography, Paper, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function About() {
  const router = useRouter()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/assets/images/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Button
              onClick={() => router.back()}
              variant="contained"
              sx={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                backgroundColor: '#1a237e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2a337e',
                },
                zIndex: 1,
              }}
            >
              Back
            </Button>
            <Paper
              elevation={3}
              sx={{
                padding: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
              }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{ fontFamily: 'Caveat' }}
              >
                About Proportion
              </Typography>
              
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontFamily: 'Caveat',
                  fontSize: '1.8rem'
                }}
              >
                Understanding the Value of Time
              </Typography>

              <Typography paragraph>
                Proportion is more than just a study app – it's a tool designed to transform 
                your perspective on time management. We believe that understanding how to 
                value your time is the first step toward making better decisions about how 
                you spend it.
              </Typography>

              <Typography paragraph>
                Our app helps you visualize and contextualize time in meaningful ways, 
                making it easier to:
              </Typography>

              <Typography component="ul" sx={{ pl: 4 }}>
                <li>Understand the real value of your time</li>
                <li>Make informed decisions about time allocation</li>
                <li>Develop better study habits</li>
                <li>Achieve a healthier work-life balance</li>
              </Typography>

              <Typography paragraph sx={{ mt: 3 }}>
                Whether you're a student, professional, or someone looking to make the most 
                of their time, Proportion provides the insights and tools you need to make 
                every moment count.
              </Typography>
            </Paper>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
