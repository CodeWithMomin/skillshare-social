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
    <div className="flex min-h-[calc(100vh-140px)] w-full items-start justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden mt-4">
        {/* Card Header */}
        <div className="text-center p-6 pb-2">
          <h2 className="flex items-center justify-center gap-2 text-3xl font-bold font-inter text-gray-800">
            <DescriptionIcon className="text-gray-800" fontSize="large" sx={{ color: '#111827' }} />
            Document Summarizer
          </h2>
          <p className="text-gray-500 mt-2 font-inter text-sm">Paste text or upload a document to generate a concise summary.</p>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-6">

          {/* Tabs UI */}
          <div className="w-full flex bg-gray-100/80 p-1 rounded-lg">
            <button onClick={() => { setMode('text'); handleClear(); }} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${mode === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Paste Text</button>
            <button onClick={() => { setMode('document'); handleClear(); }} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${mode === 'document' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Upload Document</button>
          </div>

          <div className="mt-4">
            {mode === 'text' && (
              <div>
                <textarea
                  placeholder="Paste your text here..."
                  className="w-full min-h-[500px] p-4 text-sm text-gray-800 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-inter resize-none bg-white shadow-sm leading-relaxed"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <div className="mt-2 flex gap-4 text-xs text-gray-500 font-inter">
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
                className={`flex min-h-[350px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${selectedFile ? 'border-gray-300 bg-gray-50/50' : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50 cursor-pointer shadow-sm'}`}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
                <p className="text-sm font-inter text-gray-500">
                  Drag & drop a file here, or <span className="font-medium text-gray-900">browse</span>
                </p>
                <p className="text-xs text-gray-400 font-inter">PDF, TXT (Max: 5MB)</p>
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 rounded-md bg-gray-200/60 px-3 py-1.5 text-sm text-gray-800 font-inter font-medium z-10" onClick={(e) => e.stopPropagation()}>
                    <DescriptionIcon fontSize="small" sx={{ color: '#4b5563' }} />
                    {selectedFile.name}
                    <button onClick={(e) => { e.stopPropagation(); handleClear(); }} className="ml-1 text-gray-500 hover:text-gray-800">
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            )}
          </div>

          <Button
            variant="contained"
            onClick={mode === 'text' ? handleSummarizeText : handleSummarizeDocument}
            disabled={loading || (mode === 'text' ? !textInput.trim() : !selectedFile)}
            sx={{
              width: '100%',
              py: 1.5,
              borderRadius: '6px',
              backgroundColor: '#111827',
              color: 'white',
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              fontFamily: 'Inter',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#1f2937',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              },
              '&.Mui-disabled': {
                backgroundColor: '#f3f4f6',
                color: '#9ca3af'
              }
            }}
          >
            {loading ? <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} /> : <AutoAwesomeIcon sx={{ fontSize: 16, mr: 1 }} />}
            {loading ? "Generating..." : "Generate Summary"}
          </Button>

          {(summary || loading) && (
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-5 mt-6 transition-all shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 font-inter">Summary</h3>
                {summary && !loading && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-100 transition-colors bg-white font-medium text-gray-700 font-inter shadow-sm"
                  >
                    <ContentCopyIcon sx={{ fontSize: 14 }} /> Copy
                  </button>
                )}
              </div>
              {loading ? (
                <div className="py-4 text-center space-y-2 text-gray-500">
                  <CircularProgress size={24} sx={{ color: '#111827' }} />
                  <p className="text-sm font-inter mt-3">Applying AI context to generate a summary...</p>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-gray-600 font-inter whitespace-pre-line">{summary}</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AiFeatures;