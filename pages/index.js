import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { text: 'مرحباً! أنا مساعد الإسعافات الأولية. يمكنني مساعدتك في الاستفسارات الطبية الطارئة. كيف يمكنني مساعدتك اليوم؟', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      // First, classify the query
      const classifyResponse = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!classifyResponse.ok) {
        throw new Error('Classification failed');
      }

      const classification = await classifyResponse.json();

      let botResponse;
      
      // Check if it's a first aid question (adjust based on your model's output)
      const isFirstAid = classification && classification[0] && classification[0][1] > classification[0][0];
      
      if (isFirstAid) {
        // It's a first aid question - get LLM response
        const chatResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userMessage }),
        });

        if (!chatResponse.ok) {
          throw new Error('LLM request failed');
        }

        const chatData = await chatResponse.json();
        botResponse = chatData[0]?.generated_text || "عذراً، لم أتمكن من توليد رد.";
      } else {
        // Not a first aid question
        botResponse = "عذراً، أنا مساعد مخصص للإسعافات الأولية والاستفسارات الطبية الطارئة فقط. يرجى تقديم استفسار طبي أو استشارة طبيب مختص للحالات الأخرى.";
      }

      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.", 
        isUser: false 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Head>
        <title>مساعد الإسعافات الأولية</title>
        <meta name="description" content="مساعد ذكي للإسعافات الأولية باللغة العربية" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="chat-container">
        <div className="chat-header">
          <h1>🤖 مساعد الإسعافات الأولية</h1>
          <p>أسألني عن أي استفسار طبي طارئ</p>
        </div>
        
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot-message">
              <div className="message-content loading">
                جاري المعالجة...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك عن الإسعافات الأولية هنا..."
              dir="rtl"
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  جاري الإرسال...
                </>
              ) : (
                'إرسال'
              )}
            </button>
          </div>
          <div className="disclaimer">
            هذا المساعد للأغراض الإرشادية فقط. في الحالات الطبية الطارئة، يرجى الاتصال بالطوارئ فوراً.
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .chat-container {
          width: 100%;
          max-width: 800px;
          height: 90vh;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin: 0 auto;
        }

        .chat-header {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          padding: 20px;
          text-align: center;
        }

        .chat-header h1 {
          font-size: 1.5rem;
          margin-bottom: 5px;
        }

        .chat-header p {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8f9fa;
        }

        .message {
          margin-bottom: 20px;
          display: flex;
        }

        .user-message {
          justify-content: flex-end;
        }

        .bot-message {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .user-message .message-content {
          background: #007bff;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bot-message .message-content {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          border-bottom-left-radius: 4px;
        }

        .loading {
          color: #6c757d;
          font-style: italic;
        }

        .chat-input {
          padding: 20px;
          background: white;
          border-top: 1px solid #e0e0e0;
        }

        .input-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s;
        }

        input:focus {
          border-color: #007bff;
        }

        input:disabled {
          background-color: #f8f9fa;
        }

        button {
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
          justify-content: center;
        }

        button:hover:not(:disabled) {
          background: #0056b3;
        }

        button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .disclaimer {
          text-align: center;
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 10px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .chat-container {
            height: 95vh;
            border-radius: 10px;
          }
          
          .message-content {
            max-width: 85%;
          }
          
          .chat-header h1 {
            font-size: 1.3rem;
          }
          
          button {
            min-width: 100px;
            padding: 12px 16px;
          }
        }

        /* Scrollbar Styling */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
      `}</style>
    </>
  );
}
