/**
 * Utility function to interact with the Gemini API
 * @param text - The text prompt to send to Gemini
 * @returns The response text from Gemini
 */
export async function getGeminiResponse(text: string) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error:', error);
    return 'Sorry, I had trouble processing that request';
  }
}
