
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Demo, View } from '../types';
import Icon from './Icon';
import Loader from './Loader';
import DemoCard from './DemoCard';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { getDemosByCategory } from '../services/geminiService';
import { useGeminiLive } from '../hooks/useGeminiLive';

interface ConsultationViewProps {
  onBack: () => void;
  onNavigate: (view: View, demo: Demo | null) => void;
}

const ConsultationView: React.FC<ConsultationViewProps> = ({ onBack, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { speak, cancel } = useSpeechSynthesis();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { connect, disconnect, send, isConnected, error: liveError } = useGeminiLive();

  const addMessage = (text: string, sender: 'user' | 'ai', recommendedDemos?: Demo[]) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender, recommendedDemos }]);
  };

  const handleLiveMessage = (message: any) => {
    if (message.text) {
        try {
            const jsonResponse = JSON.parse(message.text);
            if (jsonResponse.reply) {
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.sender === 'ai' && !lastMessage.recommendedDemos) {
                        const updatedMessages = [...prev];
                        updatedMessages[prev.length - 1] = { ...lastMessage, text: jsonResponse.reply };
                        return updatedMessages;
                    } else {
                        return [...prev, { id: Date.now().toString(), text: jsonResponse.reply, sender: 'ai' }];
                    }
                });
            }
            if (jsonResponse.category) {
                const demos = getDemosByCategory(jsonResponse.category);
                if (demos.length > 0) {
                    const demoText = `Here are some demos in the ${jsonResponse.category} category.`;
                    addMessage(demoText, 'ai', demos);
                    speak(demoText);
                }
            }
        } catch (e) {
            // Not a JSON response, handle as plain text
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.sender === 'ai') {
                    const updatedMessages = [...prev];
                    updatedMessages[prev.length - 1] = { ...lastMessage, text: lastMessage.text + message.text };
                    return updatedMessages;
                } else {
                    return [...prev, { id: Date.now().toString(), text: message.text, sender: 'ai' }];
                }
            });
        }
    }
    if (message.serverContent && message.serverContent.turnComplete) {
        setIsLoading(false);
        const fullResponse = messages[messages.length - 1]?.text || '';
        speak(fullResponse);
    }
};

  const handleUserSubmit = useCallback(async (text: string) => {
    if (!text || isLoading) return;

    cancel(); // Stop any currently speaking AI
    addMessage(text, 'user');
    setUserInput('');
    setIsLoading(true);
    send(text);
  }, [isLoading, cancel, send]);


  const { isListening, isAvailable, startListening, error } = useSpeechRecognition(handleUserSubmit);

  useEffect(() => {
    connect(handleLiveMessage);
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isConnected) {
        const initialMessage = "Hello! I'm here to help you find the right AI solution. To start, could you tell me what you're interested in? For example, diagnostics, hospital management, or patient care.";
        addMessage(initialMessage, 'ai');
        speak(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onDemoSelect = (demo: Demo) => {
    onNavigate('demoDetail', demo);
  };

  const getErrorMessage = (errorType: typeof error): string | null => {
    if (!errorType) return null;
    switch (errorType) {
      case 'no-speech':
        return "I didn't hear anything. Please make sure your microphone is working and try speaking again.";
      case 'not-allowed':
      case 'service-not-allowed':
        return "Microphone access is blocked. Please enable it in your browser settings to use voice commands.";
      case 'audio-capture':
        return "There was a problem with your microphone. Please check your hardware and try again.";
      default:
        return `An unexpected speech error occurred (${errorType}). Please try again.`;
    }
  };
  const speechError = getErrorMessage(error);
  
  return (
    <div className="flex flex-col h-full p-4 md:p-8 animate-fade-in">
        <div className="flex-shrink-0 flex items-center justify-between mb-4">
            <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors">
                <Icon name="back" className="w-6 h-6" />
                <span>Main Menu</span>
            </button>
             <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary">AI Consultation</h2>
             <div className="w-24"></div>
        </div>

      <div className="flex-grow overflow-y-auto bg-brand-surface/50 p-4 rounded-lg border border-brand-border/50">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center"><Icon name="robot" className="w-6 h-6 text-brand-primary"/></div>}
              <div className={`max-w-md lg:max-w-xl ${msg.sender === 'user' ? 'order-2' : ''}`}>
                <div className={`px-5 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-brand-surface text-brand-text-primary rounded-bl-none'}`}>
                  <p>{msg.text}</p>
                </div>
                {msg.recommendedDemos && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {msg.recommendedDemos.map(demo => (
                             <DemoCard key={demo.id} demo={demo} onSelect={onDemoSelect} className="animate-slide-in-up" />
                        ))}
                    </div>
                )}
              </div>
               {msg.sender === 'user' && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center order-1"><Icon name="user" className="w-6 h-6 text-brand-text-secondary"/></div>}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center"><Icon name="robot" className="w-6 h-6 text-brand-primary"/></div>
              <div className="px-5 py-3 rounded-2xl bg-brand-surface text-brand-text-primary rounded-bl-none">
                <Loader size="w-6 h-6" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 mt-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserSubmit(userInput)}
            placeholder="Type your interests here..."
            className="flex-grow bg-brand-surface border border-brand-border rounded-full py-3 px-6 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            disabled={isLoading || isListening}
          />
          {isAvailable && (
              <button
                  onClick={startListening}
                  disabled={isLoading || isListening}
                  className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-brand-primary text-white hover:bg-brand-secondary'
                  }`}
              >
                  <Icon name="microphone" className="w-7 h-7" />
              </button>
          )}
          <button
              onClick={() => handleUserSubmit(userInput)}
              disabled={isLoading || !userInput}
              className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 bg-brand-accent text-white hover:bg-green-500 disabled:bg-brand-text-secondary disabled:cursor-not-allowed"
          >
            <Icon name="send" className="w-6 h-6" />
          </button>
        </div>
        {speechError && (
          <p className="text-center text-red-400 text-sm mt-2 animate-fade-in">
            {speechError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConsultationView;