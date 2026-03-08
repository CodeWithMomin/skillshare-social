import React, { useState, useRef } from 'react';
import { Typography, Button, CircularProgress, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AiFeatures = ({ initialMode = 'text' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mode, setMode] = useState(initialMode); // 'text' or 'document'
  const open = Boolean(anchorEl);

  // Text Mode State
  const [textInput, setTextInput] = useState('');

  // Document Mode State
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Keep the mode in sync with the current route prop (e.g. clicking sidebar links)
  React.useEffect(() => {
    setMode(initialMode);
    handleClear();
  }, [initialMode]);

  // Shared State
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    handleClear(); // Clear inputs when switching modes
    handleClose();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Ensure it's a valid type (PDF or Text)
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      toast.error("Please select a PDF or Text (.txt) file.");
      return;
    }

    // Limit file size (e.g., 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File is too large. Max size is 25MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSummarizeText = async () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text to summarize.");
      return;
    }

    if (textInput.trim().split(/\s+/).length < 20) {
      toast.error("Text is quite short. Please provide a bit more context (20+ words).");
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const res = await axios.post("http://localhost:5000/api/ai/summarize", {
        text: textInput
      });

      if (res.data?.summary) {
        setSummary(res.data.summary);
        toast.success("Summary generated successfully!");
      }
    } catch (error) {
      console.error("Error summarizing text:", error);
      const errMsg = error.response?.data?.error || "Failed to summarize text.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeDocument = async () => {
    if (!selectedFile) {
      toast.error("Please upload a document to summarize.");
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);

      const res = await axios.post("http://localhost:5000/api/ai/summarize-document", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.summary) {
        setSummary(res.data.summary);
        toast.success("Document summarized successfully!");
      }
    } catch (error) {
      console.error("Error summarizing document:", error);
      const errMsg = error.response?.data?.error || "Failed to summarize document.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast.success("Summary copied to clipboard!");
    }
  };

  const handleClear = () => {
    setTextInput('');
    setSelectedFile(null);
    setSummary('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      handleFileSelect({ target: { files: [droppedFile] } });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: '#111827', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Document Summarizer
            </h1>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
              Transform long documents or text into clear, concise summaries in seconds.
            </p>
          </div>

          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {/* Custom Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#fdfdfd' }}>
              <button
                onClick={() => { setMode('text'); handleClear(); }}
                style={{
                  flex: 1, padding: '20px', border: 'none', background: mode === 'text' ? '#fff' : 'transparent',
                  color: mode === 'text' ? '#111827' : '#9ca3af', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                  borderBottom: mode === 'text' ? '3px solid #111827' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                Paste Text
              </button>
              <button
                onClick={() => { setMode('document'); handleClear(); }}
                style={{
                  flex: 1, padding: '20px', border: 'none', background: mode === 'document' ? '#fff' : 'transparent',
                  color: mode === 'document' ? '#111827' : '#9ca3af', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                  borderBottom: mode === 'document' ? '3px solid #111827' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                Upload Document
              </button>
            </div>

            <div style={{ padding: '40px' }}>
              {mode === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      placeholder="Paste your long text here..."
                      style={{
                        width: '100%', minHeight: '400px', padding: '24px', borderRadius: 16, border: '1px solid #e5e7eb',
                        fontSize: '15px', color: '#374151', fontFamily: 'Inter', lineHeight: '1.7', outline: 'none',
                        resize: 'vertical', background: '#fafafa', boxSizing: 'border-box', transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#111827'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(17,24,39,0.05)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, fontSize: '13px', color: '#9ca3af' }}>
                    <span>{textInput.trim() ? textInput.trim().split(/\s+/).length : 0} words</span>
                    <span>{textInput.length} characters</span>
                  </div>
                </div>
              )}

              {mode === 'document' && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => !selectedFile && fileInputRef.current?.click()}
                  style={{
                    minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 20, borderRadius: 20, border: '2px dashed #e5e7eb', background: '#fafafa',
                    cursor: selectedFile ? 'default' : 'pointer', transition: 'all 0.2s', position: 'relative'
                  }}
                  onMouseEnter={(e) => { if (!selectedFile) { e.currentTarget.style.borderColor = '#111827'; e.currentTarget.style.background = '#f9fafb'; } }}
                  onMouseLeave={(e) => { if (!selectedFile) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fafafa'; } }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <CloudUploadIcon sx={{ fontSize: 32, color: '#111827' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 17, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
                      {selectedFile ? 'File ready to summarize' : 'Click to browse or drag and drop'}
                    </p>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Supports PDF and Text files (Max 25MB)</p>
                  </div>

                  {selectedFile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: '#111827', borderRadius: 12, color: '#fff' }}>
                      <InsertDriveFileIcon fontSize="small" />
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{selectedFile.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleClear(); }} style={{ border: 'none', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '2px', cursor: 'pointer', display: 'flex', color: '#fff' }}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </button>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={handleFileSelect} />
                </div>
              )}

              <div style={{ marginTop: 32 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={mode === 'text' ? handleSummarizeText : handleSummarizeDocument}
                  disabled={loading || (mode === 'text' ? !textInput.trim() : !selectedFile)}
                  sx={{
                    py: 2, borderRadius: '14px', backgroundColor: '#111827', color: 'white', textTransform: 'none',
                    fontSize: '16px', fontWeight: 600, fontFamily: 'Inter', boxShadow: '0 4px 12px rgba(17,24,39,0.15)',
                    '&:hover': { backgroundColor: '#1f2937' },
                    '&.Mui-disabled': { backgroundColor: '#f3f4f6', color: '#9ca3af' }
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1.5 }} /> : <AutoAwesomeIcon sx={{ fontSize: 18, mr: 1.5 }} />}
                  {loading ? "Processing..." : "Generate Summary"}
                </Button>
              </div>

              <AnimatePresence>
                {(summary || loading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 40, borderTop: '1px solid #e5e7eb', paddingTop: 40 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Resulting Summary</h3>
                      {summary && !loading && (
                        <button
                          onClick={handleCopy}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10,
                            border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13,
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#111827'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                        >
                          <ContentCopyIcon sx={{ fontSize: 16 }} /> Copy Summary
                        </button>
                      )}
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: 20, padding: '32px', border: '1px solid #e2e8f0', minHeight: '100px', position: 'relative' }}>
                      {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
                          <CircularProgress size={28} sx={{ color: '#111827' }} />
                          <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Analyzing content and distilling key points...</p>
                        </div>
                      ) : (
                        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#334155', margin: 0, whiteSpace: 'pre-line' }}>
                          {summary}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiFeatures;
