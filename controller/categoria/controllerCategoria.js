/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD de categoria
 * Data: 25/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
const MESSAGE = require('../../modulo/config.js')
const categoriaDAO = require('../../model/DAO/categoria.js')

//função para inserir uma categoria
const inserirCategoria= async function(categoria, contentType) {
    try {
        if(contentType == 'application/json'){
            let resultCategoria = await categoriaDAO.inserirCategoria(categoria)
            if(resultCategoria)
                return MESSAGE.SUCESS_CREATED_ITEM
            else
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


//função para selecionar todas as categorias
const listarCategorias = async function(){
    try {
        let dadosCategorias = {}
        let resultCategorias = await categoriaDAO.selecionarTodasCategorias()


        if(resultCategorias != false){
            if(resultCategorias.length > 0 || typeof(resultCategorias == 'object')){

                //definindo os dados do objeto json que será retornado
                dadosCategorias.status = true
                dadosCategorias.status_code = 200
                dadosCategorias.item = resultCategorias.length
                dadosCategorias.categorias = resultCategorias

                return dadosCategorias

    
            }else{
                return MESSAGE.ERROR_NOT_FOUND
            } 
        }else{
            
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL

            
        }
    } catch (error) {
        console.log(error);
        
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
        
    }
}

//função para listar uma categoria pelo seu id
const listarCategoriaPeloId = async function(idCategoria){
    try {
        if(idCategoria == '' || idCategoria == undefined || idCategoria == null || isNaN(idCategoria) || idCategoria<=0){
            
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

module.exports = {
    inserirCategoria,
    listarCategorias,
    listarCategoriaPeloId
}