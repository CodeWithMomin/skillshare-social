import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import TimelineIcon from "@mui/icons-material/Timeline";
import LanguageIcon from "@mui/icons-material/Language";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const AboutUs = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7f9", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            p: 6,
            bgcolor: "#f89807",
            borderRadius: 4,
            color: "white",
            boxShadow: "0 10px 30px rgba(248, 152, 7, 0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Background Elements */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              left: -50,
              width: 150,
              height: 150,
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -40,
              right: -20,
              width: 200,
              height: 200,
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />

          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ position: "relative", zIndex: 1 }}
          >
            IUST Alumni Association
          </Typography>
          <Typography
            variant="h6"
            sx={{ position: "relative", zIndex: 1, maxWidth: 700, mx: "auto", opacity: 0.9 }}
          >
            Bridging the gap between the university's glorious past, its dynamic present, and a highly promising future.
          </Typography>
        </Box>

        {/* Mission and Vision */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "rgba(248, 152, 7, 0.1)", width: 70, height: 70, mb: 3 }}>
                <TimelineIcon sx={{ color: "#f89807", fontSize: 36 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="#333">
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                To foster and strengthen lifelong relationships between the university and its alumni. We aim to support the institutional goals of IUST by empowering our graduates and creating a robust network that facilitates professional growth, mentorship, and giving back to the alma mater.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "rgba(248, 152, 7, 0.1)", width: 70, height: 70, mb: 3 }}>
                <LanguageIcon sx={{ color: "#f89807", fontSize: 36 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="#333">
                Our Vision
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                To build an inclusive and globally recognized alumni community that drives innovation, excellence, and social impact. We envision a network where every alumnus feels connected, valued, and inspired to contribute to the legacy of the Islamic University of Science and Technology.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 8 }} />

        {/* What We Do */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="#333">
            What We Do
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: "auto" }}>
            The Alumni Association provides numerous opportunities for alumni to engage with their peers and the university through various initiatives.
          </Typography>

          <Grid container spacing={6} sx={{ mt: 2 }}>
            {[
              {
                icon: <HandshakeIcon sx={{ color: "#f89807", fontSize: 40 }} />,
                title: "Networking & Connections",
                desc: "Facilitating meaningful connections among alumni across different industries and geographical locations.",
              },
              {
                icon: <MenuBookIcon sx={{ color: "#f89807", fontSize: 40 }} />,
                title: "Mentorship Programs",
                desc: "Connecting experienced alumni with current students and recent graduates for career guidance.",
              },
              {
                icon: <EmojiEventsIcon sx={{ color: "#f89807", fontSize: 40 }} />,
                title: "Events & Reunions",
                desc: "Organizing departmental meetups, annual alumni meets, and city-based gatherings.",
              },
              {
                icon: <Diversity3Icon sx={{ color: "#f89807", fontSize: 40 }} />,
                title: "Community Outreach",
                desc: "Mobilizing the alumni network for social causes and community development projects.",
              },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={6} key={idx}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    border: "1px solid rgba(248, 152, 7, 0.1)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                    overflow: 'visible',
                    position: 'relative',
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 22px 40px rgba(248, 152, 7, 0.15)",
                      borderColor: "rgba(248, 152, 7, 0.3)"
                    },
                    "&:hover .icon-container": {
                      bgcolor: "#f89807",
                      "& > *": { color: "white" }
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4, pt: 6 }}>
                    <Box
                      className="icon-container"
                      sx={{
                        position: 'absolute',
                        top: -40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'white',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: "0 10px 25px rgba(248, 152, 7, 0.2)",
                        border: "2px solid #f89807",
                        zIndex: 2,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box sx={{ display: 'flex', transition: "color 0.3s ease" }}>
                        {item.icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: "1.15rem", mt: 2, color: '#333' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: "center",
            p: 6,
            bgcolor: "white",
            borderRadius: 4,
            border: "1px solid rgba(248, 152, 7, 0.2)",
            mt: 8,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Stay Connected, Give Back, Grow Together
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            Your connection with IUST doesn't end at graduation. Update your profile, search the directory, and get involved today!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;