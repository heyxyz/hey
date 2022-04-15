const consoleLog = (title: string, color: string, message: string): void => {
  console.log(`%c[${title}]`, `color: ${color}; font-weight: bolder;`, message)
}

export default consoleLog
