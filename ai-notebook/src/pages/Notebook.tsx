import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Plus, FileText, Link as LinkIcon, FileType,
    ChevronLeft, Trash2, X, Upload, Sparkles, Send
} from 'lucide-react';
import { Notebook, NotebookService } from '../lib/notebookService';
import { AiService } from '../lib/aiService';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function NotebookPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [notebook, setNotebook] = useState<Notebook | undefined>(undefined);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [sourceType, setSourceType] = useState<'text' | 'link' | 'file'>('text');
  const [newSourceContent, setNewSourceContent] = useState('');
  const [newSourceTitle, setNewSourceTitle] = useState('');

  // Chat / AI State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
        const data = NotebookService.getById(id);
        setNotebook(data);
    }
  }, [id]);

  const handleAddSource = (e: React.FormEvent) => {
      e.preventDefault();
      if (!id || !newSourceTitle.trim() || !newSourceContent.trim()) return;

      const newSource = NotebookService.addSource(id, {
          type: sourceType,
          title: newSourceTitle,
          content: newSourceContent
      });

      if (newSource) {
          setNotebook(NotebookService.getById(id));
          setIsAddingSource(false);
          setNewSourceTitle('');
          setNewSourceContent('');
          setSourceType('text');
      }
  };

  const deleteSource = (sourceId: string) => {
      if (!id || !notebook) return;
      if (confirm(t('delete_source_confirm'))) {
          const updatedSources = notebook.sources.filter(s => s.id !== sourceId);
          NotebookService.update(id, { sources: updatedSources });
          setNotebook(NotebookService.getById(id));
      }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!inputMessage.trim() || !notebook) return;

      const userMsg = inputMessage;
      setInputMessage('');

      const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: userMsg }];
      setChatHistory(newHistory);
      setIsGenerating(true);

      try {
          const aiResponse = await AiService.chat(
              newHistory.map(h => ({ role: h.role, content: h.content })),
              userMsg,
              notebook.sources
          );
          setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } catch (err: any) {
          setChatHistory(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleGenerateSummary = async () => {
      if (!notebook) return;
      setIsGenerating(true);
      try {
          const summary = await AiService.generateSummary(notebook.sources);
          setChatHistory(prev => [...prev, { role: 'assistant', content: summary }]);
      } catch (err: any) {
          setChatHistory(prev => [...prev, { role: 'assistant', content: `Error generating summary: ${err.message}` }]);
      } finally {
          setIsGenerating(false);
      }
  };

  if (!notebook) {
      return <div className="p-8">{t('notebook_not_found')}</div>;
  }

  return (
    <div className="flex h-full overflow-hidden">
        {/* Left Panel: Sources */}
        <div className="w-80 border-r border-border bg-card flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h2 className="font-semibold truncate flex-1 ml-2" title={notebook.title}>{notebook.title}</h2>
            </div>

            <div className="p-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('sources')}</h3>
                <button
                    onClick={() => setIsAddingSource(true)}
                    className="p-1 hover:bg-accent rounded-md text-primary"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                {notebook.sources.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        {t('no_sources')}
                    </div>
                ) : (
                    notebook.sources.map(source => (
                        <div key={source.id} className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors">
                            <div className="mt-0.5">
                                {source.type === 'text' && <FileText className="w-4 h-4 text-blue-500" />}
                                {source.type === 'link' && <LinkIcon className="w-4 h-4 text-green-500" />}
                                {source.type === 'file' && <FileType className="w-4 h-4 text-orange-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{source.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{t(`type_${source.type}`)}</p>
                            </div>
                            <button
                                onClick={() => deleteSource(source.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Main Content: Chat / Notebook Interface */}
        <div className="flex-1 flex flex-col bg-background min-w-0">
            {chatHistory.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{t('notebook_guide')}</h1>
                    <p className="text-muted-foreground max-w-md mb-8">
                        {t('notebook_guide_desc')}
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={handleGenerateSummary}
                            disabled={notebook.sources.length === 0 || isGenerating}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles className="w-4 h-4" />
                            {t('generate_summary')}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-3xl rounded-2xl px-6 py-4 ${
                                    msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground'
                                }`}
                            >
                                {msg.role === 'user' ? (
                                    <p>{msg.content}</p>
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex justify-start">
                             <div className="bg-muted text-foreground max-w-3xl rounded-2xl px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    {t('thinking')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-border bg-background">
                <form onSubmit={handleSendMessage} className="relative max-w-3xl mx-auto">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={t('ask_question_placeholder')}
                        disabled={isGenerating || notebook.sources.length === 0}
                        className="w-full pl-6 pr-12 py-4 rounded-full border border-input bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim() || isGenerating}
                        className="absolute right-2 top-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                {notebook.sources.length === 0 && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        {t('add_sources_to_chat')}
                    </p>
                )}
            </div>
        </div>

        {/* Add Source Modal */}
        {isAddingSource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">{t('add_source')}</h3>
                        <button onClick={() => setIsAddingSource(false)}>
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <form onSubmit={handleAddSource} className="space-y-4">
                        <div className="flex gap-2 p-1 bg-muted rounded-lg">
                            {(['text', 'link', 'file'] as const).map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSourceType(type)}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize ${
                                        sourceType === type
                                            ? 'bg-background shadow-sm text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {t(`type_${type}`)}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">{t('title')}</label>
                            <input
                                required
                                value={newSourceTitle}
                                onChange={e => setNewSourceTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                                placeholder={t('source_title_placeholder')}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">{t('content')}</label>
                            {sourceType === 'text' && (
                                <textarea
                                    required
                                    value={newSourceContent}
                                    onChange={e => setNewSourceContent(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm min-h-[100px]"
                                    placeholder={t('paste_text_placeholder')}
                                />
                            )}
                            {sourceType === 'link' && (
                                <input
                                    required
                                    type="url"
                                    value={newSourceContent}
                                    onChange={e => setNewSourceContent(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                                    placeholder="https://..."
                                />
                            )}
                            {sourceType === 'file' && (
                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">{t('file_upload_simulation')}</p>
                                    <input
                                        // Mock file upload by just taking text for now
                                        type="text"
                                        value={newSourceContent}
                                        onChange={e => setNewSourceContent(e.target.value)}
                                        className="mt-4 w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                                        placeholder={t('simulate_file_content')}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90"
                            >
                                {t('add_source')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
