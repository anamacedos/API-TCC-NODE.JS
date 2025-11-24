/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD das unidades de saúde
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
const MESSAGE = require('../../modulo/config.js')
const unidadeDeSaudeDAO = require('../../model/DAO/unidadesDeSaude.js')
const controllerLocal = require('../local/controllerLocal.js')
const controllerCategoria = require('../categoria/controllerCategoria.js')
const controllerUnidadeEspecialidade = require('../unidadesDeSaude/controllerUnidadeEspecialidade')
const { param } = require('express/lib/application')


//Função para inserir uma unidade de saúde

const inserirUnidadeDeSaude = async function (unidadeDeSaude, contentType) {
    try {
        if(contentType == 'application/json'){
            let resultUnidadeDeSaude = await unidadeDeSaudeDAO.inserirUnidadeDeSaude(unidadeDeSaude)
                if(resultUnidadeDeSaude)
                    return MESSAGE.SUCESS_CREATED_ITEM //201
                else
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
        
    }
}

//função para listar todas as unidades de saúde
//  (essa função faz diversas requisições no banco de dados, o que deixa o tempo de resposta lento,
//  por isso ela não está sendo utilizada mais, e sim a de baixo)
const listarUnidadesDeSaude = async function(){
    try {
        let dadosUnidades = {}
        let resultUnidades = await unidadeDeSaudeDAO.selecionarTodasUnidadesDeSaude()

        if(resultUnidades != false){
            if(resultUnidades.length > 0 || typeof(resultUnidades) == 'object'){

                // Definindo os dados do objeto JSON que será retornado
                dadosUnidades.status = true
                dadosUnidades.status_code = 200
                dadosUnidades.item = resultUnidades.length
                dadosUnidades.unidadesDeSaude = []  

                for (let itemUnidade of resultUnidades){

                    // TEMPO DE ESPERA GERAL DA UNIDADE
                    let parametros = {
                        "idUnidade": itemUnidade.id,
                        "idEspecialidade": null
                    }
                    let tempoGer = await controllerUnidadeEspecialidade.listarTempoDeEspera(parametros)

                    tempoGeral = tempoGer.tempo


                    for (campos of tempoGeral){
                        itemUnidade.tempo_espera_geral = campos.f1
                    }
                    
                    // Local
                    let dadosLocal = await controllerLocal.listarLocalPeloId(itemUnidade.tbl_local_id)
                    itemUnidade.local = dadosLocal
                    delete itemUnidade.tbl_local_id
                    delete itemUnidade.local.status
                    delete itemUnidade.local.status_code

                    // Categoria
                    let dadosCategoria = await controllerCategoria.listarCategoriaPeloId(itemUnidade.tbl_categoria_id)
                    itemUnidade.categoria = dadosCategoria
                    delete itemUnidade.tbl_categoria_id
                    delete itemUnidade.categoria.status
                    delete itemUnidade.categoria.status_code

                    //especialidade
                    let dadosEspecialidade = await controllerUnidadeEspecialidade.listarEspecialidadePeloIdUnidade(itemUnidade.id)
                    itemUnidade.especialidades = dadosEspecialidade

                    // TEMPO DE ESPERA POR ESPECIALIDADE
                    if (dadosEspecialidade.especialidades && dadosEspecialidade.especialidades.length > 0) {

                        for (let especialidade of dadosEspecialidade.especialidades) {

                            let parametros = {
                                "idUnidade": itemUnidade.id,
                                "idEspecialidade": especialidade.id
                            }


                            let tempoEsp = await controllerUnidadeEspecialidade.listarTempoDeEspera(parametros)

                            //console.log(tempoEsp)

                            //console.log("TEMPO ESP: ", tempoEsp)

                            tempoEspera = tempoEsp.tempo

                            //console.log(tempoEsp.tempo);

                            for(campos of tempoEspera){
                                especialidade.tempo_espera = campos.f2
                            }
    
                        }
                    }

                    // Adiciona a unidade no array
                    dadosUnidades.unidadesDeSaude.push(itemUnidade)
                    delete itemUnidade.especialidades.status
                    delete itemUnidade.especialidades.status_code
                }

                return dadosUnidades

            } else {
                return MESSAGE.ERROR_NOT_FOUND
            } 
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//função para listar todas as unidades de saúde PELA VIEW
// const listarUnidadesDeSaudeView = async function(){
//     try {
//         let dadosUnidades = {}
//         let resultUnidades = await unidadeDeSaudeDAO.selecionarTodasUnidadesDeSaudeView()



//         if(resultUnidades != false){
//             if(resultUnidades.length > 0 || typeof(resultUnidades == 'object')){

//                 //definindo os dados do objeto json que será retornado
//                 dadosUnidades.status = true
//                 dadosUnidades.status_code = 200
//                 dadosUnidades.item = resultUnidades.length
//                 dadosUnidades.unidades = resultUnidades

//                 return dadosUnidades

    
//             }else{
//                 return MESSAGE.ERROR_NOT_FOUND
//             } 
//         }else{
            
//             return MESSAGE.ERROR_INTERNAL_SERVER_MODEL

            
//         }
//     } catch (error) {
//         console.log(error);
        
//         return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
        
//     }
// }

//função para listar todas as unidades de saúde PELA VIEW (através de uma view retorna todos os tempos de espera sem precisar de tantas requisições como a outra função)
const listarUnidadesDeSaudeView = async function() {
    try {
        let dadosUnidades = {}
        let resultUnidades = await unidadeDeSaudeDAO.selecionarTodasUnidadesDeSaudeView();

        if (resultUnidades && resultUnidades.length > 0) {

            // objeto temporário para agrupar unidades
            const unidadesMap = {}

            resultUnidades.forEach(row => {
                const idUnidade = row.id_unidade

                // se ainda não existe essa unidade no map, cria ela
                if (!unidadesMap[idUnidade]) {
                    unidadesMap[idUnidade] = {
                        id: row.id_unidade,
                        nome: row.nome_unidade,
                        telefone: row.telefone,
                        disponibilidade_24h: row.disponibilidade_24h,
                        foto: row.foto_unidade,
                        tempo_espera_geral: row.tempo_espera_geral,
                        local: {
                            endereco: [
                                {
                                    id: row.id_local,
                                    cep: row.cep,
                                    logradouro: row.logradouro,
                                    bairro: row.bairro,
                                    cidade: row.cidade,
                                    estado: row.estado,
                                    regiao: row.regiao,
                                    latitude: row.latitude,
                                    longitude: row.longitude
                                }
                            ]
                        },
                        categoria: {
                            categoria: [
                                {
                                    id: row.id_categoria,
                                    nome: row.nome_categoria,
                                    foto_claro: row.categoria_foto_claro,
                                    foto_escuro: row.categoria_foto_escuro
                                }
                            ]
                        },
                        especialidades: {
                            especialidades: []
                        }
                    }
                }

                // adiciona a especialidade atual ao array da unidade
                unidadesMap[idUnidade].especialidades.especialidades.push({
                    id: row.id_especialidade,
                    nome: row.nome_especialidade,
                    foto_claro: row.especialidade_foto_claro,
                    foto_escuro: row.especialidade_foto_escuro,
                    tempo_espera: row.tempo_espera_especialidade
                })
            })

            // transforma o map em um array
            const unidadesArray = Object.values(unidadesMap)

            // monta o objeto final no padrão solicitado
            dadosUnidades.status = true
            dadosUnidades.status_code = 200
            dadosUnidades.item = unidadesArray.length
            dadosUnidades.unidadesDeSaude = unidadesArray

            return dadosUnidades

        } else {
            return MESSAGE.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.error(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}




//função para listar uma unidade de saúde com base no seu id
const listarUnidadePeloId = async function(id) {
    try {
        if (id == "" || id == undefined || id == null || isNaN(id) || id <= 0) {
            return MESSAGE.ERROR_REQUIRED_FIELDS
        } else {
            const arrayUnidades = []
            let dadosUnidade = {}
            let resultUnidade = await unidadeDeSaudeDAO.listarUnidadePeloId(parseInt(id))

            if (resultUnidade != false) {
                if (resultUnidade.length > 0 || typeof(resultUnidade) == 'object') {
                    
                    for (itemUnidade of resultUnidade) {

                        //TEMPO DE ESPERA GERAL DA UNIDADE
                        let parametros = {
                            "idUnidade": itemUnidade.id,
                            "idEspecialidade": null
                        }
                        let tempoGer = await controllerUnidadeEspecialidade.listarTempoDeEspera(parametros)

                        tempoGeral = tempoGer.tempo


                        for (campos of tempoGeral){
                            itemUnidade.tempo_espera_geral = campos.f1
                        }


                        //LOCAL
                        let dadosLocal = await controllerLocal.listarLocalPeloId(itemUnidade.tbl_local_id)
                        itemUnidade.local = dadosLocal
                        delete itemUnidade.tbl_local_id
                        delete itemUnidade.local.status
                        delete itemUnidade.local.status_code

                        //CATEGORIA
                        let dadosCategoria = await controllerCategoria.listarCategoriaPeloId(itemUnidade.tbl_categoria_id)
                        itemUnidade.categoria = dadosCategoria
                        delete itemUnidade.tbl_categoria_id
                        delete itemUnidade.categoria.status
                        delete itemUnidade.categoria.status_code

                        //ESPECIALIDADES
                        let dadosEspecialidade = await controllerUnidadeEspecialidade.listarEspecialidadePeloIdUnidade(itemUnidade.id)

                        // TEMPO DE ESPERA POR ESPECIALIDADE
                        if (dadosEspecialidade.especialidades && dadosEspecialidade.especialidades.length > 0) {
                            for (let especialidade of dadosEspecialidade.especialidades) {

                                let parametros = {
                                    "idUnidade": itemUnidade.id,
                                    "idEspecialidade": especialidade.id
                                }

                                let tempoEsp = await controllerUnidadeEspecialidade.listarTempoDeEspera(parametros)

                                tempoEspera = tempoEsp.tempo

                                for(campos of tempoEspera){
                                    especialidade.tempo_espera = campos.f2
                                }
        
                            }
                        }

                        itemUnidade.especialidades = dadosEspecialidade
                        delete itemUnidade.especialidades.status
                        delete itemUnidade.especialidades.status_code
                    }

                    dadosUnidade.status = true
                    dadosUnidade.status_code = 200
                    dadosUnidade.unidadeDeSaude = itemUnidade

                    return dadosUnidade
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }

        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//função para retornar uma unidade de saude com base no seu id pela procedure
const listarUnidadePeloIdPro = async function(id) {
    try {
        if (id == "" || id == undefined || id == null || isNaN(id) || id <= 0) {
            return MESSAGE.ERROR_REQUIRED_FIELDS
        } else {
       //     const arrayUnidades = []
            let dadosUnidade = {}
            let resultUnidade = await unidadeDeSaudeDAO.listarUnidadePeloIdPro(parseInt(id))

            if (resultUnidade != false) {
                if (resultUnidade.length > 0 || typeof(resultUnidade) == 'object') {
                    
                    

                    dadosUnidade.status = true
                    dadosUnidade.status_code = 200
                    dadosUnidade.unidadeDeSaude = resultUnidade

                    return dadosUnidade
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }

        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para listar uma unidade específica pela VIEW
const listarUnidadePeloIdView = async function (idUnidade) {
    try {
        // validação do ID
        if (
            idUnidade == '' || idUnidade == undefined || idUnidade == null || isNaN(idUnidade) || idUnidade <= 0
        ) {
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }

        // busca a unidade pelo ID
        let dadosUnidades = {}
        let resultUnidades = await unidadeDeSaudeDAO.listarUnidadePeloIdView(parseInt(idUnidade))

        if (resultUnidades && resultUnidades.length > 0) {

            // objeto temporário para agrupar a unidade
            const unidadesMap = {}

            resultUnidades.forEach(row => {
                const idUnidade = row.id_unidade

                // se ainda não existe essa unidade no map, cria ela
                if (!unidadesMap[idUnidade]) {
                    unidadesMap[idUnidade] = {
                        id: row.id_unidade,
                        nome: row.nome_unidade,
                        telefone: row.telefone,
                        disponibilidade_24h: row.disponibilidade_24h,
                        foto: row.foto_unidade,
                        tempo_espera_geral: row.tempo_espera_geral,
                        local: {
                            endereco: [
                                {
                                    id: row.id_local,
                                    cep: row.cep,
                                    logradouro: row.logradouro,
                                    bairro: row.bairro,
                                    cidade: row.cidade,
                                    estado: row.estado,
                                    regiao: row.regiao,
                                    latitude: row.latitude,
                                    longitude: row.longitude
                                }
                            ]
                        },
                        categoria: {
                            categoria: [
                                {
                                    id: row.id_categoria,
                                    nome: row.nome_categoria,
                                    foto_claro: row.categoria_foto_claro,
                                    foto_escuro: row.categoria_foto_escuro
                                }
                            ]
                        },
                        especialidades: {
                            especialidades: []
                        }
                    }
                }

                // adiciona a especialidade atual ao array da unidade
                unidadesMap[idUnidade].especialidades.especialidades.push({
                    id: row.id_especialidade,
                    nome: row.nome_especialidade,
                    foto_claro: row.especialidade_foto_claro,
                    foto_escuro: row.especialidade_foto_escuro,
                    tempo_espera: row.tempo_espera_especialidade
                })
            })

            // transforma o map em um array (mesmo que só tenha uma unidade)
            const unidadesArray = Object.values(unidadesMap)

            // monta o objeto final no padrão solicitado
            dadosUnidades.status = true
            dadosUnidades.status_code = 200
            dadosUnidades.item = unidadesArray.length
            dadosUnidades.unidadesDeSaude = unidadesArray

            return dadosUnidades

        } else {
            return MESSAGE.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.error(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



//função para atualizar uma unidade de saúde
const atualizarUnidadeDeSaude = async function (unidadeDeSaude, idUnidade, contentType) {
    try {
        if (contentType == 'application/json'){

            //verificar se o id existe no banco
            let resultBusca = await unidadeDeSaudeDAO.listarUnidadePeloId(parseInt(idUnidade))


            if(resultBusca.status_code == 200){
                unidadeDeSaude.id = parseInt(idUnidade)
                let result = await unidadeDeSaudeDAO.atualizarUnidadeDeSaude(unidadeDeSaude)

                if (result)
                    return MESSAGE.SUCESS_CREATED_ITEM
                else 

                    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
            }else if(resultBusca.status_code == 400){
                return MESSAGE.ERROR_NOT_FOUND
            }else{

                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
            }
            
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

//função para listar uma categoria pelo seu id PELA VIEW
const listarCategoriaPeloIdView = async function(idUnidade){
    try {
        if(idUnidade == '' || idUnidade == undefined || idUnidade == null || isNaN(idUnidade) || idUnidade  <=0){
            
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else{
            let dadosCategoria = {}

            let resultCategoria = await categoriaDAO.listarCategoriaPeloId(parseInt(idCategoria))

            if (resultCategoria != false){
                if(resultCategoria.length > 0 || typeof(resultCategoria) == 'object'){
                    //cria um objeto do tipo json para retornar a lista de jogos (o jogo)

                    dadosCategoria.status = true
                    dadosCategoria.status_code = 200
                    dadosCategoria.categoria = resultCategoria

                    return dadosCategoria
                }else{
                    return MESSAGE.ERROR_NOT_FOUND
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//função para retornar baseado nos filtros
const filtrarUnidadeDeSaude = async function (idEspecialidade, idCategoria, disponibilidade) {
    try {
      // Normaliza parâmetros
      idEspecialidade = (!idEspecialidade || isNaN(idEspecialidade)) ? 0 : idEspecialidade
      idCategoria = (!idCategoria || isNaN(idCategoria)) ? 0 : idCategoria
  
      let dadosUnidades = {}
      let resultUnidades = await unidadeDeSaudeDAO.filtrarUnidadeDeSaude(idEspecialidade, idCategoria, disponibilidade)
  
      if (resultUnidades && resultUnidades.length > 0) {
        dadosUnidades.status = true
        dadosUnidades.status_code = 200
        dadosUnidades.unidadesDeSaude = []
  
        for (let itemUnidade of resultUnidades) {
            let unidadeCompleta = await listarUnidadePeloIdView(itemUnidade.id)
            if(unidadeCompleta.status) {
                dadosUnidades.unidadesDeSaude.push(unidadeCompleta.unidadesDeSaude)

            }
        }
        
  
        return dadosUnidades
      } else {
        return MESSAGE.ERROR_NOT_FOUND
      }
  
    } catch (error) {
      console.log(error)
      return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
  }

  // Função para pesquisar unidades pelo nome
const pesquisarUnidadePeloNome = async function(nomeDigitado) {
    try {
        // validação: não pode vir vazio
        if (!nomeDigitado || nomeDigitado.trim() === "") {
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }

        let dadosUnidades = {}
        let resultUnidades = await unidadeDeSaudeDAO.pesquisarNomeUnidade(nomeDigitado)

        if (resultUnidades && resultUnidades.length > 0) {
            dadosUnidades.status = true
            dadosUnidades.status_code = 200
            dadosUnidades.unidadesDeSaude = []

            // reaproveita a função de listar pelo id para montar cada unidade completa
            for (let itemUnidade of resultUnidades) {
                let unidadeCompleta = await listarUnidadePeloIdView(itemUnidade.id)
                
                // como listarUnidadePeloId já devolve {status, status_code, unidadeDeSaude}
                // aqui pegamos apenas a parte "unidadeDeSaude"
                if (unidadeCompleta && unidadeCompleta.unidadesDeSaude) {
                    dadosUnidades.unidadesDeSaude.push(...unidadeCompleta.unidadesDeSaude)
                }
            }

            return dadosUnidades
        } else {
            return MESSAGE.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

  


module.exports = {
    inserirUnidadeDeSaude,
    listarUnidadesDeSaude,
    listarUnidadePeloId,
    atualizarUnidadeDeSaude,
    filtrarUnidadeDeSaude,
    pesquisarUnidadePeloNome,
    listarUnidadePeloIdPro,
    listarUnidadesDeSaudeView,
    listarCategoriaPeloIdView,
    listarUnidadePeloIdView,
    listarCategoriaPeloIdView,
    listarUnidadePeloIdView
}