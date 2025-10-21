import { useState, useRef, useEffect } from 'react';

export default function Chat() {
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

      const classification = await classifyResponse.json();

      let botResponse;
      if (classification && classification[0] && classification[0][1] > classification[0][0]) {
        // It's a first aid question - get LLM response
        const chatResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userMessage }),
        });

        const chatData = await chatResponse.json();
        botResponse = chatData[0]?.generated_text || "عذراً، لم أتمكن من توليد رد.";
      } else {
        // Not a first aid question
        botResponse = "عذراً، أنا مساعد مخصص للإسعافات الأولية والاستفسارات الطبية الطارئة فقط. يرجى تقديم استفسار طبي طارئ أو استشارة طبيب مختص للحالات الأخرى.";
      }

      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
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
            {loading ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </div>
        <div className="disclaimer">
          ⚠️ هذا المساعد للأغراض الإرشادية فقط. في الحالات الطبية الطارئة، يرجى الاتصال بالطوارئ فوراً.
        </div>
      </div>

      <style jsx>{`
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
        }

        .bot-message .message-content {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
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
        }

        button {
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
        }

        button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .disclaimer {
          text-align: center;
          font-size: 0.8rem;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
