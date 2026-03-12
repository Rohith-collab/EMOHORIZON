import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Settings, Video, Shield, Brain, Database, Play, CheckCircle } from "lucide-react";
import TalkingAvatar from "@/components/TalkingAvatar";

// Initial training data structure
const DEFAULT_DATASET = [
  { input: "hello", output: "Greetings! I am your locally trained assistant." },
  { input: "who are you", output: "I am a digital human powered by your custom dataset." },
  { input: "how are you", output: "I am functioning at peak efficiency with your training." },
  { input: "bye", output: "Goodbye! I'll be here whenever you need more assistance." }
];

export default function Avatar() {
  const [dataset, setDataset] = useState(JSON.stringify(DEFAULT_DATASET, null, 2));
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "training" | "completed">("idle");
  const [summary, setSummary] = useState<any>(null);
  const [localModel, setLocalModel] = useState<any>(null);

  // Load Brain.js via CDN for neural network training
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/brain.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleTrainModel = () => {
    if (!(window as any).brain) {
      alert("Neural Engine not loaded yet. Please wait a moment.");
      return;
    }

    setTrainingStatus("training");
    
    // We run training in a small timeout to allow UI to update
    setTimeout(() => {
      try {
        const rawData = JSON.parse(dataset);
        const net = new (window as any).brain.recurrent.LSTM();
        
        // Train the network
        const result = net.train(rawData, {
          iterations: 100,
          errorThresh: 0.011,
          log: true,
          logPeriod: 10
        });

        setLocalModel(net);
        setSummary({
          samples: rawData.length,
          error: result.error.toFixed(4),
          iterations: result.iterations,
          timestamp: new Date().toLocaleTimeString()
        });
        setTrainingStatus("completed");
        
        // Store model in session for the TalkingAvatar component
        (window as any)._trainedModel = net;
      } catch (err) {
        console.error(err);
        alert("Invalid dataset format. Please check your JSON.");
        setTrainingStatus("idle");
      }
    }, 100);
  };

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 gradient-bg -z-10" />
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Avatar <span className="gradient-text">Training Lab</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Train your own neural network. Provide a dataset below to change how the avatar thinks and responds.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Training Configuration */}
          <div className="card-glow p-6 bg-card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2 text-primary">
                <Database className="w-4 h-4" /> Training Dataset (JSON)
              </h3>
              {trainingStatus === "completed" && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-cyber uppercase tracking-tighter">
                  <CheckCircle className="w-3 h-3" /> Model Synchronized
                </span>
              )}
            </div>
            
            <textarea 
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="w-full h-64 bg-black/40 border border-border/60 rounded-xl p-4 font-monospace text-xs text-cyber focus:border-primary transition-all outline-none"
              spellCheck="false"
            />

            <button 
              onClick={handleTrainModel}
              disabled={trainingStatus === "training"}
              className="w-full btn-primary py-4 flex items-center justify-center gap-3 font-bold"
            >
              {trainingStatus === "training" ? (
                <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" /> Optimizing Weights...</>
              ) : (
                <><Play className="w-4 h-4" /> Train Local Model</>
              )}
            </button>

            {summary && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
                <h4 className="text-xs font-bold uppercase text-primary mb-3">Model Training Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Dataset Size</div>
                    <div className="text-lg font-bold">{summary.samples} Pairs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Loss (Error)</div>
                    <div className="text-lg font-bold">{summary.error}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Iterations</div>
                    <div className="text-lg font-bold">{summary.iterations}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Last Sync</div>
                    <div className="text-lg font-bold">{summary.timestamp}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interaction & Testing */}
          <div className="space-y-6">
            <div className="card-glow p-6 bg-card flex flex-col items-center">
              <h3 className="w-full font-bold mb-6 flex items-center gap-2 text-primary">
                <Brain className="w-4 h-4" /> Real-time Inference
              </h3>
              <TalkingAvatar useLocalModel={!!localModel} />
            </div>

            <div className="card-glow p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Privacy & Tech
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Training uses <b>LSTM (Long Short-Term Memory)</b> neural networks via Brain.js. All training happens inside your CPU's RAM—no data is sent to the cloud for training.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
