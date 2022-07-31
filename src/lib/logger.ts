import { log } from 'next-axiom'

const Logger = {
  log: (...args: any) => {
    console.log(...args)
  },

  warn: (...args: any) => {
    console.warn(...args)
  },

  error: (message: string, error: any) => {
    log.error(message, error)
  }
}

export default Logger
