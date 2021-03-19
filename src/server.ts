import express, { request, response } from 'express'
import {categoriesRoutes} from './routes/categories.routes'
import { specificationRoutes } from './routes/specifications.routes'

const app = express()

app.use(express.json())

app.use('/categories', categoriesRoutes)
app.use('/specifications', specificationRoutes)

app.listen(777, () => console.log('Server Ok!'))