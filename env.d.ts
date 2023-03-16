/// <reference types="vite/client" />
declare module 'rollup-plugin-node-builtins'
import { ExternalProvider } from '@ethersproject/providers'

declare global {
  interface Window {
    ethereum?: ExternalProvider
  }
}
