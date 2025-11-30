import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LLMSettings {
  provider: 'openai' | 'anthropic' | 'custom';
  baseUrl: string;
  apiKey: string;
  model: string;
}

const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
};

export default function Settings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<LLMSettings>(DEFAULT_SETTINGS);
  const [showApiKey, setShowApiKey] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('llm_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('llm_settings', JSON.stringify(settings));
    setMessage({ type: 'success', text: t('settings_saved') });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('settings_title', 'Settings')}</h1>
        <p className="text-muted-foreground">{t('settings_desc', 'Configure your AI model and preferences.')}</p>
      </header>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-600 border border-green-500/20'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="grid gap-2">
            <label htmlFor="provider" className="text-sm font-medium">
              {t('provider', 'Provider')}
            </label>
            <select
              id="provider"
              name="provider"
              value={settings.provider}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic (Coming Soon)</option>
              <option value="custom">Custom (OpenAI Compatible)</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="baseUrl" className="text-sm font-medium">
              {t('base_url', 'Base URL')}
            </label>
            <input
              id="baseUrl"
              name="baseUrl"
              type="url"
              value={settings.baseUrl}
              onChange={handleChange}
              placeholder="https://api.openai.com/v1"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              {t('api_key', 'API Key')}
            </label>
            <div className="relative">
              <input
                id="apiKey"
                name="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={handleChange}
                placeholder="sk-..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="model" className="text-sm font-medium">
              {t('model_name', 'Model Name')}
            </label>
            <input
              id="model"
              name="model"
              type="text"
              value={settings.model}
              onChange={handleChange}
              placeholder="gpt-4o"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('save_settings', 'Save Settings')}
          </button>
        </div>
      </form>
    </div>
  );
}
