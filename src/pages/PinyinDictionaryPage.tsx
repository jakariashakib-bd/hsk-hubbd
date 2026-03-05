import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumb from "@/components/Breadcrumb";
import { Search, Volume2, Plus, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// All common pinyin syllables in a flat list for the filter row
const ALL_PINYIN = [
  "a", "ai", "an", "ang", "ao",
  "ba", "bai", "ban", "bang", "bao", "bei", "ben", "bi", "bian", "bie", "bin", "bing", "bo", "bu",
  "ca", "cai", "can", "cang", "cao", "ce", "ci", "cong", "cu", "cuo",
  "cha", "chai", "chan", "chang", "chao", "che", "chen", "cheng", "chi", "chong", "chou", "chu", "chuang", "chui", "chun", "chuo",
  "da", "dai", "dan", "dang", "dao", "de", "di", "dian", "diao", "die", "ding", "diu", "dong", "dou", "du", "duan", "dui", "dun", "duo",
  "e", "ei", "en", "er",
  "fa", "fan", "fang", "fei", "fen", "feng", "fo", "fu",
  "ga", "gai", "gan", "gang", "gao", "ge", "gei", "gen", "geng", "gong", "gou", "gu", "gua", "guai", "guan", "guang", "gui", "gun", "guo",
  "ha", "hai", "han", "hang", "hao", "he", "hei", "hen", "heng", "hong", "hou", "hu", "hua", "huai", "huan", "huang", "hui", "hun", "huo",
  "ji", "jia", "jian", "jiang", "jiao", "jie", "jin", "jing", "jiu", "ju", "juan", "jue", "jun",
  "ka", "kai", "kan", "kang", "kao", "ke", "ken", "keng", "kong", "kou", "ku", "kua", "kuai", "kuan", "kuang", "kui", "kun", "kuo",
  "la", "lai", "lan", "lang", "lao", "le", "lei", "li", "lian", "liang", "liao", "lie", "lin", "ling", "liu", "long", "lou", "lu", "luan", "lun", "luo",
  "ma", "mai", "man", "mang", "mao", "me", "mei", "men", "mi", "mian", "miao", "mie", "min", "ming", "mo", "mou", "mu",
  "na", "nai", "nan", "nang", "nao", "ne", "nei", "ni", "nian", "niang", "niao", "nie", "nin", "ning", "niu", "nong", "nu", "nuan", "nuo",
  "pa", "pai", "pan", "pang", "pao", "pei", "pen", "pi", "pian", "piao", "pie", "pin", "ping", "po", "pu",
  "qi", "qia", "qian", "qiang", "qiao", "qie", "qin", "qing", "qiu", "qu", "quan", "que", "qun",
  "ran", "rang", "rao", "re", "ren", "ri", "rong", "rou", "ru", "ruan", "rui", "run", "ruo",
  "sa", "sai", "san", "sang", "sao", "se", "sen", "si", "song", "sou", "su", "suan", "sui", "sun", "suo",
  "sha", "shai", "shan", "shang", "shao", "she", "shei", "shen", "sheng", "shi", "shou", "shu", "shua", "shuai", "shuan", "shuang", "shui", "shun", "shuo",
  "ta", "tai", "tan", "tang", "tao", "te", "ti", "tian", "tiao", "tie", "ting", "tong", "tou", "tu", "tuan", "tui", "tun", "tuo",
  "wa", "wai", "wan", "wang", "wei", "wen", "wo", "wu",
  "xi", "xia", "xian", "xiang", "xiao", "xie", "xin", "xing", "xiu", "xu", "xuan", "xue", "xun",
  "ya", "yan", "yang", "yao", "ye", "yi", "yin", "ying", "yong", "you", "yu", "yuan", "yue", "yun",
  "za", "zai", "zan", "zang", "zao", "ze", "zei", "zen", "zeng", "zi", "zong", "zou", "zu", "zuan", "zui", "zun", "zuo",
  "zha", "zhai", "zhan", "zhang", "zhao", "zhe", "zhei", "zhen", "zheng", "zhi", "zhong", "zhou", "zhu", "zhua", "zhuai", "zhuan", "zhuang", "zhui", "zhun", "zhuo",
];

const ITEMS_PER_PAGE = 20;

const HSK_BADGE_STYLES: Record<number, string> = {
  1: "bg-primary/15 text-primary border border-primary/30",
  2: "bg-primary/15 text-primary border border-primary/30",
  3: "bg-primary/15 text-primary border border-primary/30",
  4: "bg-primary/15 text-primary border border-primary/30",
  5: "bg-primary/15 text-primary border border-primary/30",
  6: "bg-primary/15 text-primary border border-primary/30",
};

interface WordResult {
  chinese: string;
  pinyin: string;
  english: string;
  level: number;
  word_type: string;
}

const PinyinDictionaryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePinyin, setActivePinyin] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWord, setSelectedWord] = useState<WordResult | null>(null);

  const effectiveSearch = activePinyin || searchQuery;

  const { data: words = [], isLoading } = useQuery({
    queryKey: ["pinyin-dict", effectiveSearch],
    queryFn: async (): Promise<WordResult[]> => {
      if (!effectiveSearch.trim()) return [];
      const searchTerm = effectiveSearch.trim().toLowerCase();

      const { data, error } = await supabase
        .from("vocabulary")
        .select("chinese, pinyin, english, word_type, lesson_id")
        .ilike("pinyin", `%${searchTerm}%`)
        .order("pinyin")
        .limit(500);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      const lessonIds = [...new Set(data.map((d) => d.lesson_id))];
      const { data: lessons } = await supabase
        .from("hsk_lessons")
        .select("id, level")
        .in("id", lessonIds);

      const levelMap = new Map<string, number>();
      (lessons || []).forEach((l) => levelMap.set(l.id, l.level));

      return data.map((v) => ({
        chinese: v.chinese,
        pinyin: v.pinyin,
        english: v.english,
        word_type: v.word_type,
        level: levelMap.get(v.lesson_id) || 1,
      }));
    },
    enabled: effectiveSearch.trim().length > 0,
    staleTime: 60 * 1000,
  });

  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);
  const paginatedWords = useMemo(
    () => words.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [words, currentPage]
  );

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, words.length);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setActivePinyin(null);
    setCurrentPage(1);
  };

  const handlePinyinClick = (py: string) => {
    setActivePinyin(py === activePinyin ? null : py);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  // Filtered pinyin syllables based on search to show relevant ones
  const visiblePinyin = useMemo(() => {
    if (!effectiveSearch) return ALL_PINYIN.slice(0, 40);
    const term = effectiveSearch.toLowerCase();
    // Show syllables that start with or contain the search term
    const matches = ALL_PINYIN.filter(
      (p) => p.startsWith(term) || p.includes(term) || term.startsWith(p)
    );
    return matches.length > 0 ? matches : ALL_PINYIN.slice(0, 40);
  }, [effectiveSearch]);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Study", to: "/course" }, { label: "Practice" }]} />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
        Chinese Pinyin Dictionary
      </h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search Pinyin (example: ni, hao, shi)'
          className="pl-12 h-14 text-lg rounded-2xl border-2 border-primary/30 bg-card focus-visible:ring-primary focus-visible:border-primary"
        />
        {(searchQuery || activePinyin) && (
          <button
            onClick={() => { setSearchQuery(""); setActivePinyin(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Showing results text */}
      {effectiveSearch && words.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing words that start with '<span className="font-semibold text-foreground">{effectiveSearch}</span>'
        </p>
      )}

      {/* Pinyin Filter Row */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {visiblePinyin.map((py) => (
          <button
            key={py}
            onClick={() => handlePinyinClick(py)}
            className={`px-3 py-1.5 rounded-full text-sm font-mono transition-all ${
              activePinyin === py
                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                : "bg-card hover:bg-muted text-foreground border border-border"
            }`}
          >
            {py}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && effectiveSearch && (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground mt-3 font-mono text-sm">Searching...</p>
        </div>
      )}

      {/* No results */}
      {!isLoading && effectiveSearch && words.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">No words found for "<span className="font-semibold">{effectiveSearch}</span>"</p>
        </div>
      )}

      {/* Empty state */}
      {!effectiveSearch && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-lg text-muted-foreground">Type a pinyin or click a syllable above to start browsing</p>
        </div>
      )}

      {/* Word Cards - 2 column grid matching reference */}
      {paginatedWords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {paginatedWords.map((word, i) => (
            <button
              key={`${word.chinese}-${i}`}
              onClick={() => setSelectedWord(word)}
              className="text-left bg-card rounded-2xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all group flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                {/* Chinese + Pinyin inline */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl md:text-3xl font-bold">{word.chinese}</span>
                  <span className="text-primary font-mono text-sm">{word.pinyin}</span>
                </div>
                {/* Pinyin (no tones) + English below */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{word.pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (c) => {
                    const map: Record<string, string> = {
                      'ā':'a','á':'a','ǎ':'a','à':'a',
                      'ē':'e','é':'e','ě':'e','è':'e',
                      'ī':'i','í':'i','ǐ':'i','ì':'i',
                      'ō':'o','ó':'o','ǒ':'o','ò':'o',
                      'ū':'u','ú':'u','ǔ':'u','ù':'u',
                      'ǖ':'v','ǘ':'v','ǚ':'v','ǜ':'v',
                    };
                    return map[c] || c;
                  })}</span>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="truncate">{word.english}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${HSK_BADGE_STYLES[word.level] || HSK_BADGE_STYLES[1]}`}>
                  HSK{word.level}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSpeak(word.chinese); }}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {words.length > 0 && (
        <div className="flex items-center justify-between pb-8">
          {/* Word count */}
          <p className="text-sm text-muted-foreground font-mono">
            {startItem} – {endItem} of {words.length} words
          </p>

          {/* Page controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-8 w-8"
              >
                <ChevronLeft size={16} />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="font-mono h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-8 w-8"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Word Detail Dialog */}
      <Dialog open={!!selectedWord} onOpenChange={(open) => !open && setSelectedWord(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-5xl font-bold text-center pt-4">{selectedWord?.chinese}</DialogTitle>
          </DialogHeader>
          {selectedWord && (
            <div className="space-y-5 pb-2">
              <div className="text-center">
                <p className="text-primary font-mono text-xl">{selectedWord.pinyin}</p>
                <p className="text-muted-foreground mt-1 text-lg">{selectedWord.english}</p>
                <span className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full ${HSK_BADGE_STYLES[selectedWord.level]}`}>
                  HSK {selectedWord.level}
                </span>
              </div>

              {/* Pronunciation */}
              <Button
                variant="outline"
                className="w-full gap-2 rounded-xl h-11"
                onClick={() => handleSpeak(selectedWord.chinese)}
              >
                <Volume2 size={18} /> 🔊 Listen to Pronunciation
              </Button>

              {/* Example Sentence */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-2 border border-border">
                <p className="text-xs font-mono uppercase text-muted-foreground tracking-wider">📚 Example Sentence</p>
                <p className="text-xl font-bold">{selectedWord.chinese}！</p>
                <p className="text-primary font-mono text-sm">{selectedWord.pinyin}!</p>
                <p className="text-muted-foreground text-sm">{selectedWord.english}!</p>
              </div>

              {/* Add to flashcards */}
              <Button className="w-full gap-2 rounded-xl h-11">
                <Star size={18} /> ⭐ Add to Flashcards
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PinyinDictionaryPage;
