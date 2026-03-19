import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const categorizeExpense = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Analyze the following expense description and extract the category, amount, and a clean title.

Categories:
Operations, Marketing, Software, Food, Travel, Bills, Shopping, Salary, Other

Input: "${description}"

Return ONLY JSON format:
{
  "category": "One of the above categories",
  "amount": "Extracted numerical amount (or null if not found)",
  "title": "A short, clean description of the expense"
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean response (important)
    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);

    return res.json(parsed);

  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: "AI categorization failed" });
  }
};