import type { UserNotes, Question } from '../types';

// Store the Kobold API URL - this can be updated when the Colab instance starts
let KOBOLD_API_URL = 'https://respond-recorder-toolbar-el.trycloudflare.com/';

// Function to set the API URL when the Colab instance provides it
export function setKoboldApiUrl(url: string) {
  KOBOLD_API_URL = url.endsWith('/') ? url + 'api/v1/generate' : url + '/api/v1/generate';
}

export async function generateQuestions(notes: UserNotes): Promise<Question[]> {
  if (!KOBOLD_API_URL) {
    throw new Error('Please set the KoboldCPP API URL first');
  }

  try {
    const prompt = `Generate 3 academic STEM questions based on these ${notes.subject} notes:
"${notes.content}"

Rules:
1. Questions must be directly related to the notes content
2. Mix of multiple choice (70%) and fill-in-blank (30%)
3. Ensure progressive difficulty
4. Focus on core concepts and understanding

Return the questions in this exact JSON format, nothing else:
{
  "questions": [
    {
      "type": "mcq",
      "question": "...",
      "subject": "${notes.subject}",
      "topic": "...",
      "choices": [
        {"id": "a", "text": "...", "isCorrect": true},
        {"id": "b", "text": "...", "isCorrect": false},
        {"id": "c", "text": "...", "isCorrect": false},
        {"id": "d", "text": "...", "isCorrect": false}
      ],
      "explanation": "...",
      "difficulty": "easy"
    }
  ]
}`;

    const response = await fetch(KOBOLD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_context_length: 2048,
        max_length: 500,
        temperature: 0.7,
        top_p: 0.9,
        stop_sequence: ["}"],
        rep_pen: 1.1,
        top_k: 40,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    let content = data.results[0].text;

    // Ensure the response ends with a proper JSON closing
    if (!content.endsWith('}')) {
      content += '}';
    }

    // Clean up the response to ensure valid JSON
    content = content.replace(/```json/g, '').replace(/```/g, '');
    
    try {
      const parsed = JSON.parse(content);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid response format');
      }

      return parsed.questions.map((q: Question, index: number) => ({
        ...q,
        id: `generated-${Date.now()}-${index}`,
        likes: 0,
        attempts: 0,
        correctAttempts: 0
      }));
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Failed to parse generated questions');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
}