import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumb from "@/components/Breadcrumb";
import { Search, Volume2, Plus, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PINYIN_GRID = [
  ["a", "ai", "an", "ang", "ao"],
  ["ba", "bai", "ban", "bang", "bao", "bei", "ben", "bi", "bian", "bie", "bin", "bing", "bo", "bu"],
  ["ca", "cai", "can", "cang", "cao", "ce", "cen", "ci", "cong", "cu", "cuan", "cui", "cun", "cuo"],
  ["da", "dai", "dan", "dang", "dao", "de", "dei", "den", "di", "dian", "diao", "die", "ding", "diu", "dong", "dou", "du", "duan", "dui", "dun", "duo"],
  ["e", "ei", "en", "er"],
  ["fa", "fan", "fang", "fei", "fen", "feng", "fo", "fu"],
  ["ga", "gai", "gan", "gang", "gao", "ge", "gei", "gen", "gong", "gou", "gu", "gua", "guai", "guan", "guang", "gui", "gun", "guo"],
  ["ha", "hai", "han", "hang", "hao", "he", "hei", "hen", "heng", "hou", "hu", "hua", "huai", "huan", "huang", "hui", "hun", "huo"],
  ["ji", "jia", "jian", "jiang", "jiao", "jie", "jin", "jing", "jiu", "ju", "juan", "jue", "jun"],
  ["ka", "kai", "kan", "kang", "kao", "ke", "ken", "kong", "kou", "ku", "kua", "kuai", "kuan", "kuang", "kui", "kun", "kuo"],
  ["la", "lai", "lan", "lang", "lao", "le", "lei", "li", "lia", "lian", "liang", "liao", "lie", "lin", "ling", "liu", "long", "lou", "lu", "luan", "lun", "luo"],
  ["ma", "mai", "man", "mang", "mao", "me", "mei", "men", "mi", "mian", "miao", "mie", "min", "ming", "miu", "mo", "mou", "mu"],
  ["na", "nai", "nan", "nang", "nao", "ne", "nei", "ni", "nian", "niang", "niao", "nie", "nin", "ning", "niu", "nong", "nu", "nuan", "nuo"],
  ["pa", "pai", "pan", "pang", "pao", "pei", "pen", "pi", "pian", "piao", "pie", "pin", "ping", "po", "pu"],
  ["qi", "qia", "qian", "qiang", "qiao", "qie", "qin", "qing", "qiu", "qu", "quan", "que", "qun"],
  ["ran", "rang", "rao", "re", "ren", "ri", "rong", "rou", "ru", "ruan", "rui", "run", "ruo"],
  ["sa", "sai", "san", "sang", "sao", "se", "sen", "sha", "shai", "shan", "shang", "shao", "she", "shei", "shen", "sheng", "shi", "shou", "shu", "shua", "shuai", "shuan", "shuang", "shui", "shun", "shuo", "si", "song", "sou", "su", "suan", "sui", "sun", "suo"],
  ["ta", "tai", "tan", "tang", "tao", "te", "ti", "tian", "tiao", "tie", "ting", "tong", "tou", "tu", "tuan", "tui", "tun", "tuo"],
  ["wa", "wai", "wan", "wang", "wei", "wen", "wo", "wu"],
  ["xi", "xia", "xian", "xiang", "xiao", "xie", "xin", "xing", "xiu", "xu", "xuan", "xue", "xun"],
  ["ya", "yan", "yang", "yao", "ye", "yi", "yin", "ying", "yong", "you", "yu", "yuan", "yue", "yun"],
  ["za", "zai", "zan", "zang", "zao", "ze", "zei", "zen", "zha", "zhai", "zhan", "zhang", "zhao", "zhe", "zhei", "zhen", "zheng", "zhi", "zhong", "zhou", "zhu", "zhua", "zhuai", "zhuan", "zhuang", "zhui", "zhun", "zhuo", "zi", "zong", "zou", "zu", "zuan", "zui", "zun", "zuo"],
];

const ITEMS_PER_PAGE = 24;

const HSK_COLORS: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-800 border-emerald-300",
  2: "bg-sky-100 text-sky-800 border-sky-300",
  3: "bg-amber-100 text-amber-800 border-amber-300",
  4: "bg-violet-100 text-violet-800 border-violet-300",
  5: "bg-rose-100 text-rose-800 border-rose-300",
  6: "bg-red-100 text-red-800 border-red-300",
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
  const [expandedInitial, setExpandedInitial] = useState<string | null>(null);

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

      // Get lesson IDs to find levels
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

  // Group pinyin grid by initial letter
  const groupedPinyin = useMemo(() => {
    const groups: { letter: string; syllables: string[] }[] = [];
    PINYIN_GRID.forEach((row) => {
      const letter = row[0][0].toUpperCase();
      groups.push({ letter, syllables: row });
    });
    return groups;
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Pinyin Dictionary" }]} />

      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 brutalist-border border-primary/20">
          <BookOpen size={28} className="text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-mono tracking-tight">PINYIN DICTIONARY</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Search Chinese words by Pinyin
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search Pinyin (example: ni, hao, shi)'
          className="pl-12 h-14 text-lg rounded-xl brutalist-border bg-card focus-visible:ring-primary"
        />
        {(searchQuery || activePinyin) && (
          <button
            onClick={() => { setSearchQuery(""); setActivePinyin(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Pinyin Filter Grid */}
      {!effectiveSearch && (
        <div className="mb-10 brutalist-card rounded-2xl bg-card p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
            Click a Pinyin syllable to browse
          </p>
          <div className="flex flex-wrap gap-2">
            {groupedPinyin.map((group) => (
              <button
                key={group.letter}
                onClick={() => setExpandedInitial(expandedInitial === group.letter ? null : group.letter)}
                className={`px-3 py-2 rounded-lg text-sm font-bold font-mono transition-all brutalist-border ${
                  expandedInitial === group.letter
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 hover:bg-muted text-foreground"
                }`}
              >
                {group.letter}
              </button>
            ))}
          </div>

          {expandedInitial && (
            <div className="mt-4 pt-4 border-t-2 border-border">
              <div className="flex flex-wrap gap-1.5">
                {groupedPinyin
                  .find((g) => g.letter === expandedInitial)
                  ?.syllables.map((py) => (
                    <button
                      key={py}
                      onClick={() => handlePinyinClick(py)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                        activePinyin === py
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60 hover:bg-primary/10 text-foreground"
                      }`}
                    >
                      {py}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filter tag */}
      {activePinyin && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-mono">Showing results for:</span>
          <Badge variant="secondary" className="text-base font-mono px-3 py-1">
            {activePinyin}
          </Badge>
          <span className="text-sm text-muted-foreground font-mono">({words.length} words)</span>
        </div>
      )}

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
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-muted-foreground font-mono">No words found for "{effectiveSearch}"</p>
        </div>
      )}

      {/* Word Cards Grid */}
      {paginatedWords.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {paginatedWords.map((word, i) => (
            <button
              key={`${word.chinese}-${i}`}
              onClick={() => setSelectedWord(word)}
              className="text-left bg-card rounded-xl brutalist-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-bold tracking-wide">{word.chinese}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSpeak(word.chinese); }}
                  className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-primary font-mono text-sm mb-1">{word.pinyin}</p>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{word.english}</p>
              <Badge className={`text-xs border ${HSK_COLORS[word.level] || HSK_COLORS[1]}`} variant="outline">
                HSK {word.level}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="font-mono"
          >
            <ChevronLeft size={16} /> Previous
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
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="font-mono w-9"
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="font-mono"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Word Detail Dialog */}
      <Dialog open={!!selectedWord} onOpenChange={(open) => !open && setSelectedWord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center pt-2">{selectedWord?.chinese}</DialogTitle>
          </DialogHeader>
          {selectedWord && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-primary font-mono text-lg">{selectedWord.pinyin}</p>
                <p className="text-muted-foreground mt-1">{selectedWord.english}</p>
                <Badge className={`mt-2 text-xs border ${HSK_COLORS[selectedWord.level]}`} variant="outline">
                  HSK {selectedWord.level}
                </Badge>
              </div>

              {/* Pronunciation */}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleSpeak(selectedWord.chinese)}
              >
                <Volume2 size={18} /> Listen to Pronunciation
              </Button>

              {/* Example (generated from word) */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-1 brutalist-border">
                <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Example</p>
                <p className="text-lg font-bold">{selectedWord.chinese}很重要。</p>
                <p className="text-primary font-mono text-sm">{selectedWord.pinyin} hěn zhòngyào.</p>
                <p className="text-muted-foreground text-sm">{selectedWord.english} is very important.</p>
              </div>

              {/* Add to flashcards */}
              <Button className="w-full gap-2">
                <Plus size={18} /> Add to Flashcards
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PinyinDictionaryPage;
