import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp';
import path from 'path'
// import fs from 'fs'
// import lessToJS from 'less-vars-to-js'

// const themeVariables = lessToJS(
//   fs.readFileSync(path.resolve(__dirname, './config/variables.less'), 'utf8')
// )

// https://vitejs.dev/config/
export default defineConfig({
  base: '/flow-front',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/lib/${name}/style/index.less`,
        },
      ],
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // 重写less变量,定制样式
        // modifyVars: themeVariables
      }
    }
  },
})
