import logger from './logger'

const handleProcessEvents = () => {
  try {
    process.on('uncaughtException', (error) => {
      logger.error(error)
      console.warn(error)
    })

    process.on('uncaughtException', async (error) => {
      logger.error(error)
      console.warn(error)
    })

    process.on('unhandledRejection', async (error) => {
      logger.error(error)
      console.warn(error)
    })
  } catch (e) {
    const error = e as Error
    throw new Error(`[startup.handleProcessEvents] ${error.message || error}`)
  }
}

const startup = async ({ resolve, reject }: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }) => {
  try {
    handleProcessEvents()
    resolve()
  } catch (e) {
    const error = e as Error
    reject(`[startup] ${error.message || error}`)
  }
}

export default () =>
  new Promise((resolve, reject) => {
    startup({ resolve, reject })
  })
