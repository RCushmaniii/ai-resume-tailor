/**
 * Login Page
 *
 * Uses Clerk's pre-built SignIn component for authentication.
 * Supports OAuth (Google, LinkedIn) and email/password login.
 *
 * File: client/src/pages/LoginPage.tsx
 */

import type { ReactElement } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { SEO } from '@/components/SEO';

export function LoginPage(): ReactElement {
  return (
    <>
      <SEO
        title="Log In - AI Resume Tailor"
        description="Sign in to AI Resume Tailor to access your resume analysis history, saved reports, and premium features."
        path="/login"
      />
      <div className="min-h-[60vh] flex items-center justify-center py-12">
      <SignIn
        routing="hash"
        signUpUrl="/signup"
        forceRedirectUrl="/analyze"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-none border border-gray-200',
          },
        }}
      />
    </div>
    </>
  );
}

export default LoginPage;
