import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dyad.imagegenerator',
  appName: 'AI Image Generator',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;