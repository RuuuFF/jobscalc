// Requere o package express que contém uma função e a atribui
// para a constante express (express agora é uma função)
const express = require("express")
// Atribui a server o que for executado pela função express()
const server = express()
// Importa as rotas
const routes = require('./routes')

const path = require("path")

// Usando template engine
server.set('view engine', 'ejs')

// Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

// Passa para o server o que ele irá usar
// Habilitar arquivos estáticos
server.use(express.static("public"))

// Utilizar o req.body
server.use(express.urlencoded({ extended: true }))

// Rotas
server.use(routes)

server.listen(3000, () => console.log("rodando"))