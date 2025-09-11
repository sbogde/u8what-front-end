import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Simple image upload',
    description:
      'Choose a model, upload a photo, and get segments and labels in seconds.',
  },
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Switch between models',
    description:
      'Try YOLOv8 variants and our custom food models trained on MyFoodRepo v0.4 and v2.1.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Clear, overlaid results',
    description:
      'See coloured masks, labels, and confidence for each region in the image.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'Run history',
    description:
      'Recent uploads and predictions appear in a logs table with paging.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Compact stack',
    description:
      'React and MUI on the front end, Flask API on the back end, deployed on Netlify.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Open and practical',
    description:
      'Built with open tools and datasets. Links to docs and datasets are included.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: '#06090a',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4">
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            A small web app for food instance segmentation. Upload a photo, pick a
            model, and view the results. The interface is simple and the parts are
            easy to understand.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.800',
                  background: 'transparent',
                  backgroundColor: 'grey.900',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
