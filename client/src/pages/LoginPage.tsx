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

export function LoginPage(): ReactElement {
  return (
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
  );
}

export default LoginPage;
