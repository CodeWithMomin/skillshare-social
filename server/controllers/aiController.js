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

module.exports = { summarizeText, summarizeDocument };
