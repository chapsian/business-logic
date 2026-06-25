import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Avoid temporal dead zone by checking environment safely
const getDirname = () => {
  try {
    if (typeof __dirname !== 'undefined') {
      return __dirname;
    }
  } catch (e) {}
  try {
    if (import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch (e) {}
  return process.cwd();
};

const _dirname = getDirname();

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (isProd) {
    app.set('trust proxy', true);
    
    // Force HTTP-to-HTTPS redirect for Google AdsBot and clients
    app.use((req, res, next) => {
      const proto = req.headers['x-forwarded-proto'];
      if (proto && proto !== 'https') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
      }
      next();
    });
  }

  app.use(express.json({ limit: '15mb' }));

  // Initialize Gemini API
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is not configured in .env or secrets context.");
  }
  const ai = apiKey ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  }) : null;

  // AI Chat Endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ 
          reply: "⚠️ Gemini API key is missing. Please add GEMINI_API_KEY to your appSecrets in AI Studio Settings." 
        });
      }
      const { message, history, userContext } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          ...history.map((h: any) => ({
            role: h.role,
            parts: h.parts.map((p: any) => ({ text: p.text }))
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: `You are the Business Logic AI Tax Assistant specialized in Kenyan tax compliance (KRA iTax), payroll deductions (PAYE, SHA/NHIF, NSSF, Housing Levy), bookkeeping advice, and KRA statutory guidelines.

We offer bookkeeping pricing plans:
- Micro Business (0-3 employees): KSh 6,000/month
- Small Business (3-10 employees): KSh 12,000/month (Most popular)
- Growing SME ( > 10 employees): KSh 25,000/month

The logged-in user is ${userContext?.name || 'Client'}${userContext?.companyName ? ', representing ' + userContext?.companyName : ''}. Their company currently has ${userContext?.employeeCount ?? 0} employees, placing them in the ${userContext?.employeeCount <= 3 ? 'Micro Business' : userContext?.employeeCount <= 10 ? 'Small Business' : 'Growing SME'} pricing list.
They are on a ${userContext?.isPremium ? 'Premium Plan (unlocked)' : 'Free Trial'}.

Respond concisely and professionally in Swahili/English (Sheng where appropriate syntax-wise, but maintain consulting corporate authority). Reference Kenyan tax laws (e.g., KRA iTax, Employment Act 2007, Income Tax Act, Affordable Housing Act). Offer useful advice but maintain clear formatting using short paragraphs & bullets.`
        }
      });

      res.json({ reply: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate AI response" });
    }
  });

  // AI Document Analysis Endpoint
  app.post('/api/gemini/analyze-document', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ 
          error: "⚠️ Gemini API key is missing. Please add GEMINI_API_KEY to your appSecrets in AI Studio Settings." 
        });
      }
      const { fileName, mimeType, base64 } = req.body;
      if (!base64) {
        return res.status(400).json({ error: "Missing document file data." });
      }

      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/png",
          data: base64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          imagePart,
          {
            text: `Analyze this Kenyan expense receipt, invoice, or statutory transaction slip, and extract compliance bookkeeping parameters securely.
Provide your response strictly in the following JSON format:
{
  "merchantName": "Name of the merchant / KRA PIN holder",
  "invoiceDate": "YYYY-MM-DD format",
  "totalAmount": "KSh amount (with formatted thousands separators)",
  "vatAmount": "VAT amount or Non-VATable",
  "category": "Bookkeeping category (e.g. Utilities / PowerTokens, Communication / Business Internet, Office Supplies, Meals, etc.)",
  "summary": "Short 1-sentence description of the transaction.",
  "confidenceScore": 0.95,
  "auditAdvice": "Professional CPA bookkeeping compliance tip for Kenyan tax/KRA rules, detailing if this is tax-deductible or if input tax credits apply."
}`
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchantName: { type: Type.STRING },
              invoiceDate: { type: Type.STRING },
              totalAmount: { type: Type.STRING },
              vatAmount: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              auditAdvice: { type: Type.STRING }
            },
            required: ["merchantName", "invoiceDate", "totalAmount", "category", "summary", "auditAdvice"]
          }
        }
      });

      const extracted = JSON.parse(response.text || '{}');
      res.json({ success: true, extracted });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Document analysis failed." });
    }
  });

  if (!isProd) {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    // Fallback template server in dev mode
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Business Logic | Bookkeeping Services Kenya</title>
  </head>
  <body class="bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
