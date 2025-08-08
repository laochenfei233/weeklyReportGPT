import { validateAPIKey } from './apiConfig';

export interface EnvCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function checkEnvironment(): EnvCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  const useUserKey = process.env.NEXT_PUBLIC_USE_USER_KEY === "true";
  
  if (!useUserKey) {
    if (!process.env.OPENAI_API_KEY) {
      errors.push("OPENAI_API_KEY is required when NEXT_PUBLIC_USE_USER_KEY is false");
    } else {
      const baseURL = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!validateAPIKey(apiKey, baseURL)) {
        warnings.push("OPENAI_API_KEY format may be invalid for the selected API provider");
      }
    }
  }

  // Check optional but recommended variables
  if (!process.env.OPENAI_API_BASE) {
    warnings.push("OPENAI_API_BASE not set, using default OpenAI endpoint");
  }

  if (!process.env.OPENAI_MODEL) {
    warnings.push("OPENAI_MODEL not set, using default model");
  }

  const timeout = process.env.REQUEST_TIMEOUT;
  if (timeout && (isNaN(Number(timeout)) || Number(timeout) < 1000)) {
    warnings.push("REQUEST_TIMEOUT should be a number >= 1000 (milliseconds)");
  }

  const maxTokens = process.env.MAX_TOKENS;
  if (maxTokens && (isNaN(Number(maxTokens)) || Number(maxTokens) < 100)) {
    warnings.push("MAX_TOKENS should be a number >= 100");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function logEnvironmentStatus(): void {
  const result = checkEnvironment();
  
  if (result.isValid) {
    console.log("✅ Environment configuration is valid");
  } else {
    console.log("❌ Environment configuration has errors:");
    result.errors.forEach(error => console.log(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log("⚠️  Environment warnings:");
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
}