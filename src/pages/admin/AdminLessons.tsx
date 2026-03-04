import { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Plus, Edit3, Trash2, Eye } from 'lucide-react';
import { hsk1Lessons } from '@/data/hsk1-lessons';

const hskLevels = [1, 2, 3, 4, 5, 6];

const AdminLessons = () => {
  const [activeLevel, setActiveLevel] = useState('1');
  const [search, setSearch] = useState('');

  const lessons = activeLevel === '1' ? hsk1Lessons : [];
  const filtered = lessons.filter((l) =>
    l.english.toLowerCase().includes(search.toLowerCase()) || l.chinese.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Lessons' }]} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-primary" size={28} />
          <h1 className="text-3xl font-bold">Lesson Management</h1>
        </div>
        <Button className="brutalist-shadow"><Plus size={16} /> Add Lesson</Button>
      </div>

      <Tabs value={activeLevel} onValueChange={setActiveLevel}>
        <TabsList className="brutalist-border mb-4">
          {hskLevels.map((l) => (
            <TabsTrigger key={l} value={String(l)} className="font-mono">HSK {l}</TabsTrigger>
          ))}
        </TabsList>
        <div className="mb-4">
          <Input placeholder="Search lessons..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        </div>
        {hskLevels.map((level) => (
          <TabsContent key={level} value={String(level)}>
            <div className="brutalist-card rounded-xl bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Words</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {level === 1 ? (
                    filtered.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-mono">{lesson.id}</TableCell>
                        <TableCell className="font-medium">{lesson.chinese} - {lesson.english}</TableCell>
                        <TableCell className="font-mono">{lesson.vocab.length}</TableCell>
                        <TableCell><span className="retro-tag text-secondary">Active</span></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon"><Eye size={16} /></Button>
                            <Button variant="ghost" size="icon"><Edit3 size={16} /></Button>
                            <Button variant="ghost" size="icon"><Trash2 size={16} className="text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-mono">HSK {level} lessons coming soon</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminLessons;
