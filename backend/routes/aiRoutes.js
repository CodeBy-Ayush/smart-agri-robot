const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/recommend-crop", async(req, res) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
      Based on this soil data:
      ${JSON.stringify(req.body)}

      Return STRICT JSON with no backticks.

      FORMAT:
      {
        "crop": "",
        "confidence": "",
        "estimatedYield": "",
        "waterNeeds": "",
        "marketPrice": "",
        "requiredFertilizer": "",
        "tips": ["", "", ""],
        "riskAnalysis": ""
      }
    `;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Remove ```json or ```
        text = text.replace(/```json/g, "").replace(/```/g, "");

        // Extract JSON
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        const jsonString = text.substring(start, end + 1);

        const finalData = JSON.parse(jsonString);

        res.json(finalData);

    } catch (err) {
        console.error("AI ERROR:", err);
        res.status(500).json({ msg: "AI failed", error: err.message });
    }
});

module.exports = router;