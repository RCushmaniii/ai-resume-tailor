import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';

export function useAuth() {
  const { user, isLoaded } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const clerk = useClerk();

  return {
    enabled: true,
    loading: !isLoaded,
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          user_metadata: {
            full_name: user.fullName,
            avatar_url: user.imageUrl,
          },
        }
      : null,
    getToken,
    signOut,
    clerk,
  };
}
