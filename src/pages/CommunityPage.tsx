import Breadcrumb from "@/components/Breadcrumb";
import { MessageCircle, Send, Heart, Users } from "lucide-react";

const messages = [
  { user: "Scholar_101", text: "大家好！Just started HSK 1 today! 🎉", time: "2m ago", avatar: "🐉" },
  { user: "MandarinFan", text: "你好！Welcome! You'll love it here.", time: "5m ago", avatar: "🎋" },
  { user: "ChengYu_Master", text: "千里之行，始于足下 - Keep going everyone!", time: "12m ago", avatar: "🏯" },
  { user: "HSK_Warrior", text: "Just passed HSK 3 mock exam! 💪", time: "15m ago", avatar: "⚔️" },
  { user: "PandaLearner", text: "Anyone want to practice speaking together?", time: "20m ago", avatar: "🐼" },
];

const CommunityPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "HSK Talk" }]} />

      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent brutalist-card rounded-2xl mb-4">
          <MessageCircle size={28} className="text-accent-foreground" />
        </div>
        <h1 className="text-4xl font-bold font-mono">HSK TALK</h1>
        <p className="text-muted-foreground mt-2">
          Join the global community of scholars. Say hello and share your progress!
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Users size={16} className="text-secondary" />
          <span className="text-sm font-mono text-secondary">42 online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="brutalist-card rounded-2xl bg-card overflow-hidden">
        <div className="p-4 bg-foreground/5 border-b-2 border-border flex items-center justify-between">
          <span className="font-mono text-sm font-bold">GLOBAL CHAT</span>
          <span className="retro-tag text-secondary border-secondary text-xs animate-pulse-glow">LIVE</span>
        </div>

        <div className="p-4 space-y-4 min-h-[400px]">
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg brutalist-border flex-shrink-0">
                {m.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{m.user}</span>
                  <span className="text-xs text-muted-foreground font-mono">{m.time}</span>
                </div>
                <p className="text-sm mt-0.5">{m.text}</p>
              </div>
              <button className="text-muted-foreground hover:text-accent transition-colors">
                <Heart size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t-2 border-border flex gap-3">
          <input
            type="text"
            placeholder="Say hello to the community..."
            className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm font-mono brutalist-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg brutalist-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
