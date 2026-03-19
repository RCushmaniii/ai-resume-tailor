/**
 * Signup Page
 *
 * Uses Clerk's pre-built SignUp component for registration.
 * Supports OAuth (Google, LinkedIn) and email/password signup.
 *
 * File: client/src/pages/SignupPage.tsx
 */

import type { ReactElement } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { SEO } from '@/components/SEO';

export function SignupPage(): ReactElement {
  return (
    <>
      <SEO
        title="Sign Up - AI Resume Tailor"
        description="Create your free AI Resume Tailor account. Get AI-powered resume analysis, ATS optimization, and personalized improvement suggestions."
        path="/signup"
      />
      <div className="min-h-[60vh] flex items-center justify-center py-12">
      <SignUp
        routing="hash"
        signInUrl="/login"
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

export default SignupPage;
