import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return{
    plugins: [
      vue(),
      
    ],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ]
    },
    base: env.VITE_PRIVATE_BASE_URL,
    server: {
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_PRIVATE_API_URL,
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     },
    //   },
      proxy: {
        "/api": {
          // target: "http://localhost/vue3-1/moi-app/server",
          // target: "https://www.controldata.co.th/mpsicc/moi-app/server",
          target: env.VITE_PRIVATE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build:{
      sourcemap: false,
      cssCodeSplit:true,
      chunkSizeWarningLimit:500,
      rollupOptions:{
        output:{
          manualChunks(id){
            if(id.includes('node_modules')){
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/'): []
            const fileName =facadeModuleId[facadeModuleId.length - 2] || '[name]'
            return `js/${fileName}/[name].[hash].js`
          }
        }
      }
    }
  }
  
})
