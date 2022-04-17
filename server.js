const { app } = require('./app')

// Utils
const { db } = require('./util/database')
const { initModels } = require('./util/initModels')

// Database authenticated
db.authenticate()
	.then(() => console.log('Database authenticated'))
	.catch(err => console.log(err))

// Init relations
initModels()

// Database synced with models' relations
db.sync()
	.then(() => console.log('Database synced'))
	.catch(err => console.log(err))

// Spin up server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
	console.log(`Express app running on port: ${PORT}`)
})
