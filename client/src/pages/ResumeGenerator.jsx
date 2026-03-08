import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import {
    Box, Typography, Button, CircularProgress,
    Container, Paper, Grid, Divider, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Download, Sparkles, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("authToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const ResumeGenerator = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState('classic');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const resumeRef = useRef();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(`${API}/users/profile`, { headers: authHeader() });
            setUserData(data.user || data);
        } catch (error) {
            toast.error('Failed to load user profile data.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
        documentTitle: userData ? `${userData.fullName.replace(/\s+/g, '_')}_Resume` : 'Resume',
    });

    const handleAiEnhance = async () => {
        if (!userData) return;
        setIsEnhancing(true);
        const toastId = toast.loading("Birju AI is enhancing your resume content...");

        try {
            // Just sending their bio and experience for an overall rewrite to sound more professional
            // In a more complex app we would rewrite each field, but here we do a simple pass.
            const prompt = `You are an expert resume writer. I am going to give you my current resume details (bio and work experience). Please rewrite my bio to be a highly professional, ATS-friendly summary (keep it under 3 sentences). Also rewrite all my work experience descriptions to use strong action verbs and highlight impact. Return it in JSON format ONLY: { "bio": "new bio", "experience": [ { "id": "original_id", "description": "new description" } ] } ... Here is my data: Bio: ${userData.bio}. Experience: ${JSON.stringify(userData.experience)}`;

            const { data } = await axios.post(`${API}/ai/chat`, { message: prompt }, { headers: authHeader() });

            try {
                // Find JSON block in reply
                let replyText = data.reply;
                const jsonMatch = replyText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);

                    let updatedExperience = [...userData.experience];
                    if (parsed.experience && Array.isArray(parsed.experience)) {
                        updatedExperience = updatedExperience.map(exp => {
                            const matched = parsed.experience.find(e => e.id === exp._id || e.id === exp.title);
                            if (matched) return { ...exp, description: matched.description };
                            return exp;
                        });
                    }

                    setUserData({
                        ...userData,
                        bio: parsed.bio || userData.bio,
                        experience: updatedExperience
                    });

                    toast.success("Resume enhanced successfully!", { id: toastId });
                } else {
                    throw new Error("Could not parse AI response into JSON");
                }
            } catch (parseErr) {
                // Fallback if AI didn't return proper JSON, we just let the user know
                toast.error("Birju couldn't format the response properly. Try again.", { id: toastId });
            }

        } catch (error) {
            toast.error("AI Enhancement failed.", { id: toastId });
        } finally {
            setIsEnhancing(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 80px)">
                <CircularProgress sx={{ color: '#ee9917' }} />
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box p={4} textAlign="center">
                <Typography variant="h5">No profile data found. Please complete your profile first.</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Controls Sidebar */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', position: 'sticky', top: 100 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <FileText color="#ee9917" />
                            <Typography variant="h6" fontWeight="bold">Resume Builder</Typography>
                        </Box>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Template Style</InputLabel>
                            <Select
                                value={template}
                                label="Template Style"
                                onChange={(e) => setTemplate(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="classic">Classic Minimalist</MenuItem>
                                <MenuItem value="modern">Modern Tech</MenuItem>
                                {/* <MenuItem value="creative">Creative Format</MenuItem> */}
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleAiEnhance}
                            disabled={isEnhancing || !userData.experience?.length}
                            startIcon={isEnhancing ? <CircularProgress size={16} /> : <Sparkles size={18} />}
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                color: '#ee9917',
                                borderColor: '#ee9917',
                                '&:hover': { borderColor: '#d68713', bgcolor: 'rgba(238, 153, 23, 0.05)' }
                            }}
                        >
                            {isEnhancing ? "Enhancing..." : "Enhance with Birju AI"}
                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handlePrint}
                            startIcon={<Download />}
                            sx={{
                                borderRadius: 2,
                                bgcolor: '#111827',
                                '&:hover': { bgcolor: '#1f2937' },
                                py: 1.5
                            }}
                        >
                            Download PDF
                        </Button>

                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                            We auto-fill this using your SkillShare profile data.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Resume Preview */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ overflowX: 'auto', bgcolor: '#f3f4f6', p: 4, borderRadius: 3 }}>
                        {/* Printable Area Wrapper to act like A4 paper */}
                        <Box
                            sx={{
                                width: '210mm',
                                minHeight: '297mm',
                                margin: '0 auto',
                                bgcolor: 'white',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                p: '20mm', // standard margin
                                boxSizing: 'border-box'
                            }}
                        >
                            <div ref={resumeRef} className={`resume-template-${template}`}>
                                <ResumeContent data={userData} template={template} />
                            </div>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Embedded CSS for the templates so they print nicely */}
            <style>{`
        /* Shared Print Styles */
        @media print {
          @page { margin: 0; size: auto; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .resume-container { padding: 40px !important; }
        }

        /* Template: Classic */
        .resume-template-classic {
          font-family: 'Times New Roman', Times, serif;
          color: #000;
          line-height: 1.5;
        }
        .resume-template-classic h1 { font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;}
        .resume-template-classic .contact { text-align: center; font-size: 10pt; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 10px; }
        .resume-template-classic .section-title { font-size: 13pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-top: 15px; margin-bottom: 10px; padding-bottom: 2px;}
        .resume-template-classic .item-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 11pt; margin-top: 10px; }
        .resume-template-classic .item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 10pt; margin-bottom: 5px; }
        .resume-template-classic .description { font-size: 10pt; margin: 0; padding-left: 15px; }
        .resume-template-classic .skills-list { font-size: 10pt; }

        /* Template: Modern */
        .resume-template-modern {
          font-family: 'Inter', 'Helvetica', sans-serif;
          color: #333;
          line-height: 1.6;
        }
        .resume-template-modern h1 { font-size: 28pt; font-weight: 800; color: #111827; margin-bottom: 5px; letter-spacing: -0.5px;}
        .resume-template-modern .headline { font-size: 14pt; color: #ee9917; font-weight: 500; margin-bottom: 15px;}
        .resume-template-modern .contact { font-size: 10pt; color: #6b7280; margin-bottom: 25px; display: flex; gap: 15px; flex-wrap: wrap; }
        .resume-template-modern .section-title { font-size: 14pt; font-weight: 700; color: #111827; margin-top: 25px; margin-bottom: 15px; display: flex; alignItems: center; gap: 10px; }
        .resume-template-modern .section-title::after { content: ""; flex: 1; height: 1px; background: #e5e7eb; }
        .resume-template-modern .item-header { display: flex; justify-content: space-between; font-size: 12pt; margin-top: 15px; color: #111827; }
        .resume-template-modern .item-header strong { font-weight: 600; }
        .resume-template-modern .item-sub { display: flex; justify-content: space-between; font-size: 10.5pt; color: #ee9917; font-weight: 500; margin-bottom: 5px; }
        .resume-template-modern .description { font-size: 10pt; color: #4b5563; }
        .resume-template-modern .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .resume-template-modern .skill-badge { background: #f3f4f6; padding: 4px 10px; border-radius: 6px; font-size: 9.5pt; font-weight: 500; color: #374151; }
      `}</style>
        </Container>
    );
};

// Extracted stateless component for rendering the actual printable content
const ResumeContent = ({ data, template }) => {
    const { fullName, email, phone, location, headline, bio, experience, education, skills, projects } = data;

    const renderContact = () => {
        let items = [];
        if (email) items.push(email);
        if (phone) items.push(phone);
        if (location) items.push(location);
        if (items.length === 0) return null;

        if (template === 'classic') {
            return <div className="contact">{items.join(' | ')}</div>;
        } else {
            return <div className="contact">{items.map((i, idx) => <span key={idx}>{i}</span>)}</div>
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Present";
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return dateString; // fallback to string if not parsed
            return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch { return dateString; }
    };

    return (
        <div className="resume-container">
            {/* Header */}
            <h1>{fullName}</h1>
            {template === 'modern' && headline && <div className="headline">{headline}</div>}
            {renderContact()}

            {/* Summary / Bio */}
            {bio && (
                <div style={{ marginBottom: template === 'modern' ? '25px' : '0' }}>
                    {template === 'classic' ? <div className="section-title">Professional Summary</div> : null}
                    <div className="description" style={{ paddingLeft: 0, fontSize: template === 'modern' ? '10.5pt' : '10pt', color: template === 'modern' ? '#4b5563' : '#000' }}>
                        {bio}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div>
                    <div className="section-title">Experience</div>
                    {experience.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: template === 'classic' ? '15px' : '20px' }}>
                            <div className="item-header">
                                <strong>{exp.title}</strong>
                                <span style={{ fontWeight: template === 'classic' ? 'normal' : '500' }}>{exp.location}</span>
                            </div>
                            <div className="item-sub">
                                <span>{exp.company}</span>
                                <span>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                            </div>
                            {exp.description && (
                                <div className="description">
                                    {/* Handle multiline descriptions nicely, converting to list items if it feels like bullet points, or just simple paragraphs */}
                                    {exp.description.split('\n').filter(line => line.trim() !== '').map((line, lIdx) => (
                                        <p key={lIdx} style={{ margin: '3px 0', paddingLeft: template === 'classic' ? '20px' : '0', display: 'flex' }}>
                                            {template === 'classic' && <span style={{ marginRight: '8px' }}>•</span>}
                                            {line.replace(/^[-•*]\s*/, '')}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div>
                    <div className="section-title">Education</div>
                    {education.map((edu, idx) => (
                        <div key={idx} style={{ marginBottom: template === 'classic' ? '10px' : '15px' }}>
                            <div className="item-header">
                                <strong>{edu.school}</strong>
                                <span style={{ fontWeight: template === 'classic' ? 'normal' : '500' }}>{formatDate(edu.endDate)}</span>
                            </div>
                            <div className="item-sub">
                                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <div>
                    <div className="section-title">Projects</div>
                    {projects.map((proj, idx) => (
                        <div key={idx} style={{ marginBottom: template === 'classic' ? '15px' : '20px' }}>
                            <div className="item-header">
                                <strong>{proj.title}</strong>
                            </div>
                            {proj.description && (
                                <div className="description" style={{ marginTop: '5px', paddingLeft: template === 'classic' ? '15px' : '0' }}>
                                    {proj.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div>
                    <div className="section-title">Skills</div>
                    {template === 'classic' ? (
                        <div className="skills-list">
                            {skills.map(s => s.name).join(', ')}
                        </div>
                    ) : (
                        <div className="skills-list">
                            {skills.map((s, i) => <div key={i} className="skill-badge">{s.name}</div>)}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default ResumeGenerator;
