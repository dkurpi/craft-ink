"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {!isSignedIn && (
        <>
          <SignInButton mode="modal">
            <button className="text-sm font-medium hover:text-primary">
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium transition">
              Sign Up
            </button>
          </SignUpButton>
        </>
      )}
      
      {isSignedIn && (
        <div className="w-8 h-8">
          <UserButton/>
        </div>
      )}
    </div>
  );
}
