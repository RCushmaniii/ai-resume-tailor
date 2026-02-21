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

export function SignupPage(): ReactElement {
  return (
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
  );
}

export default SignupPage;
