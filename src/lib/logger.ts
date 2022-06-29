const Logger = {
  log: (...args: any) => {
    console.log(...args)
  },

  error: (...args: any) => {
    console.error(...args)
  }
}

export default Logger
