import "./emailResponderForm.css"
import React, { useState } from 'react';
function EmailResponderForm() {
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('professional');
  const [language, setLanguage] = useState('english-uk');
  const [emailType, setEmailType] = useState('personal');
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');

  async function formSubmit(e) {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Clear any previous responses
    setResponse('');
  
    const baseURL = "https://email-responder-ai-azure.vercel.app";
    const devURL = "http://127.0.0.1:4000";
  
    try {
      // Send a POST request to the /gpt endpoint of our Express server
      const apiResponse = await fetch(`${baseURL}/gpt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mood,
          context,
          emailType,
          name,
          language,
        }),
      });
  
      // Extract the response data as JSON
      const data = await apiResponse.json();
  
      // Set the response message to the message property of the returned JSON data
      setResponse(data.message);
      console.log(data.message)
    } catch (error) {
      // If an error occurs during the fetch request, set the response message to the error message
      setResponse(error);
      console.log(error)
    }
  }
  
return (
  <div>
    <form onSubmit={formSubmit}>
      <label>
        Language:
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="english-uk">🇬🇧 English (UK)</option>
          <option value="English-us">🇺🇸 English (US)</option>
          <option value="Norwegian">🇳🇴 Norwegian</option>
          <option value="german">🇩🇪 German</option>
        </select>
      </label>
      <label>
        Email Type:
        <select
          value={emailType}
          onChange={(e) => setEmailType(e.target.value)}
        >
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
      </label>
      <label>
        The tone of Response:
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="funny">Funny</option>
          <option value="formal">Formal</option>
          <option value="negative">Negative</option>
        </select>
      </label>
    <label>
      Your Name:
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </label>
    <label>
      Add Extra Context:
      <input
        type="text"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Extra Context"
      />
    </label>
    <label>
      Email you want to respond to:
      <textarea
              id="emailToReply"
              placeholder="Place the text of the email you want to respond to here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
    </label>
    <button type="submit">Submit</button>
    </form>
    

      <section>
        <h2>Email Response</h2>
        <pre>{response}</pre>
      </section>
    </div>
  );
}
export default EmailResponderForm;