import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
// In a real app, these would likely be in separate JSON files
const resources = {
  en: {
    translation: {
      "settings": "Settings",
      "language": "Language",
      "theme": "Theme",
      "light": "Light",
      "dark": "Dark",
      "system": "System",
      "new_note": "New Note",
      "search": "Search...",
      "no_notes": "No notes found",
      "delete_confirm": "Are you sure you want to delete this note?",
      "untitled": "Untitled",
      "my_notebooks": "My Notebooks",
      "manage_materials": "Manage your research and study materials.",
      "new_notebook": "New Notebook",
      "enter_title": "Enter title...",
      "cancel": "Cancel",
      "create": "Create",
      "dashboard": "Dashboard",
      "system_ready": "System Ready",
      "app_title": "AI Notebook",
      "settings_title": "Settings",
      "settings_desc": "Configure your AI model and preferences.",
      "settings_saved": "Settings saved successfully",
      "provider": "Provider",
      "base_url": "Base URL",
      "api_key": "API Key",
      "model_name": "Model Name",
      "save_settings": "Save Settings",
      "notebook_not_found": "Notebook not found",
      "sources": "Sources",
      "no_sources": "No sources yet.",
      "notebook_guide": "Notebook Guide",
      "notebook_guide_desc": "I can help you analyze your sources. Ask me questions or generate a summary to get started.",
      "generate_summary": "Generate Summary",
      "thinking": "Thinking...",
      "ask_question_placeholder": "Ask a question about your sources...",
      "add_sources_to_chat": "Add sources to start chatting.",
      "add_source": "Add Source",
      "title": "Title",
      "content": "Content",
      "source_title_placeholder": "Source Title",
      "paste_text_placeholder": "Paste text here...",
      "file_upload_simulation": "File upload simulation",
      "simulate_file_content": "Simulate file content here...",
      "delete_source_confirm": "Delete this source?",
      "type_text": "Text",
      "type_link": "Link",
      "type_file": "File"
    }
  },
  zh: {
    translation: {
      "settings": "设置",
      "language": "语言",
      "theme": "主题",
      "light": "浅色",
      "dark": "深色",
      "system": "跟随系统",
      "new_note": "新建笔记",
      "search": "搜索...",
      "no_notes": "没有找到笔记",
      "delete_confirm": "确定要删除这条笔记吗？",
      "untitled": "无标题",
      "my_notebooks": "我的笔记本",
      "manage_materials": "管理您的研究和学习资料。",
      "new_notebook": "新建笔记本",
      "enter_title": "输入标题...",
      "cancel": "取消",
      "create": "创建",
      "dashboard": "仪表盘",
      "system_ready": "系统就绪",
      "app_title": "AI 笔记本",
      "settings_title": "设置",
      "settings_desc": "配置您的 AI 模型和偏好。",
      "settings_saved": "设置已保存",
      "provider": "提供商",
      "base_url": "基础 URL",
      "api_key": "API 密钥",
      "model_name": "模型名称",
      "save_settings": "保存设置",
      "notebook_not_found": "未找到笔记本",
      "sources": "来源",
      "no_sources": "暂无来源。",
      "notebook_guide": "笔记本向导",
      "notebook_guide_desc": "我可以帮您分析资料。向我提问或生成摘要以开始。",
      "generate_summary": "生成摘要",
      "thinking": "思考中...",
      "ask_question_placeholder": "关于您的资料提问...",
      "add_sources_to_chat": "添加来源以开始对话。",
      "add_source": "添加来源",
      "title": "标题",
      "content": "内容",
      "source_title_placeholder": "来源标题",
      "paste_text_placeholder": "在此粘贴文本...",
      "file_upload_simulation": "文件上传模拟",
      "simulate_file_content": "在此模拟文件内容...",
      "delete_source_confirm": "删除此来源？",
      "type_text": "文本",
      "type_link": "链接",
      "type_file": "文件"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh", // Default language (overrides detector if set)
    fallbackLng: "zh",
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;
