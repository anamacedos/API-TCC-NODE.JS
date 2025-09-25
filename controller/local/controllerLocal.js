/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD de locais
 * Data: 25/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
const MESSAGE = require('../../modulo/config.js')
const localDAO = require('../../model/DAO/local.js')

//Função para inserir um local
const inserirLocal = async function(local, contentType) {
    try {
        if(contentType == 'application/json'){
            let resultLocal = await localDAO.inserirLocal(local)
            if(resultLocal)
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

//Função para listar todos locais
const listarLocais = async function(){
    try {
        let dadosLocais = {}
        let resultLocais = await localDAO.selecionarTodosLocais()


        if(resultLocais != false){
            if(resultLocais.length > 0 || typeof(resultLocais == 'object')){

                //definindo os dados do objeto json que será retornado
                dadosLocais.status = true
                dadosLocais.status_code = 200
                dadosLocais.item = resultLocais.length
                dadosLocais.locais = resultLocais

                return dadosLocais

    
            }else{
                return MESSAGE.ERROR_NOT_FOUND
            } 
        }else{
            
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL

            
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
        
    }
}


//Função para listar um local através do seu id
const listarLocalPeloId = async function(idLocal){
    try {
        if(idLocal == '' || idLocal == undefined || idLocal == null || isNaN(idLocal) || idLocal<=0){
            
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else{
            let dadosLocal = {}
            let resultLocal = await localDAO.listarLocalPeloId(parseInt(idLocal))

            if (resultLocal != false){
                if(resultLocal.length > 0 || typeof(resultLocal) == 'object'){
                    //cria um objeto do tipo json para retornar a lista de jogos (o jogo)

                    dadosLocal.status = true
                    dadosLocal.status_code = 200
                    dadosLocal.endereco = resultLocal

                    return dadosLocal
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
    inserirLocal,
    listarLocalPeloId,
    listarLocais
}