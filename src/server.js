import app from './app'

const port = process.env.PORT
app.listen(port,()=>{
    console.log('server started,', port)
})

export default app