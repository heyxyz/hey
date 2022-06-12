import { generateSunflake } from 'sunflake'

const generateSnowflake = (): string => {
  const SnowflakeGen = generateSunflake({
    machineId: Math.floor(Math.random() * 1e10),
    epoch: Math.floor(Date.now() / 1000)
  })

  return SnowflakeGen()
}

export default generateSnowflake
