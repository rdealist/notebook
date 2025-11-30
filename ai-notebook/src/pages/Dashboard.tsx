import { useState, useEffect } from 'react';
import { Plus, Notebook as NotebookIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notebook, NotebookService } from '../lib/notebookService';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    setNotebooks(NotebookService.getAll());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const notebook = NotebookService.create(newTitle);
    setNotebooks(NotebookService.getAll());
    setNewTitle('');
    setIsCreating(false);
    navigate(`/notebook/${notebook.id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm(t('delete_confirm'))) {
      NotebookService.delete(id);
      setNotebooks(NotebookService.getAll());
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('my_notebooks', 'My Notebooks')}</h1>
        <p className="text-muted-foreground">{t('manage_materials', 'Manage your research and study materials.')}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Create New Card */}
        {isCreating ? (
          <div className="flex flex-col h-48 p-6 rounded-xl border border-primary bg-card shadow-md">
            <h3 className="font-semibold text-lg mb-4">{t('new_notebook', 'New Notebook')}</h3>
            <form onSubmit={handleCreate} className="flex-1 flex flex-col justify-between">
              <input
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t('enter_title', 'Enter title...')}
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-background"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                >
                  {t('create', 'Create')}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="group relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-accent/50 transition-all cursor-pointer"
          >
            <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <span className="font-medium text-lg">{t('new_notebook', 'New Notebook')}</span>
          </button>
        )}

        {/* Existing Notebooks */}
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            onClick={() => navigate(`/notebook/${notebook.id}`)}
            className="flex flex-col h-48 p-6 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group relative"
          >
            <div className="flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 group-hover:scale-105 transition-transform flex items-center justify-center">
                 <NotebookIcon className="text-white w-6 h-6 opacity-75" />
              </div>
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{notebook.title}</h3>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>{notebook.sources.length} sources</span>
              <span>{new Date(notebook.updatedAt).toLocaleDateString()}</span>
            </div>

            <button
                onClick={(e) => handleDelete(e, notebook.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
