import { generateSunflake } from 'sunflake'

const generateSnowflake = generateSunflake({
  machineId: Math.floor(Date.now() / 1000)
})

export default generateSnowflake
