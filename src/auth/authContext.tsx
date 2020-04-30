import * as React from "react";
import { AuthErrorPage } from "./authErrorPage";
import { AuthPendingPage } from "./authPendingPage";
import { useLocalStorage } from "../useLocalStorage";

interface AuthProviderProps {
  useAuthFlow: AuthFlow;
  children: React.ReactNode;
}

export type AuthError = {
  errorCode: string;
  errorMessage: string;
};

interface AuthState {
  accessToken?: string;
  error?: AuthError;
  renewToken: (() => Promise<string>) | undefined;
}

const AuthContext = React.createContext<AuthState | undefined>(undefined);

export type AuthFlow = (
  accessToken: string | undefined,
  setAccessToken: (accessToken?: string) => void,
  setError: (error?: AuthError) => void
) => {
  renewToken: (() => Promise<string>) | undefined;
};

export function AuthProvider({ children, useAuthFlow }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>(
    "oauth-token",
    undefined
  );
  const [error, setError] = React.useState<AuthError | undefined>(undefined);

  function Content() {
    if (accessToken) return <>{children}</>;
    if (error) return <AuthErrorPage error={error} />;
    return <AuthPendingPage />;
  }

  const { renewToken } = useAuthFlow(accessToken, setAccessToken, setError);
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        error,
        renewToken,
      }}
    >
      {error || (accessToken && renewToken && <Content />)}
    </AuthContext.Provider>
  );
}

export function useAuthentication(): {accessToken:string, renewToken:() => Promise<string>} {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within a AuthProvider");
  }
  if (!context.accessToken) {
    throw new Error("error authenticating");
  }
  if (!context.renewToken) {
    throw new Error("error setting up token renewal");
  }
  return {accessToken:context?.accessToken, renewToken:context?.renewToken};
}
