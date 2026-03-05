import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Breadcrumb from '@/components/Breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardList, Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MockQuestion {
  id: string;
  level: number;
  section: string;
  part: string;
  question_type: string;
  question_number: number;
  question: string;
  correct_answer: string;
  options: any;
  chinese_text: string | null;
  pinyin_text: string | null;
  explanation: string | null;
  passage: string | null;
  test_number: number;
  sort_order: number;
}

const emptyQuestion: Omit<MockQuestion, 'id'> = {
  level: 1,
  section: 'listening',
  part: 'Part 1',
  question_type: 'multiple_choice',
  question_number: 1,
  question: '',
  correct_answer: '',
  options: [],
  chinese_text: null,
  pinyin_text: null,
  explanation: null,
  passage: null,
  test_number: 1,
  sort_order: 0,
};

const AdminMockTests = () => {
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<MockQuestion> | null>(null);
  const [optionsText, setOptionsText] = useState('');
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    let query = supabase.from('mock_test_questions').select('*').order('level').order('sort_order');
    if (filterLevel !== 'all') query = query.eq('level', parseInt(filterLevel));
    if (filterSection !== 'all') query = query.eq('section', filterSection);
    const { data, error } = await query;
    if (error) toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
    setQuestions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, [filterLevel, filterSection]);

  const openAddDialog = () => {
    setEditingQuestion({ ...emptyQuestion });
    setOptionsText('');
    setDialogOpen(true);
  };

  const openEditDialog = (q: MockQuestion) => {
    setEditingQuestion({ ...q });
    setOptionsText(Array.isArray(q.options) ? q.options.join('\n') : '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingQuestion) return;
    const parsedOptions = optionsText.split('\n').filter(o => o.trim());
    const payload = {
      ...editingQuestion,
      options: parsedOptions.length > 0 ? parsedOptions : null,
    };
    delete (payload as any).id;

    if ((editingQuestion as MockQuestion).id) {
      const { error } = await supabase
        .from('mock_test_questions')
        .update(payload as any)
        .eq('id', (editingQuestion as MockQuestion).id);
      if (error) {
        toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: '✅ Question updated!' });
    } else {
      const { error } = await supabase.from('mock_test_questions').insert(payload as any);
      if (error) {
        toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: '✅ Question added!' });
    }
    setDialogOpen(false);
    fetchQuestions();
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from('mock_test_questions').delete().eq('id', id);
    if (error) {
      toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: '✅ Question deleted!' });
    fetchQuestions();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Mock Tests' }]} />
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="text-primary" size={28} />
        <h1 className="text-3xl font-bold">Mock Test Management</h1>
        <span className="retro-tag text-muted-foreground">{questions.length} questions</span>
      </div>

      {/* Filters & Add */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {[1,2,3,4,5,6].map(l => <SelectItem key={l} value={String(l)}>HSK {l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSection} onValueChange={setFilterSection}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Section" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="listening">Listening</SelectItem>
            <SelectItem value="reading">Reading</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openAddDialog} className="ml-auto brutalist-shadow">
          <Plus size={16} className="mr-1" /> Add Question
        </Button>
      </div>

      <div className="brutalist-card rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Part</TableHead>
              <TableHead>Q#</TableHead>
              <TableHead className="max-w-[200px]">Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : questions.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No questions found</TableCell></TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell><Badge variant="outline">HSK {q.level}</Badge></TableCell>
                  <TableCell className="capitalize text-sm">{q.section}</TableCell>
                  <TableCell className="text-sm font-mono">{q.part}</TableCell>
                  <TableCell className="font-mono">{q.question_number}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{q.question}</TableCell>
                  <TableCell className="font-mono text-sm text-primary">{q.correct_answer}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(q)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteQuestion(q.id)}>
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{(editingQuestion as any)?.id ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Level</label>
                  <Select value={String(editingQuestion.level)} onValueChange={v => setEditingQuestion({...editingQuestion, level: parseInt(v)})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(l => <SelectItem key={l} value={String(l)}>HSK {l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Section</label>
                  <Select value={editingQuestion.section} onValueChange={v => setEditingQuestion({...editingQuestion, section: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Part</label>
                  <Input value={editingQuestion.part || ''} onChange={e => setEditingQuestion({...editingQuestion, part: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Question #</label>
                  <Input type="number" value={editingQuestion.question_number || ''} onChange={e => setEditingQuestion({...editingQuestion, question_number: parseInt(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Question Type</label>
                  <Select value={editingQuestion.question_type} onValueChange={v => setEditingQuestion({...editingQuestion, question_type: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="fill_blank">Fill Blank</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Test Number</label>
                  <Input type="number" value={editingQuestion.test_number || 1} onChange={e => setEditingQuestion({...editingQuestion, test_number: parseInt(e.target.value)})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Question</label>
                <Textarea value={editingQuestion.question || ''} onChange={e => setEditingQuestion({...editingQuestion, question: e.target.value})} className="mt-1" rows={2} />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Chinese Text</label>
                <Input value={editingQuestion.chinese_text || ''} onChange={e => setEditingQuestion({...editingQuestion, chinese_text: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Pinyin Text</label>
                <Input value={editingQuestion.pinyin_text || ''} onChange={e => setEditingQuestion({...editingQuestion, pinyin_text: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Options (one per line)</label>
                <Textarea value={optionsText} onChange={e => setOptionsText(e.target.value)} className="mt-1 font-mono" rows={4} placeholder="Option A&#10;Option B&#10;Option C&#10;Option D" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Correct Answer</label>
                <Input value={editingQuestion.correct_answer || ''} onChange={e => setEditingQuestion({...editingQuestion, correct_answer: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Explanation</label>
                <Textarea value={editingQuestion.explanation || ''} onChange={e => setEditingQuestion({...editingQuestion, explanation: e.target.value})} className="mt-1" rows={2} />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Passage</label>
                <Textarea value={editingQuestion.passage || ''} onChange={e => setEditingQuestion({...editingQuestion, passage: e.target.value})} className="mt-1" rows={3} />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Sort Order</label>
                <Input type="number" value={editingQuestion.sort_order || 0} onChange={e => setEditingQuestion({...editingQuestion, sort_order: parseInt(e.target.value)})} className="mt-1" />
              </div>
              <Button onClick={handleSave} className="w-full brutalist-shadow">
                <Save size={16} className="mr-1" /> Save Question
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMockTests;
