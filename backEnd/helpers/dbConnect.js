const { Pool } = require('pg')

const config = {
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
}
// patron Singleton instance
const Singleton = (() => {
  let instance
  function createInstance() {
    const classObj = new Pool(config)
    return classObj
  }
  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
        console.log(' Nueva conexión a la base de datos establecida')
      } else {
        console.log('Establecida la conexión a la base de datos')
      }
      return instance
    },
  }
})()

module.exports = Singleton
