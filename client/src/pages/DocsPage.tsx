// File: src/pages/DocsPage.tsx
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { FileText, BookOpen, Code, Lightbulb, Rocket, History, Shield, Wrench, FlaskConical, Target, Smartphone } from 'lucide-react';

// Create a local component that doesn't rely on the import
const DocsLayout = ({ children, activeDoc, navigate }: { children: React.ReactNode, activeDoc: string, navigate: (page: string) => void }) => {
  const navItems = [
    { id: 'index', label: 'Docs Index', icon: FileText },
    { id: 'quick_start', label: 'Quick Start', icon: Rocket },
    { id: 'prd', label: 'PRD', icon: Lightbulb },
    { id: 'roadmap', label: 'Roadmap', icon: Target },
    { id: 'setup', label: 'Setup', icon: Rocket },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'testing', label: 'Testing', icon: Wrench },
    { id: 'deployment', label: 'Deployment', icon: FlaskConical },
    { id: 'template_usage', label: 'Template Usage', icon: BookOpen },
    { id: 'mobile_responsiveness', label: 'Mobile Responsiveness', icon: Smartphone },
    { id: 'coding_principles', label: 'Coding Principles', icon: Code },
    { id: 'changelog', label: 'Changelog', icon: History },
    { id: 'phase_0', label: 'Phase 0', icon: BookOpen },
    { id: 'phase_2', label: 'Phase 2', icon: BookOpen },
  ];

  return (
    <div className="md:grid md:grid-cols-12 md:gap-8">
      <aside className="md:col-span-3 lg:col-span-2 mb-6 md:mb-0">
        <nav className="space-y-1 md:sticky md:top-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(`docs/${id}`)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition-colors duration-150 ${
                activeDoc === id
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <div className="md:col-span-9 lg:col-span-10">
        {children}
      </div>
    </div>
  );
};

type DocsPageProps = {
  docName: 'index' | 'quick_start' | 'prd' | 'roadmap' | 'setup' | 'security' | 'testing' | 'deployment' | 'template_usage' | 'mobile_responsiveness' | 'coding_principles' | 'changelog' | 'phase_0' | 'phase_2';
  navigate: (page: string) => void;
};

export function DocsPage({ docName, navigate }: DocsPageProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      let filePath = '/docs/README.md';
      
      if (docName === 'index') {
        filePath = '/docs/README.md';
      } else if (docName === 'quick_start') {
        filePath = '/docs/development/QUICK_START.md';
      } else if (docName === 'prd') {
        filePath = '/docs/product/PRD.md';
      } else if (docName === 'roadmap') {
        filePath = '/docs/product/ROADMAP.md';
      } else if (docName === 'setup') {
        filePath = '/docs/development/SETUP.md';
      } else if (docName === 'security') {
        filePath = '/docs/development/SECURITY.md';
      } else if (docName === 'testing') {
        filePath = '/docs/development/TESTING.md';
      } else if (docName === 'deployment') {
        filePath = '/docs/operations/DEPLOYMENT.md';
      } else if (docName === 'template_usage') {
        filePath = '/docs/development/TEMPLATE_USAGE.md';
      } else if (docName === 'mobile_responsiveness') {
        filePath = '/docs/development/MOBILE_RESPONSIVENESS.md';
      } else if (docName === 'coding_principles') {
        filePath = '/docs/development/CODING_PRINCIPLES.md';
      } else if (docName === 'changelog') {
        filePath = '/docs/development/CHANGELOG.md';
      } else if (docName === 'phase_0') {
        filePath = '/docs/phases/PHASE_0.md';
      } else if (docName === 'phase_2') {
        filePath = '/docs/phases/PHASE_2.md';
      }
      
      try {
        console.log(`Fetching document from: ${filePath}`);
        const response = await fetch(filePath);
        
        if (!response.ok) {
          throw new Error(`Could not load ${filePath}. Status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log(`Received markdown content (first 50 chars): ${text.substring(0, 50)}...`);
        
        // Parse the markdown to HTML
        const html = await marked.parse(text);
        
        // Make sure html is a string
        if (typeof html === 'string') {
          console.log(`Parsed HTML (first 50 chars): ${html.substring(0, 50)}...`);
          setContent(html);
        } else {
          console.error('Marked returned a non-string value:', html);
          setError('Error parsing markdown content');
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(message);
        console.error("Error fetching doc:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docName]);

  return (
    <DocsLayout navigate={navigate} activeDoc={docName}>
      <article className="prose prose-base md:prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800/50 p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        {loading && <p>Loading document...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </article>
    </DocsLayout>
  );
}
