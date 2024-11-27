"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: number
  color?: string
  message?: string
}

export function LoadingSpinner({ 
  size = 48, 
  color = "currentColor",
  message = "Generating your tattoo..."
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center w-full min-h-[400px] bg-muted/10 rounded-lg">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {message && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              {message}
            </p>
          </div>
        )}
        <svg
          className="animate-spin"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
      </motion.div>
    </div>
  )
}
