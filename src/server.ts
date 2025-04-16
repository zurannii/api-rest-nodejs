import fastify from "fastify";

const app = fastify()

//GET, POST, PUT, PATCH, DELETE

//http://localhost:3000/hello

app.get('/hello', () => {
    return 'Hello World!'
}) 

app.listen ({
    port: 3333,
}).then(() => {
    console.log('HTTP server running!')
})