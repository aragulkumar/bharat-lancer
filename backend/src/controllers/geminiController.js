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
You are an AI assistant that extracts job posting information from voice transcripts in ANY language (English, Tamil, Hindi, etc.).

IMPORTANT INSTRUCTIONS:
1. If the transcript is in Tamil or any other language, TRANSLATE it to English first
2. Extract job details and return them in English
3. For budget amounts, be smart about parsing:
   - "10K" or "10 thousand" = 10000
   - "50K" or "50 thousand" = 50000
   - "1 lakh" or "100K" = 100000
   - "2 lakhs" or "200K" = 200000
   - Tamil numbers: "பத்து ஆயிரம்" (10 thousand) = 10000
   - If only ONE amount is mentioned, use it as budgetMax and set budgetMin to 0
   - If TWO amounts mentioned, smaller is budgetMin, larger is budgetMax

Transcript: "${transcript}"

Extract and return ONLY a valid JSON object with these fields:
{
  "title": "job title in English (e.g., 'Python Developer', 'Full Stack Engineer')",
  "description": "detailed job description in English (translate if needed)",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "budgetMin": number (in rupees, 0 if not mentioned or only max mentioned),
  "budgetMax": number (in rupees, 0 if not mentioned),
  "locationPreference": "location in English (e.g., 'Remote', 'Mumbai', 'Chennai')",
  "duration": "duration in English (e.g., '3 months', '2 weeks')",
  "jobType": "freelance" or "contract" or "full-time" or "part-time"
}

EXAMPLES:
- "எனக்கு Python developer வேணும் 50K-க்கு" → budgetMin: 0, budgetMax: 50000
- "I need developer for 30000 to 50000" → budgetMin: 30000, budgetMax: 50000
- "Budget is 1 lakh" → budgetMin: 0, budgetMax: 100000
- "பத்து ஆயிரம் to இருபது ஆயிரம்" → budgetMin: 10000, budgetMax: 20000

Rules:
- ALWAYS translate non-English text to English
- If a field is not mentioned, use empty string "" or empty array []
- For budgetMin/budgetMax, use 0 if not mentioned
- Return ONLY the JSON object, no additional text
- Ensure all fields are present in the response
`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini Raw Response:', text);

        // Parse JSON from response
        let parsedData;
        try {
            // Extract JSON from response (remove markdown code blocks if present)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
                console.log('Parsed JSON Data:', parsedData);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            console.error('Raw text:', text);
            return res.status(500).json({
                success: false,
                message: 'Failed to parse AI response',
                error: parseError.message,
                rawResponse: text
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
