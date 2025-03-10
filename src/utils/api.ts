
/**
 * API utility for generating Mermaid diagrams using GPT-4o-mini
 */

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// This should be replaced with your actual API key
// In a production app, this should be stored securely and not in client-side code
const MOCK_GENERATION = true;

export const generateMermaidDiagram = async (prompt: string): Promise<string> => {
  if (MOCK_GENERATION) {
    // For demo purposes, simulate API call with a delay
    console.log('Generating diagram with prompt:', prompt);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a sample diagram based on the prompt
    if (prompt.toLowerCase().includes('flowchart')) {
      return `flowchart TD
    A[Start] --> B{Is it raining?}
    B -->|Yes| C[Take umbrella]
    B -->|No| D[Enjoy the sun]
    C --> E[Go outside]
    D --> E
    E --> F[End]`;
    } else if (prompt.toLowerCase().includes('sequence')) {
      return `sequenceDiagram
    participant User
    participant System
    participant Database
    
    User->>System: Request data
    System->>Database: Query data
    Database-->>System: Return results
    System-->>User: Display results`;
    } else if (prompt.toLowerCase().includes('class')) {
      return `classDiagram
    class Animal {
      +name: string
      +age: int
      +makeSound(): void
    }
    class Dog {
      +breed: string
      +fetch(): void
    }
    class Cat {
      +color: string
      +climb(): void
    }
    Animal <|-- Dog
    Animal <|-- Cat`;
    } else {
      return `graph TD
    A[${prompt.substring(0, 20)}...] --> B[Generated]
    B --> C[Diagram]
    C --> D[Example]`;
    }
  }
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY_HERE`, // Replace with actual API key
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a diagram expert specializing in creating Mermaid syntax diagrams. 
            When given a request, respond ONLY with valid Mermaid syntax code for the requested diagram.
            Do not include any explanations, markdown code blocks, or anything else other than the Mermaid code itself.
            Ensure the diagram is clean, well-organized, and correctly formatted.`
          },
          {
            role: 'user',
            content: `Create a Mermaid diagram based on this description: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0].message.content.trim();
    
    // Remove any markdown code block syntax if present
    return generatedCode.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
  } catch (error) {
    console.error('Error in API call:', error);
    throw new Error('Failed to generate diagram. Please try again later.');
  }
};
