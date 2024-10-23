const fs = require('fs');
const pdf = require('pdf-parse');
const axios = require('axios');

async function extractPdfContent(filePath: string): Promise<any> {
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
      const data = await pdf(dataBuffer);
      console.log(data.text);
      
         return data.text;
    } catch (error) {
      console.error("Error extracting PDF content: ", error);
    }
  }

async function queryOllamaForJson(model: string, prompt: string): Promise<any> {
    try {
        console.log("Ollama running....");
        const response = await axios.post('http://127.0.0.1:11434/api/generate', {
            model: model,
            prompt: prompt,
            format:"json",
            stream:false,
            temperature: 0.2,
            stop: ["\n"],
            seed: 42
        });
console.log(response.data);
        // Parse and return the response if it's valid JSON
        return JSON.parse(response.data.response);
    } catch (error) {
        console.error("Error querying Ollama:", error);
        return "Error connecting to the AI.";
    }
}




async function jsonExtractorAgent(text: string): Promise<any> {
    // const prompt = `
    // Based on the following text, extract the relevant information and return it in valid JSON format.
    // The response should only include the following keys: "Paediatrics", "Neurology", and "Neonatology".

    // Example JSON format:
    // {
    //   "Paediatrics": "string",
    //   "Neurology": "string",
    //   "Neonatology": "string"
    // }

    // Text: "${text}"
    // `;

    const prompt = `
    Based on the following text, extract the departments and doctor information and return it in valid JSON format.
    The response should only include the following keys: "Department".

    Example JSON format:
    {
      "Department": "Doctor name",
    }

    Text: "${text}"
    `;

    return await queryOllamaForJson("llama3.1", prompt);
}

const extractTextFromPDF1 = async (filePath: string): Promise<any> => {
    try {
     
      const dataBuffer = fs.readFileSync(filePath);
  
     
      const data = await pdf(dataBuffer);
  
       console.log("Extracted Text: \n", data.text);
    } catch (error) {
      console.error("Error extracting text from PDF: ", error);
    }
  };

  async function example() {
    // const userQuery1 = "Can you recommend some places to visit in Italy?";
    // const userQuery2 = "What are some good exercises to boost my immune system?";

   // extractTextFromPDF1('./KMCH.pdf');

  const content = await extractPdfContent('./KMCH.pdf');

    await jsonExtractorAgent(content);
}

example();
