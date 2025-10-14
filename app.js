/*****************************************************************************************************
 * Objetivo: API referente ao projeto de painel de acesso a sa´de TCC
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 * Observacao: 
 ****** Para configurar e instalar a API precisamos das seguintes bibliotecas:
        Express             npm install express --save
        Cors                npm install cors --save
        body-parser         npm install body-parser --save
****** Para configurar e instalar o acesso ao banco de dados precisamos:
        prisma              npm install prisma --save -> faz a conexao com o banco
        prisma/client       npm install @prisma/client --save -> Executa Scripts no Banco
****** Após a instalação do prisma e prisma client, devemos:
        npx prisma init (inicializar o prisma no projeto  )
****** Para realizar o sincronismo do prisma com o banco de dados, devemos executar o seguinte comando:
        npx prisma migrate dev 
        
        npx prisma generate
 ******************************************************************************************************/

//Import das bibliotecas para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require ('body-parser')

//estaelecendo o formato de dados que deverá chegar no body da requisição (post ou put)
const bodyParserJSON = bodyParser.json()

//cria o objeto app para criar a API
const app = express()

//configurações do cors
app.use((request, response, next) => {
        response.header('Acess-Control_Alow-Origin', '*')
        response.header('Acess-Control_Alow-Origin', 'GET, POST, PUT, DELETE, OPITIONS')

        app.use(cors())
        next()
})


const controllerUnidades = require("./controller/unidadesDeSaude/controllerUnidadesDeSaude")
const controllerLocal = require("./controller/local/controllerLocal.js")
const controllerCategoria = require("./controller/categoria/controllerCategoria.js")
const controllerEspecialidade = require("./controller/especialidade/controllerEspecialidade.js")
const controllerEspecialidadeUnidade = require("./controller/unidadesDeSaude/controllerUnidadeEspecialidade")



/*****************************************************************
 * TABELA DE UNIDADES DE SAÚDE
 *****************************************************************/


//endpoint para inserir uma nova unidade de saúde
app.post('/v1/pas/unidades', cors(), bodyParserJSON, async function(request, response){

    //console.log(request.headers) //printa o cabeçalho (header), com as informações da requisição, como quem pediu e também o formato da requisição (content-type)

    //recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //recebe o conteudos do body da requisição
    let dadosBody = request.body

    //Ecaminhando os dados da requisição para controller inserir no BD
    let resultUnidades = await controllerUnidades.inserirUnidadeDeSaude(dadosBody, contentType)

    response.status(resultUnidades.status_code)
    response.json(resultUnidades)


})


//endpoint para retornar uma lista de unidades de saúde
app.get('/v1/pas/unidades', cors(), async function(request, response){
    //chama a função para listar os jogos
    let resultUnidades = await controllerUnidades.listarUnidadesDeSaude()

    response.status(resultUnidades.status_code)
    response.json(resultUnidades)

})

//endpoint para listar uma unidade com base no seu id
app.get('/v1/pas/unidades/:id', cors(), async function(request, response){
        //recebe o id do jogo na requisição
        let idUnidade = request.params.id
        let resultUnidade = await controllerUnidades.listarUnidadePeloId(idUnidade)

        response.status(resultUnidade.status_code)
        response.json(resultUnidade)
})


//endpoint para atualizar uma unidade de saúde pelo id
app.put('/v1/pas/unidades/:id', cors(), bodyParserJSON, async function(request, response){ //post e put é necessario o bodyparserJson, pois sao os 2 verbos que chegam dados pelo corpo

        //recebe o content type da requisição
        let contentType = request.headers['content-type']
        //recebe o id do jogo
        let idUnidade = request.params.id
        //recebe os dados do jogo encaminhado do body da requisição
        let dadosBody = request.body 

        let resultUnidade = await controllerUnidades.atualizarUnidadeDeSaude(dadosBody, idUnidade, contentType)

        response.status(resultUnidade.status_code)
        response.json(resultUnidade)
})



// endpoint para filtrar unidades com ou sem parametros
app.post('/v1/pas/unidades/filtrar', cors(), bodyParserJSON, async function(request, response) {
        try {
            let { especialidade, categoria, disponibilidade } = request.body
    
            let result = await controllerUnidades.filtrarUnidadeDeSaude(
                Number(especialidade) || 0,
                Number(categoria) || 0,
                disponibilidade === undefined ? null : disponibilidade
            )
    
            response.status(result.status_code)
            response.json(result)
    
        } catch (error) {
            console.error(error)
            response.status(500).json({ status: false, message: 'Erro interno no servidor.' })
        }
    })


//endpoint para pesquisar pelo nome
app.get('/v1/pas/pesquisa/:nome', cors(), async function(request, response){
        //recebe o id do jogo na requisição
        let nomeDigitado = request.params.nome
        let resultUnidade = await controllerUnidades.pesquisarUnidadePeloNome(nomeDigitado)

        response.status(resultUnidade.status_code)
        response.json(resultUnidade)
})


/*****************************************************************
 * TABELA DE LOCAL
 *****************************************************************/

//ENDPOINT PARA INSERIR UM LOCAL
app.post('/v1/pas/local', cors(), bodyParserJSON, async function(request, response) {
        let contentType = request.headers['content-type']

        let dadosBody = request.body

        let resultLocal = await controllerLocal.inserirLocal(dadosBody, contentType)

        response.status(resultLocal.status_code)
        response.json(resultLocal)
        
})


//endpoint para listar local com base no seu id
app.get('/v1/pas/local/:id', cors(), async function(request, response){
        //recebe o id do jogo na requisição
        let idLocal = request.params.id
        let resultLocal = await controllerLocal.listarLocalPeloId(idLocal)

        response.status(resultLocal.status_code)
        response.json(resultLocal)
})


//endpoint para retornar uma lista de locais
app.get('/v1/pas/local', cors(), async function(request, response){
        //chama a função para listar os jogos
        let resultLocais = await controllerLocal.listarLocais()
    
        response.status(resultLocais.status_code)
        response.json(resultLocais)
    
    })


    /*****************************************************************
 * TABELA DE CATEGORIA
 *****************************************************************/

 //ENDPOINT PARA INSERIR UMA CATEGORIA
app.post('/v1/pas/categoria', cors(), bodyParserJSON, async function(request, response) {
        let contentType = request.headers['content-type']

        let dadosBody = request.body

        let resultCategoria = await controllerCategoria.inserirCategoria(dadosBody, contentType)

        response.status(resultCategoria.status_code)
        response.json(resultCategoria)
        
})



//endpoint para listar todas as categorias
app.get('/v1/pas/categoria', cors(), async function(request, response){
        //chama a função para listar os jogos
        let resultCategorias = await controllerCategoria.listarCategorias()
    
        response.status(resultCategorias.status_code)
        response.json(resultCategorias)
    
})

//endpoint para listar uma categoria com base no seu id
app.get('/v1/pas/categoria/:id', cors(), async function(request, response){
        //recebe o id do jogo na requisição
        let idCategoria = request.params.id
        let resultCategoria = await controllerCategoria.listarCategoriaPeloId(idCategoria)

        response.status(resultCategoria.status_code)
        response.json(resultCategoria)
})

//endpoint de filtros
// app.get('/v1/pas/categoria/:id', cors(), async function(request, response){
//         //recebe o id do jogo na requisição
//         let idCategoria = request.params.id
//         let resultCategoria = await controllerCategoria.listarCategoriaPeloId(idCategoria)

//         response.status(resultCategoria.status_code)
//         response.json(resultCategoria)
// })


/*****************************************************************
 * TABELA DE ESPECIALIDADE
 *****************************************************************/


    //endpoint para retornar uma lista de especialidades
app.get('/v1/pas/especialidade', cors(), async function(request, response){
        //chama a função para listar os jogos
        let resultEspecialidades = await controllerEspecialidade.listarEspecialidades()
    
        response.status(resultEspecialidades.status_code)
        response.json(resultEspecialidades)
    
    })


    //endpoint para listar as especialidades de uma unidade com base no id 
app.get('/v1/pas/especialidade/:id', cors(), async function(request, response){
        //recebe o id do jogo na requisição
        let idUnidade = request.params.id
        let resultEspecialidades = await controllerEspecialidadeUnidade.listarEspecialidadePeloIdUnidade(idUnidade)

        response.status(resultEspecialidades.status_code)
        response.json(resultEspecialidades)
})

/*****************************************************************
 * TABELA RELACIONAMENTO DE ESPECIALIDADE E CATEGORIA
 *****************************************************************/


//END POINT PARA RETORNAR O TEMPO DE ESPERA BASEADO NO ID DA UNIDADE E DA ESPECIALIDADE
app.post('/v1/pas/tempo', cors(), bodyParserJSON, async function(request, response) {
        let contentType = request.headers['content-type']

        let dadosBody = request.body

        let resultTempoDeEspera = await controllerEspecialidadeUnidade.listarTempoDeEspera(dadosBody, contentType)

        response.status(resultTempoDeEspera.status_code)
        response.json(resultTempoDeEspera)
        
})
    

app.listen(8080, function(){
    console.log('API aguardando requisições')
})
