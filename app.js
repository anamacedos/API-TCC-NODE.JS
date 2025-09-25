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
        let idUnidade = request.params.idUnidade
        //recebe os dados do jogo encaminhado do body da requisição
        let dadosBody = request.body 

        let resultUnidade = await controllerUnidades.atualizarUnidadeDeSaude(dadosBody, idUnidade, contentType)

        response.status(resultUnidade.status_code)
        response.json(resultUnidade)
})


app.listen(8080, function(){
    console.log('API aguardando requisições')
})