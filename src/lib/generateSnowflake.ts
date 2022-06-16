import { generateSunflake } from 'sunflake'

const generateSnowflake = generateSunflake({
  machineId: Math.floor(Math.random() * 1e10),
  epoch: Math.floor(Date.now() / 1000)
})

export default generateSnowflake
