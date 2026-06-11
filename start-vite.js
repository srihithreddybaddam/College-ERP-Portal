import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

(async () => {
  try {
    const server = await createServer({
      configFile: false,
      cacheDir: './.vite-cache',
      plugins: [react()],
      server: {
        port: 5173,
      }
    });
    await server.listen();
    server.printUrls();
    console.log('Vite server started successfully!');
  } catch (err) {
    console.error('Failed to start Vite server:', err);
  }
})();
