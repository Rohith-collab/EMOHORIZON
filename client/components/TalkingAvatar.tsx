import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, Brain, AlertCircle, PlayCircle } from "lucide-react";

interface TalkingAvatarProps {
  useLocalModel?: boolean;
  onSpeechEnd?: () => void;
  onSpeechStart?: () => void;
}

const TalkingAvatar: React.FC<TalkingAvatarProps> = ({ useLocalModel, onSpeechEnd, onSpeechStart }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Voices and Speech
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processUserQuery(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (e: any) => {
        setIsListening(false);
        if (e.error === 'not-allowed') setError("Microphone access denied.");
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
    };
  }, []);

  // Sync mouth with speech
  useEffect(() => {
    if (isSpeaking) {
      mouthIntervalRef.current = setInterval(() => setMouthOpen(Math.random() * 100), 80);
    } else {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      setMouthOpen(0);
    }
  }, [isSpeaking]);

  const toggleListening = () => {
    window.speechSynthesis.cancel(); // Unlock audio context
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null);
      setTranscript("");
      setIsListening(true);
      try { recognitionRef.current?.start(); } catch (e) { setIsListening(false); }
    }
  };

  const testVoice = () => {
    speak("System voice check. If you can hear this, the bot's voice is active and ready.");
  };

  const processUserQuery = async (text: string) => {
    setIsProcessing(true);
    const query = text.toLowerCase();

    // 1. Local Model Check
    const localNet = (window as any)._trainedModel;
    if (useLocalModel && localNet) {
      const response = localNet.run(query);
      if (response && response.length > 1) {
        speak(response);
        return;
      }
    }

    // 2. API Fallback
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      speak(data.message || `I heard you say: ${text}`);
    } catch (err) {
      speak(`System response: You said ${text}. Please check your internet connection.`);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select the best quality voice (Prefers Google or Natural sounding ones)
    const voice = availableVoices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.lang === "en-US") || availableVoices[0];
    if (voice) utterance.voice = voice;
    
    utterance.pitch = 1.1; // Slightly more friendly
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsProcessing(false);
      setIsSpeaking(true);
      onSpeechStart?.();
    };
    utterance.onend = () => {
      setIsSpeaking(true); // Small delay for effect
      setTimeout(() => setIsSpeaking(false), 300);
      onSpeechEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsProcessing(false);
      setError("Voice synthesis error");
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Visual Avatar */}
      <div className="relative w-48 h-48 rounded-full border-4 border-primary/20 bg-gradient-to-b from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden shadow-2xl">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="flex gap-10 mb-4">
            <div className={`w-4 h-4 bg-primary rounded-full transition-all duration-300 ${isSpeaking ? 'scale-y-110' : 'scale-y-100'}`} />
            <div className={`w-4 h-4 bg-primary rounded-full transition-all duration-300 ${isSpeaking ? 'scale-y-110' : 'scale-y-100'}`} />
          </div>
          <div 
            className="w-12 h-6 bg-primary/20 rounded-full overflow-hidden flex items-center justify-center border border-primary/30 shadow-inner"
            style={{ height: isSpeaking ? `${8 + mouthOpen/4}px` : '4px', transition: 'height 0.1s' }}
          >
            <div className="w-full h-full bg-primary/40" />
          </div>
          {isProcessing && <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />}
        </div>
        {(isListening || isSpeaking) && <div className="absolute inset-0 bg-primary/10 animate-pulse -z-10" />}
      </div>

      <div className="w-full space-y-4">
        <div className="flex justify-center gap-6">
          <button
            onClick={toggleListening}
            disabled={isProcessing || isSpeaking}
            className={`p-6 rounded-full transition-all duration-300 shadow-xl border-2 ${isListening ? "bg-destructive border-white scale-110 animate-pulse" : "bg-primary border-primary/20 hover:scale-105"}`}
            title="Talk to Avatar"
          >
            {isListening ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
          </button>
          
          <button
            onClick={testVoice}
            className="p-4 rounded-full bg-muted hover:bg-muted/80 transition-colors border border-border/40"
            title="Test Voice Output"
          >
            <PlayCircle className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <div className="min-h-[80px] p-5 rounded-2xl bg-muted/40 backdrop-blur-sm border border-border/40 text-center flex flex-col justify-center shadow-inner">
          {isListening && <p className="text-sm text-primary animate-pulse font-bold uppercase tracking-widest">Listening...</p>}
          {!isListening && !isProcessing && !transcript && !error && <p className="text-xs text-muted-foreground/60 italic font-medium">Click the microphone and speak clearly</p>}
          {transcript && <p className="text-sm font-semibold italic text-foreground/90 leading-relaxed">"{transcript}"</p>}
          {error && <div className="flex items-center justify-center gap-2 text-destructive font-bold text-xs"><AlertCircle className="w-4 h-4"/> {error}</div>}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <span className={`flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest transition-colors ${isSpeaking ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-muted/50 text-muted-foreground border-border/50'}`}>
          <Volume2 className="w-3.5 h-3.5" /> {isSpeaking ? 'Transmitting Voice' : 'Voice Standby'}
        </span>
        <span className="flex items-center gap-1.5 text-[9px] font-black bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> {availableVoices.length} Voices Loaded
        </span>
      </div>
    </div>
  );
};

export default TalkingAvatar;
