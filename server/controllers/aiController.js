const summarizeText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Text is required for summarization' });
        }

        // Limit the character length so it doesn't blow up the API limits 
        // Bart model has a max token limit, so we only send the first ~3000 chars
        const textToSummarize = text.substring(0, 3000);

        // Dynamically calculate summary length bounds based on input size
        const wordCount = textToSummarize.split(/\s+/).length;
        const calculatedMaxLength = Math.max(50, Math.min(600, Math.floor(wordCount * 0.4)));
        const calculatedMinLength = Math.max(20, Math.min(200, Math.floor(wordCount * 0.1)));

        // Make API call to Hugging Face
        // facebook/bart-large-cnn is widely used for text summarization
        const response = await fetch("https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn", {
            headers: {
                "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                inputs: textToSummarize,
                parameters: {
                    max_length: calculatedMaxLength,
                    min_length: calculatedMinLength,
                    do_sample: false
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Hugging Face API error: ${response.status}`);
        }

        const result = await response.json();

        // Ensure result is in expected format (usually an array of objects)
        if (result && result.length > 0 && result[0].summary_text) {
            res.status(200).json({ summary: result[0].summary_text });
        } else {
            throw new Error("Unexpected response structure from Hugging Face");
        }

    } catch (error) {
        console.error("Summarization error:", error);
        res.status(500).json({ error: error.message || "An error occurred during summarization" });
    }
};

const pdfParse = require('pdf-parse');

const summarizeDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No document uploaded' });
        }

        let extractedText = "";

        // Handle PDF
        if (req.file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(req.file.buffer);
            extractedText = pdfData.text;
        }
        // Handle Text files
        else if (req.file.mimetype === 'text/plain') {
            extractedText = req.file.buffer.toString('utf-8');
        }
        else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' });
        }

        if (!extractedText || extractedText.trim() === '') {
            return res.status(400).json({ error: 'Could not extract text from document or document is empty' });
        }

        // Limit the character length so it doesn't blow up the API limits 
        // Bart model has a max token limit, so we only send the first ~3000 chars (approx 700 words)
        const textToSummarize = extractedText.substring(0, 3000);

        // Dynamically calculate summary length bounds based on input size
        const wordCount = textToSummarize.split(/\s+/).length;
        const calculatedMaxLength = Math.max(50, Math.min(600, Math.floor(wordCount * 0.35)));
        const calculatedMinLength = Math.max(20, Math.min(250, Math.floor(wordCount * 0.1)));

        // Make API call to Hugging Face
        const response = await fetch("https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn", {
            headers: {
                "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                inputs: textToSummarize,
                parameters: {
                    max_length: calculatedMaxLength,
                    min_length: calculatedMinLength,
                    do_sample: false
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Hugging Face API error: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.length > 0 && result[0].summary_text) {
            res.status(200).json({ summary: result[0].summary_text });
        } else {
            throw new Error("Unexpected response structure from Hugging Face");
        }

    } catch (error) {
        console.error("Document Summarization error:", error);
        res.status(500).json({ error: error.message || "An error occurred during document summarization" });
    }
};

const chatbot = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' });
        }

        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        if (!GROQ_API_KEY) {
            return res.status(500).json({ error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env file.' });
        }

        // Build messages array in OpenAI-compatible format
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful, friendly AI assistant on a professional skill-sharing social platform called SkillShare Social. Be concise, clear, and helpful. Keep responses under 3 short paragraphs unless more detail is explicitly needed.'
            }
        ];

        // Add past conversation turns (last 10 turns for context)
        history.slice(-10).forEach(turn => {
            if (turn.role === 'user') messages.push({ role: 'user', content: turn.content });
            if (turn.role === 'bot') messages.push({ role: 'assistant', content: turn.content });
        });

        // Add current user message
        messages.push({ role: 'user', content: message });

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages,
                max_tokens: 512,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Groq API error: ${response.status}`);
        }

        const result = await response.json();
        const reply = result?.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            throw new Error('No response generated. Please try again.');
        }

        res.status(200).json({ reply });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: error.message || 'An error occurred in the chatbot' });
    }
};

/* ── Image analysis via Groq vision model ── */
const analyzeImage = async (req, res) => {
    try {
        const { imageBase64, mimeType, question, history = [] } = req.body;

        if (!imageBase64 || !mimeType) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        if (!GROQ_API_KEY) {
            return res.status(500).json({ error: 'Groq API key not configured' });
        }

        const userQuestion = question?.trim() || 'Describe this image in detail.';

        // Build messages with vision content
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant with vision capabilities. Analyze images clearly and describe what you see. Be concise and helpful.',
            },
        ];

        // Add past text turns for context
        history.slice(-6).forEach((turn) => {
            if (turn.role === 'user' || turn.role === 'bot') {
                messages.push({ role: turn.role === 'bot' ? 'assistant' : 'user', content: turn.content });
            }
        });

        // Add the vision message (image + question)
        messages.push({
            role: 'user',
            content: [
                {
                    type: 'image_url',
                    image_url: { url: `data:${mimeType};base64,${imageBase64}` },
                },
                { type: 'text', text: userQuestion },
            ],
        });

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages,
                max_tokens: 512,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Groq API error: ${response.status}`);
        }

        const result = await response.json();
        const reply = result?.choices?.[0]?.message?.content?.trim();

        if (!reply) throw new Error('No response generated.');

        res.status(200).json({ reply });
    } catch (error) {
        console.error('Image analysis error:', error);
        res.status(500).json({ error: error.message || 'Failed to analyze the image' });
    }
};

module.exports = { summarizeText, summarizeDocument, chatbot, analyzeImage };
