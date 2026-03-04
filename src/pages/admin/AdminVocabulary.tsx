import { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Plus, Edit3, Trash2, Volume2 } from 'lucide-react';
import { hsk1Lessons } from '@/data/hsk1-lessons';
import { hsk2Lessons } from '@/data/hsk2-lessons';
import { hsk3Lessons } from '@/data/hsk3-lessons';
import { hsk4Lessons } from '@/data/hsk4-lessons';
import { hsk5Lessons } from '@/data/hsk5-lessons';
import { hsk6Lessons } from '@/data/hsk6-lessons';

const hskLessonMap: Record<string, typeof hsk1Lessons> = {
  '1': hsk1Lessons, '2': hsk2Lessons, '3': hsk3Lessons,
  '4': hsk4Lessons, '5': hsk5Lessons, '6': hsk6Lessons,
};

const AdminVocabulary = () => {
  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState('1');

  const allWords = (hskLessonMap[activeLevel] || []).flatMap((l) => l.vocab.map((v) => ({ ...v, lesson: `${l.chinese} - ${l.english}` })));

  const filtered = allWords.filter(
    (w) => w.chinese.includes(search) || w.pinyin.toLowerCase().includes(search.toLowerCase()) || w.english.toLowerCase().includes(search.toLowerCase())
  );

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    speechSynthesis.speak(u);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Vocabulary' }]} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-primary" size={28} />
          <h1 className="text-3xl font-bold">Vocabulary Database</h1>
          <span className="retro-tag text-muted-foreground">{allWords.length} words</span>
        </div>
        <Button className="brutalist-shadow"><Plus size={16} /> Add Word</Button>
      </div>

      <Tabs value={activeLevel} onValueChange={setActiveLevel}>
        <TabsList className="brutalist-border mb-4">
          {[1,2,3,4,5,6].map((l) => (
            <TabsTrigger key={l} value={String(l)} className="font-mono">HSK {l}</TabsTrigger>
          ))}
        </TabsList>
        <div className="mb-4">
          <Input placeholder="Search by Chinese, Pinyin or English..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        </div>
        <TabsContent value={activeLevel}>
          <div className="brutalist-card rounded-xl bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chinese</TableHead>
                  <TableHead>Pinyin</TableHead>
                  <TableHead>English</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No words found</TableCell></TableRow>
                ) : (
                  filtered.slice(0, 50).map((w, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xl font-bold">{w.chinese}</TableCell>
                      <TableCell className="font-mono text-primary">{w.pinyin}</TableCell>
                      <TableCell>{w.english}</TableCell>
                      <TableCell className="font-mono text-xs">{w.lesson}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => speak(w.chinese)}><Volume2 size={16} /></Button>
                          <Button variant="ghost" size="icon"><Edit3 size={16} /></Button>
                          <Button variant="ghost" size="icon"><Trash2 size={16} className="text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {filtered.length > 50 && <p className="text-center py-3 text-muted-foreground text-sm font-mono">Showing 50 of {filtered.length} words</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVocabulary;
