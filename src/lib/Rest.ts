export class REST {
    private baseURL = 'https://discord.com/api/v10';
    private token: string;
  
    constructor(token: string) {
      this.token = token;
    }
  
    async post(endpoint: string, body: unknown) {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${this.token}`,
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error: ${response.status} - ${error.message}`);
      }
  
      return await response.json();
    }
  }
  