export interface Notebook {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sources: Source[];
}

export interface Source {
  id: string;
  type: 'text' | 'link' | 'file';
  title: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'ai_notebooks';

export const NotebookService = {
  getAll: (): Notebook[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Notebook | undefined => {
    const notebooks = NotebookService.getAll();
    return notebooks.find((n) => n.id === id);
  },

  create: (title: string): Notebook => {
    const notebooks = NotebookService.getAll();
    const newNotebook: Notebook = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sources: [],
    };
    notebooks.push(newNotebook);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
    return newNotebook;
  },

  update: (id: string, updates: Partial<Notebook>): Notebook | undefined => {
    const notebooks = NotebookService.getAll();
    const index = notebooks.findIndex((n) => n.id === id);
    if (index === -1) return undefined;

    const updated = { ...notebooks[index], ...updates, updatedAt: new Date().toISOString() };
    notebooks[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
    return updated;
  },

  delete: (id: string) => {
    const notebooks = NotebookService.getAll();
    const filtered = notebooks.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  addSource: (notebookId: string, source: Omit<Source, 'id' | 'createdAt'>): Source | undefined => {
      const notebook = NotebookService.getById(notebookId);
      if (!notebook) return undefined;

      const newSource: Source = {
          ...source,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
      };

      const updatedSources = [...notebook.sources, newSource];
      NotebookService.update(notebookId, { sources: updatedSources });
      return newSource;
  }
};
