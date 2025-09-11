import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/system';

// Tech logos (mono) using Simple Icons CDN with proper alt text and links
const techLogosLight = [
  { src: 'https://cdn.simpleicons.org/react/111827', alt: 'React', href: 'https://react.dev/' },
  { src: 'https://cdn.simpleicons.org/mui/111827', alt: 'MUI', href: 'https://mui.com/' },
  { src: 'https://cdn.simpleicons.org/pytorch/111827', alt: 'PyTorch', href: 'https://pytorch.org/' },
  { src: 'https://cdn.simpleicons.org/googlecolab/111827', alt: 'Google Colab', href: 'https://colab.research.google.com/' },
  { src: 'https://cdn.simpleicons.org/flask/111827', alt: 'Flask', href: 'https://flask.palletsprojects.com/' },
  { src: 'https://cdn.simpleicons.org/netlify/111827', alt: 'Netlify', href: 'https://www.netlify.com/' },
  { src: 'https://cdn.simpleicons.org/ultralytics/111827', alt: 'Ultralytics', href: 'https://ultralytics.com/' },
];

const techLogosDark = [
  { src: 'https://cdn.simpleicons.org/react/ffffff', alt: 'React', href: 'https://react.dev/' },
  { src: 'https://cdn.simpleicons.org/mui/ffffff', alt: 'MUI', href: 'https://mui.com/' },
  { src: 'https://cdn.simpleicons.org/pytorch/ffffff', alt: 'PyTorch', href: 'https://pytorch.org/' },
  { src: 'https://cdn.simpleicons.org/googlecolab/ffffff', alt: 'Google Colab', href: 'https://colab.research.google.com/' },
  { src: 'https://cdn.simpleicons.org/flask/ffffff', alt: 'Flask', href: 'https://flask.palletsprojects.com/' },
  { src: 'https://cdn.simpleicons.org/netlify/ffffff', alt: 'Netlify', href: 'https://www.netlify.com/' },
  { src: 'https://cdn.simpleicons.org/ultralytics/ffffff', alt: 'Ultralytics', href: 'https://ultralytics.com/' },
];

const logoStyle = {
  width: '100px',
  height: '80px',
  margin: '0 32px',
  opacity: 0.7,
};

export default function LogoCollection() {
  const theme = useTheme();
  const API_BASE = process.env.REACT_APP_API_URL;
  // In light mode we prefer darker marks; in dark mode we prefer white
  const logos = theme.palette.mode === 'light' ? techLogosLight : techLogosDark;

  // Food recognition examples and dataset cards
  const recogniseItems = [
    {
      src: API_BASE ? `${API_BASE}/uploads/mici.jpg` : '/imgs/mici.jpg',
      alt: 'Mici (Mititei)',
      href: 'https://en.wikipedia.org/wiki/Mititei',
    },
    {
      src: API_BASE ? `${API_BASE}/uploads/sarmale.jpg` : '/imgs/sarmale.jpg',
      alt: 'Sarmale (Cabbage rolls)',
      href: 'https://en.wikipedia.org/wiki/Sarma_(food)',
    },
    {
      src: API_BASE ? `${API_BASE}/uploads/mamaliga.jpg` : '/imgs/mamaliga.jpg',
      alt: 'Mămăligă (Polenta)',
      href: 'https://en.wikipedia.org/wiki/M%C4%83m%C4%83lig%C4%83',
    },
    {
      src: API_BASE ? `${API_BASE}/uploads/yorkshire-pudding.jpg` : '/imgs/yorkshire-pudding.jpg',
      alt: 'Yorkshire pudding',
      href: 'https://en.wikipedia.org/wiki/Yorkshire_pudding',
    },
    {
      src: '/static/mfr-v21-collage.png',
      alt: 'MyFoodRepo v2.1 dataset collage',
      href: 'https://www.aicrowd.com/challenges/food-recognition-benchmark-2022',
    },
    {
      src: '/static/mfr-v04-collage.jpg',
      alt: 'MyFoodRepo v0.4 dataset collage',
      href: 'https://www.aicrowd.com/challenges/food-recognition-challenge/',
    },
  ];

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        color="text.secondary"
      >
        From notebook to Netlify: train, segment, deploy
      </Typography>
      <Grid container justifyContent="center" sx={{ mt: 0.5, opacity: 0.6 }}>
        {logos.map((logo, index) => (
          <Grid item key={index}>
            {logo.href ? (
              <a href={logo.href} target="_blank" rel="noopener noreferrer">
                <img src={logo.src} alt={logo.alt} style={logoStyle} />
              </a>
            ) : (
              <img src={logo.src} alt={logo.alt} style={logoStyle} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* What u8what recognises */}
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        color="text.secondary"
        sx={{ mt: 4 }}
      >
        What u8what recognises
      </Typography>
      <Grid container justifyContent="center" sx={{ mt: 0.5, opacity: 0.9 }}>
        {recogniseItems.map((item, index) => (
          <Grid item key={index}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <img src={item.src} alt={item.alt} style={logoStyle} />
              </a>
            ) : (
              <img src={item.src} alt={item.alt} style={logoStyle} />
            )}
          </Grid>
        ))}
      </Grid>
      <Typography
        component="p"
        variant="caption"
        align="center"
        color="text.secondary"
        sx={{ mt: 1, display: 'block' }}
      >
        Models trained on MyFoodRepo datasets:
        {' '}
        <Link
          href="https://www.aicrowd.com/challenges/food-recognition-benchmark-2022"
          target="_blank"
          rel="noopener noreferrer"
        >
          v2.1
        </Link>
        {' '}and{' '}
        <Link
          href="https://www.aicrowd.com/challenges/food-recognition-challenge/"
          target="_blank"
          rel="noopener noreferrer"
        >
          v0.4
        </Link>
      </Typography>
    </Box>
  );
}
