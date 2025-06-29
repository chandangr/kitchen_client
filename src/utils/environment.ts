// Environment configuration utility
export const getEnvironmentType = (): 'local' | 'production' => {
  // Check if we're in development mode (Vite sets this)
  if (import.meta.env.DEV) {
    return 'local';
  }
  
  // Check for production environment variables
  if (import.meta.env.PROD) {
    return 'production';
  }
  
  // Default to local for safety
  return 'local';
};

export const getWebsiteUrl = (userId: string): string => {
  const envType = getEnvironmentType();
  
  if (envType === 'local') {
    return `http://localhost:3000/${userId}/website`;
  }
    return `https://cloud-kitchen-git-main-chandans-projects-68118807.vercel.app/${userId}/website`;
}; 