// Environment configuration utility
export const getEnvironmentType = (): 'local' | 'production' => {
  // Check if we're in development mode (Vite sets this)
  if (import.meta.env.type === 'production') {
    return 'production';
  }
  
  // Check for production environment variables
  if (import.meta.env.type === 'local') {
    return 'local';
  }
  
  // Default to local for safety
  return 'production';
};

export const getWebsiteUrl = (userId: string): string => {
  const envType = getEnvironmentType();
  
  if (envType === 'local') {
    return `http://localhost:3000/${userId}/website`;
  }
    return `https://cloud-kitchen-git-main-chandans-projects-68118807.vercel.app/${userId}/website`;
};

export const getBackendApiUrl = (): string => {
  const envType = getEnvironmentType();
  if (envType === 'local') {
    return 'http://localhost:4000';
  }
  // Replace with your production backend URL
  return 'https://kitchen-backend-mu.vercel.app';
}; 