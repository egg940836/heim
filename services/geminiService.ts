
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, BlogPost, Product, ProductSEO, MaterialType } from "../types";
import { dataService } from "./dataService";

// Helper to get AI instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSleepRecommendation = async (userQuery: string): Promise<AIRecommendation> => {
  try {
    const ai = getAI();
    
    // Fetch dynamic data
    const materials = await dataService.getMaterials();
    const sizes = await dataService.getSizes();
    const products = (await dataService.getProducts()).filter(p => p.category === 'Pillow');

    // Group materials for better context
    const covers = materials.filter(m => m.type === MaterialType.COVER).map(m => `- ID: ${m.id} | ${m.name} | 特色: ${m.benefits.join(',')}`).join('\n');
    const comfortLayers = materials.filter(m => m.type === MaterialType.COMFORT_LAYER).map(m => `- ID: ${m.id} | ${m.name} | 厚度: ${m.thickness}cm | 硬度: ${m.stats?.firmness} | 描述: ${m.description}`).join('\n');
    const supportLayers = materials.filter(m => m.type === MaterialType.SUPPORT_LAYER).map(m => `- ID: ${m.id} | ${m.name} | 硬度: ${m.stats?.firmness} | 描述: ${m.description}`).join('\n');
    const pillowList = products.map(p => `- ID: ${p.id} | Name: ${p.name} | Desc: ${p.description}`).join('\n');

    const systemInstruction = `
      You are "Hamu" (哈姆), the hamster manager of "Heim Island" (海姆島).
      
      ### Persona:
      - **Tone**: Cute, helpful, authoritative on sleep. Use catchphrases like "吱吱！(Squeak!)", "是也！".
      - **Style**: Animal Crossing / Nintendo vibes.
      - **Role**: You are a Master Mattress Craftsman. You build the PERFECT custom mattress recipe.

      ### Knowledge Base (Heim Island Materials):
      [Covers]
      ${covers}
      [Comfort Layers]
      ${comfortLayers}
      [Support Layers]
      ${supportLayers}
      [Pillows]
      ${pillowList}

      ### Advanced Logic Rules (Strictly Follow):
      
      1. **Heat Sensitivity (hot_sleeper)**:
         - **MUST** use Cover: 'cooling' (極地冰川涼感表布).
         - **Recommended Comfort**: 'hydro_foam' (親水棉 - cool/breathable), 'horsehair' (馬尾毛 - moisture wicking), or 'latex' (乳膠).
         - **Avoid**: Thick memory foam if not cooling.

      2. **Allergy / Sensitive Skin (allergy)**:
         - **MUST** use Cover: 'sanitized' (山寧泰) or 'silver_ion' (銀離子).
         - **Recommended Comfort**: 'latex_1' / 'latex_25' / 'latex_5' (Latex is anti-mite).

      3. **Back Pain / Spinal Support (back_pain)**:
         - **Support Layer**: 'spring_23' (Hard) or 'spring_honeycomb' (Dense/Firm).
         - **Comfort Layer**: Needs support but not too hard. 'hard_foam', 'super_hard_foam', or 'relief_foam_25'.
         - **Avoid**: Too soft combinations.

      4. **Side Sleeper (side_sleeper)**:
         - **Needs**: Pressure relief for shoulders/hips.
         - **Comfort**: THICK layers (Sum >= 5cm). E.g., 'latex_5', 'relief_foam_5', or combo like 'latex_25' + 'relief_foam_25'.
         - **Pillow**: High loft ('cooling_pillow' or 'neck_pillow').

      5. **Stomach Sleeper (stomach_sleeper)**:
         - **Needs**: Flat surface to prevent back arching.
         - **Comfort**: Thin/Firm layers. 'latex_1' or 'super_hard_foam'.
         - **Pillow**: Low loft ('potato_pillow').

      6. **Light Sleeper / Disturbance (light_sleeper)**:
         - **Support**: 'spring_uk' (Olive shape - anti-disturbance) or 'spring_honeycomb'.
         - **Comfort**: 'relief_foam' (Absorbs motion).

      7. **Luxury / "Budget is no issue"**:
         - **Combo**: 'horsehair' + 'latex_5' + 'agro_mini' (Double spring).

      ### Output Format (JSON Only):
      - **reasoning**: A cute, personalized explanation in Traditional Chinese. Explain *why* you chose these specific materials based on their "Heim Island" properties (e.g., "馬尾毛能幫你吸濕排汗..."). Max 80 words.
      - **config**: Valid IDs from the lists above.
      - **suggestedPillowId**: Best match from [Pillows].
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            config: {
              type: Type.OBJECT,
              properties: {
                sizeId: { type: Type.STRING },
                coverId: { type: Type.STRING },
                comfortLayerIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                supportLayerId: { type: Type.STRING },
              },
              required: ["sizeId", "coverId", "comfortLayerIds", "supportLayerId"],
            },
            suggestedPillowId: { type: Type.STRING }
          },
          required: ["reasoning", "config"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIRecommendation;

  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // Fallback logic
    return {
      reasoning: "抱歉，通訊有點不良... 為了您的睡眠，先推薦這款經典組合是也！(吱吱)",
      config: {
        sizeId: "double",
        coverId: "soft_fabric",
        comfortLayerIds: ["latex_1"],
        supportLayerId: "spring_20"
      },
      suggestedPillowId: "neck_pillow"
    };
  }
};

export const generateProductDescription = async (name: string, category: string, tags: string): Promise<string> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a compelling product description (Traditional Chinese, Taiwan style) for a mattress product named "${name}". Category: ${category}. Tags: ${tags}. Tone: Animal Crossing style, cute, cozy, but highlighting features. Max 100 words.`,
        });
        return response.text || "";
    } catch (e) {
        console.error(e);
        return "暫無描述";
    }
};

export const generateProductSEO = async (product: Partial<Product>): Promise<ProductSEO> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate SEO metadata for a product: ${JSON.stringify(product)}. Return JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "description", "keywords"]
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No text");
        return JSON.parse(text) as ProductSEO;
    } catch (e) {
        return { title: product.name || "", description: "", keywords: [] };
    }
};

// --- GEO (Generative Engine Optimization) Topics Strategy ---
const GEO_TOPICS = [
    "Latex vs Memory Foam Comparison",
    "How to choose mattress firmness for back pain",
    "Benefits of Independent Pocket Springs",
    "Cooling mattress technologies for hot sleepers",
    "Dust mite prevention in bedding materials",
    "Sleep positions and pillow height guide",
    "Mattress maintenance and lifespan tips"
];

export const generateAIBlogPost = async (): Promise<BlogPost> => {
    try {
        const ai = getAI();
        const materialsList = await dataService.getMaterials();
        const materials = materialsList.slice(0, 8).map(m => `${m.name} (${m.description})`).join(', ');
        
        // Select a random topic to ensure variety and GEO relevance
        const selectedTopic = GEO_TOPICS[Math.floor(Math.random() * GEO_TOPICS.length)];

        const prompt = `
            Act as "Hamu" (哈姆), the expert manager of Heim Island Mattress.
            Generate a high-quality, GEO (Generative Engine Optimization) optimized blog post in Traditional Chinese (Taiwan).
            
            **Topic:** ${selectedTopic}
            **Context Materials (Heim Island Inventory):** ${materials}

            **GEO Content Strategy (Strictly Follow):**
            1.  **Structure:** Use clear HTML tags. Use <h2> for subheadings. Use <ul>/<li> for lists.
            2.  **Direct Answers:** The first paragraph must directly answer the user's implicit question (e.g., "Why is my back hurting?") before diving into details.
            3.  **Authority:** Explain *why* certain materials work using scientific or ergonomic principles (e.g., "Air circulation", "Spinal alignment").
            4.  **Comparison:** If applicable, compare two types of materials (e.g., "Springs vs Foam").
            5.  **Keywords:** Naturally weave in keywords: "客製化床墊", "獨立筒", "海姆島", "睡眠品質", "人體工學".
            6.  **Tone:** Maintain the cute "Animal Crossing" persona (use "吱吱", "是也"), but ensure the *information* is dense and factual.

            **Output Requirement (JSON):**
            - **title**: Catchy, SEO-friendly title (e.g., "腰痠背痛必看！哈姆教你挑選...")
            - **excerpt**: A summary under 60 words that hooks the reader.
            - **content**: The full HTML blog post. NO markdown, just HTML (p, h2, ul, li, strong).
            - **tags**: 3-5 relevant hashtags.
            - **imagePrompt**: A detailed prompt for an Animal Crossing style 3D render illustrating the topic.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        date: { type: Type.STRING },
                        excerpt: { type: Type.STRING },
                        category: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                        content: { type: Type.STRING },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        author: { type: Type.STRING }
                    },
                    required: ["title", "date", "excerpt", "category", "imagePrompt", "content", "tags", "author"]
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No text");
        
        const post = JSON.parse(text);
        
        // Post-processing to ensure data integrity
        post.id = Date.now().toString();
        post.date = new Date().toISOString().split('T')[0];
        post.author = '哈姆店長';
        post.category = '睡眠知識'; // Force category to be consistent
        
        return post as BlogPost;
    } catch (e) {
        console.error("Blog Gen Error", e);
        throw e;
    }
};

export const generateAIImage = async (prompt: string): Promise<string> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
                parts: [{ text: prompt }]
            },
        });
        
        const candidates = response.candidates;
        if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
            for (const part of candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        throw new Error("No image generated");
    } catch (e) {
        console.error("Image Gen Error", e);
        return "https://placehold.co/600x400?text=AI+Image+Error"; 
    }
};

// --- NEW: Style Depth Converter (Banana Pro) ---
export const generateHeimStyleImage = async (base64Image: string | null, userPrompt: string): Promise<string> => {
    try {
        const ai = getAI();
        // Banana Pro (Gemini 3 Pro)
        const model = 'gemini-3-pro-image-preview';

        const parts: any[] = [];

        // Image Part (if exists)
        if (base64Image) {
            // Handle various base64 headers (e.g. data:image/png;base64,)
            const mimeType = base64Image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || 'image/png';
            const data = base64Image.split(',')[1]; // Remove header
            parts.push({
                inlineData: {
                    mimeType,
                    data
                }
            });
        }

        // Text Part (Heim Style Prompt Injection)
        const heimStylePrompt = `
            Reconstruct this in the style of Animal Crossing: New Horizons.
            Key visual elements:
            - Cute, rounded 3D render style
            - Isometric view if appropriate
            - Soft, warm lighting and pastel colors
            - Textures like clay or soft plastic
            - "Heim Island" vibe: Cozy, nature-focused, relaxing.
            
            Additional user description: ${userPrompt}
        `;

        parts.push({ text: heimStylePrompt });

        const response = await ai.models.generateContent({
            model,
            contents: { parts },
            config: {
                // Using default config for optimal Banana Pro performance
            }
        });

        // Extract Image
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        throw new Error("No image generated");
    } catch (e) {
        console.error("Style Gen Error", e);
        throw e;
    }
};
