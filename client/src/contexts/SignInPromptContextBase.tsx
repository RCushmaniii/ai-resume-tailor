import { createContext } from 'react';

interface SignInPromptContextType {
  showSignIn: boolean;
  promptSignIn: () => void;
  dismissSignIn: () => void;
}

export const SignInPromptContext = createContext<SignInPromptContextType | undefined>(undefined);
