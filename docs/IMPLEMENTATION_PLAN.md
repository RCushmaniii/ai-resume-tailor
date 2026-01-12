# Implementation Plan: Full SaaS Features

This document details the implementation plan for transforming the MVP into a full SaaS product with authentication, file uploads, and database storage.

---

## Phase 1: Database Schema (Supabase Postgres)

### 1.1 Tables Overview

```sql
-- User profiles (extends Supabase auth.users)
profiles
  ├── id (uuid, FK to auth.users)
  ├── full_name (text)
  ├── avatar_url (text)
  ├── credits_remaining (int, default 5)
  ├── subscription_tier (enum: free, pro, enterprise)
  ├── subscription_status (enum: active, canceled, past_due)
  ├── stripe_customer_id (text)
  ├── created_at (timestamptz)
  └── updated_at (timestamptz)

-- Analysis history
analyses
  ├── id (uuid, PK)
  ├── user_id (uuid, FK to profiles)
  ├── resume_text (text)
  ├── job_description (text)
  ├── job_title (text, extracted)
  ├── company_name (text, extracted)
  ├── score (int)
  ├── result_json (jsonb)
  ├── created_at (timestamptz)
  └── is_favorite (boolean)

-- Subscriptions (Stripe sync)
subscriptions
  ├── id (uuid, PK)
  ├── user_id (uuid, FK to profiles)
  ├── stripe_subscription_id (text)
  ├── stripe_price_id (text)
  ├── status (enum)
  ├── current_period_start (timestamptz)
  ├── current_period_end (timestamptz)
  ├── cancel_at_period_end (boolean)
  └── created_at (timestamptz)

-- Credit transactions (audit trail)
credit_transactions
  ├── id (uuid, PK)
  ├── user_id (uuid, FK to profiles)
  ├── amount (int, positive or negative)
  ├── reason (enum: signup_bonus, analysis, purchase, refund)
  ├── analysis_id (uuid, nullable FK)
  └── created_at (timestamptz)
```

### 1.2 Migration File

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscription tiers enum
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE credit_reason AS ENUM ('signup_bonus', 'analysis', 'purchase', 'refund', 'admin');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    credits_remaining INTEGER DEFAULT 5 NOT NULL,
    subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
    subscription_status subscription_status DEFAULT 'active',
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Analyses table
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    resume_text TEXT NOT NULL,
    job_description TEXT NOT NULL,
    job_title TEXT,
    company_name TEXT,
    score INTEGER,
    result_json JSONB,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT NOT NULL,
    status subscription_status NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Credit transactions table
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    reason credit_reason NOT NULL,
    analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Analyses: Users can only see/manage their own analyses
CREATE POLICY "Users can view own analyses" ON analyses
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analyses" ON analyses
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions: Users can only view their own
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Credit transactions: Users can only view their own
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );

    -- Grant signup bonus credits
    INSERT INTO public.credit_transactions (user_id, amount, reason)
    VALUES (NEW.id, 5, 'signup_bonus');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to decrement credits
CREATE OR REPLACE FUNCTION public.use_credit(p_user_id UUID, p_analysis_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT credits_remaining INTO current_credits
    FROM profiles WHERE id = p_user_id FOR UPDATE;

    IF current_credits > 0 THEN
        UPDATE profiles SET credits_remaining = credits_remaining - 1
        WHERE id = p_user_id;

        INSERT INTO credit_transactions (user_id, amount, reason, analysis_id)
        VALUES (p_user_id, -1, 'analysis', p_analysis_id);

        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 1.3 Apply Migration

```bash
# Generate migration from SQL file
npx supabase db push

# Or run directly in Supabase SQL Editor
```

---

## Phase 2: OAuth Authentication (Google + LinkedIn)

### 2.1 Supabase Dashboard Configuration

**Google OAuth:**
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `https://[project].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase Dashboard > Authentication > Providers > Google:
   - Enable Google
   - Paste Client ID and Client Secret

**LinkedIn OAuth:**
1. Go to LinkedIn Developer Portal > Create App
2. Under Products, add "Sign In with LinkedIn using OpenID Connect"
3. Add authorized redirect URL: `https://[project].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase Dashboard > Authentication > Providers > LinkedIn (OIDC):
   - Enable LinkedIn
   - Paste Client ID and Client Secret

### 2.2 Frontend Implementation

Update `client/src/lib/supabaseClient.ts`:

```typescript
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}

// OAuth sign-in helpers
export async function signInWithGoogle() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not configured');

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/analyze`,
    },
  });
}

export async function signInWithLinkedIn() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not configured');

  return supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: `${window.location.origin}/analyze`,
    },
  });
}
```

### 2.3 Update Login/Signup Pages

Add social login buttons to both pages:

```tsx
// Social login button component
interface SocialButtonProps {
  provider: 'google' | 'linkedin';
  onClick: () => void;
  loading?: boolean;
}

function SocialLoginButton({ provider, onClick, loading }: SocialButtonProps) {
  const icons = {
    google: <GoogleIcon className="w-5 h-5" />,
    linkedin: <LinkedInIcon className="w-5 h-5" />,
  };

  const labels = {
    google: 'Continue with Google',
    linkedin: 'Continue with LinkedIn',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {icons[provider]}
      <span>{labels[provider]}</span>
    </button>
  );
}
```

---

## Phase 3: File Upload (PDF + DOCX)

### 3.1 Backend Implementation (Python/Flask)

Add to `server/requirements.txt`:
```
pdfplumber>=0.10.0
python-docx>=1.0.0
```

Create `server/file_parser.py`:

```python
"""
File Parser Module
Extracts text from PDF and DOCX files.
"""

import io
from typing import Optional
import pdfplumber
from docx import Document

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file bytes."""
    text_parts = []

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)

    return "\n\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX file bytes."""
    doc = Document(io.BytesIO(file_bytes))
    text_parts = []

    for paragraph in doc.paragraphs:
        if paragraph.text.strip():
            text_parts.append(paragraph.text)

    # Also extract from tables
    for table in doc.tables:
        for row in table.rows:
            row_text = " | ".join(cell.text for cell in row.cells if cell.text.strip())
            if row_text:
                text_parts.append(row_text)

    return "\n".join(text_parts)


def parse_resume_file(file_bytes: bytes, filename: str) -> Optional[str]:
    """
    Parse resume file and extract text.

    Args:
        file_bytes: Raw file bytes
        filename: Original filename (for extension detection)

    Returns:
        Extracted text or None if unsupported format

    Raises:
        ValueError: If file is too large or parsing fails
    """
    if len(file_bytes) > MAX_FILE_SIZE:
        raise ValueError(f"File too large. Maximum size is {MAX_FILE_SIZE // 1024 // 1024}MB")

    extension = filename.lower().split('.')[-1]

    if extension == 'pdf':
        return extract_text_from_pdf(file_bytes)
    elif extension == 'docx':
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: .{extension}. Please use PDF or DOCX.")
```

Add endpoint to `server/app.py`:

```python
from file_parser import parse_resume_file

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    """Parse uploaded resume file and return extracted text."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400

    try:
        file_bytes = file.read()
        text = parse_resume_file(file_bytes, file.filename)

        if not text or len(text.strip()) < 100:
            return jsonify({'error': 'Could not extract sufficient text from file'}), 400

        return jsonify({
            'text': text,
            'character_count': len(text)
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f"File parsing error: {e}")
        return jsonify({'error': 'Failed to parse file. Please try copy-pasting the text instead.'}), 500
```

### 3.2 Frontend Implementation

Create `client/src/components/analyze/FileUpload.tsx`:

```tsx
import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUpload({ onTextExtracted, disabled }: FileUploadProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(extension || '')) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse file');
      }

      onTextExtracted(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  }, [onTextExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="text-sm text-gray-600">Extracting text...</span>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">{fileName}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setFileName(null); }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <span className="text-blue-600 font-medium">Upload a file</span>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <span className="text-xs text-gray-400">PDF or DOCX up to 5MB</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
```

---

## Phase 4: Integration

### 4.1 Update Analyze Page

Integrate file upload into the analyze page alongside text input:

```tsx
// In Analyze.tsx
import { FileUpload } from '../components/analyze/FileUpload';

// Add toggle between paste and upload
const [inputMethod, setInputMethod] = useState<'paste' | 'upload'>('paste');

// In JSX
<div className="flex gap-2 mb-4">
  <button
    onClick={() => setInputMethod('paste')}
    className={`px-4 py-2 rounded ${inputMethod === 'paste' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
  >
    Paste Text
  </button>
  <button
    onClick={() => setInputMethod('upload')}
    className={`px-4 py-2 rounded ${inputMethod === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
  >
    Upload File
  </button>
</div>

{inputMethod === 'upload' ? (
  <FileUpload onTextExtracted={(text) => setResumeText(text)} />
) : (
  <ValidatedTextArea ... />
)}
```

### 4.2 Update API Client

Add analysis history saving:

```typescript
// client/src/lib/api.ts
export async function saveAnalysis(
  userId: string,
  resumeText: string,
  jobDescription: string,
  result: AnalysisResult
) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('analyses')
    .insert({
      user_id: userId,
      resume_text: resumeText,
      job_description: jobDescription,
      score: result.score,
      result_json: result,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save analysis:', error);
    return null;
  }

  return data;
}

export async function getAnalysisHistory(userId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }

  return data;
}
```

---

## Implementation Checklist

### Database
- [ ] Create migration file
- [ ] Run migration in Supabase
- [ ] Test RLS policies
- [ ] Generate TypeScript types

### OAuth
- [ ] Configure Google OAuth in Google Console
- [ ] Configure LinkedIn OAuth in LinkedIn Portal
- [ ] Enable providers in Supabase Dashboard
- [ ] Update supabaseClient.ts with OAuth helpers
- [ ] Add social login buttons to Login/Signup pages
- [ ] Test OAuth flows

### File Upload
- [ ] Install backend dependencies (pdfplumber, python-docx)
- [ ] Create file_parser.py module
- [ ] Add /api/parse-resume endpoint
- [ ] Create FileUpload component
- [ ] Integrate into Analyze page
- [ ] Add i18n translations
- [ ] Test with various PDF/DOCX files

### Integration
- [ ] Update Analyze page with file upload toggle
- [ ] Add analysis history saving
- [ ] Create history page/dashboard
- [ ] Update navigation with history link
- [ ] Test full flow end-to-end

---

## Environment Variables to Add

**Frontend (.env):**
```bash
# Already have these
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

**Backend (.env):**
```bash
# Already have these
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

No new env vars needed - OAuth is configured in Supabase Dashboard.

---

_Last Updated: January 2026_
