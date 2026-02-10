const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parse job details from voice transcript using Gemini AI
 */
exports.parseJobFromVoice = async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({
                success: false,
                message: 'Transcript is required'
            });
        }

        // Get Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create prompt for structured extraction
        const prompt = `
You are an AI assistant that extracts job posting information from voice transcripts.
Parse the following transcript and extract job details in JSON format.

Transcript: "${transcript}"

Extract and return ONLY a valid JSON object with these fields:
{
  "title": "job title (e.g., 'Python Developer', 'Full Stack Engineer')",
  "description": "detailed job description",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "budgetMin": number (in rupees, convert K to thousands),
  "budgetMax": number (in rupees, convert K to thousands),
  "locationPreference": "location (e.g., 'Remote', 'Mumbai', 'Bangalore')",
  "duration": "duration (e.g., '3 months', '2 weeks')",
  "jobType": "freelance" or "contract" or "full-time" or "part-time"
}

Rules:
- If a field is not mentioned, use empty string "" or empty array []
- For budgetMin/budgetMax, use 0 if not mentioned
- Convert "10K" to 10000, "50k" to 50000, etc.
- Return ONLY the JSON object, no additional text
- Ensure all fields are present in the response
`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        let parsedData;
        try {
            // Extract JSON from response (remove markdown code blocks if present)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            return res.status(500).json({
                success: false,
                message: 'Failed to parse AI response',
                error: parseError.message
            });
        }

        res.status(200).json({
            success: true,
            data: parsedData
        });

    } catch (error) {
        console.error('Error in parseJobFromVoice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to parse job details',
            error: error.message
        });
    }
};
