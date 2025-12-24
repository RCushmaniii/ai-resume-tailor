import { useState, useContext, type ReactNode } from 'react';
import { SignInPromptContext } from './SignInPromptContextBase';

export function SignInPromptProvider({ children }: { children: ReactNode }) {
  const [showSignIn, setShowSignIn] = useState(false);

  const promptSignIn = () => setShowSignIn(true);
  const dismissSignIn = () => setShowSignIn(false);

  return (
    <SignInPromptContext.Provider value={{ showSignIn, promptSignIn, dismissSignIn }}>
      {children}
    </SignInPromptContext.Provider>
  );
}

export function useSignInPrompt() {
  const context = useContext(SignInPromptContext);
  if (!context) {
    throw new Error('useSignInPrompt must be used within SignInPromptProvider');
  }
  return context;
}
