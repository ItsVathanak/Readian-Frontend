/**
 * Validates that all required environment variables are set
 * Call this at app startup to fail fast if configuration is missing
 */

export const validateEnvironment = () => {
  const errors = [];

  // Check API URL
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiUrl) {
    errors.push('VITE_API_BASE_URL is not set');
  } else {
    console.log('✅ API URL configured:', apiUrl);
  }

  // Validate URL format
  if (apiUrl && !apiUrl.startsWith('http')) {
    errors.push('VITE_API_BASE_URL must start with http:// or https://');
  }

  // Check if in development mode
  const isDev = import.meta.env.DEV;
  console.log(`🔧 Environment: ${isDev ? 'Development' : 'Production'}`);

  // Report errors
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));

    if (!isDev) {
      throw new Error('Environment validation failed. Check console for details.');
    }
  } else {
    console.log('✅ Environment validation passed');
  }

  return errors.length === 0;
};

// Configuration summary for debugging
export const printConfig = () => {
  console.log('\n📋 Configuration Summary:');
  console.log('  API URL:', import.meta.env.VITE_API_BASE_URL || 'Not set (using default)');
  console.log('  Mode:', import.meta.env.MODE);
  console.log('  Dev:', import.meta.env.DEV);
  console.log('  Prod:', import.meta.env.PROD);
  console.log('');
};

