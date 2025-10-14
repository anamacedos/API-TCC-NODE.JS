/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD das relações entre unidade de saúde e suas respectivas especialidades
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
 const MESSAGE = require('../../modulo/config.js')
 const unidadeEspecialidadeDAO = require('../../model/DAO/unidadeEspecialidade.js')
const res = require('express/lib/response')

 //Função para listar todas as especialidades de uma unidade pelo seu id
const listarEspecialidadePeloIdUnidade = async function(idUnidade){
    try {
        if(idUnidade == '' || idUnidade == undefined || idUnidade == null || isNaN(idUnidade) || idUnidade<=0){
            
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else{
            let dadosEspecialidade = {}
            let resulEspecialidades = await unidadeEspecialidadeDAO.selecionarTodasEspecialidadesDaUnidade(parseInt(idUnidade))

            if (resulEspecialidades != false){
                if(resulEspecialidades.length > 0 || typeof(resulEspecialidades) == 'object'){
                    //cria um objeto do tipo json para retornar a lista de jogos (o jogo)

                    dadosEspecialidade.status = true
                    dadosEspecialidade.status_code = 200
                    dadosEspecialidade.especialidades = resulEspecialidades

                    return dadosEspecialidade
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


// função de chamada da procedure
const listarTempoDeEspera = async function(parametros){
    try {
        if(parametros.idUnidade == '' || parametros.idUnidade == undefined || parametros.idUnidade == null || isNaN(parametros.idUnidade) || parametros.idUnidade<=0){

            console.log(`id da controller Unidade especialidade ${parametros}`);
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else{
            if(parametros.idEspecialidade == '' || parametros.idEspecialidade == undefined || parametros.idEspecialidade == null || isNaN(parametros.idEspecialidade) || parametros.idEspecialidade<=0){
                parametros.idEspecialidade = null
                let dados = {}
                let result = await unidadeEspecialidadeDAO.listarTempoDeEspera(parametros)

                if (result != false){
                    if(result.length > 0 || typeof(result) == 'object'){
                        dados.status = true
                        dados.status_code = 200
                        dados.tempo = result

                        return dados
                    }else{
                        MESSAGE.ERROR_NOT_FOUND
                    }
                }else{
                    MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            }else{
                let dados = {}
                let result = await unidadeEspecialidadeDAO.listarTempoDeEspera(parametros)

                if (result != false){
                    if(result.length > 0 || typeof(result) == 'object'){
                        dados.status = true
                        dados.status_code = 200
                        dados.tempo = result

                        return dados
                    }else{
                        MESSAGE.ERROR_NOT_FOUND
                    }
                }else{
                    MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        }
    } catch (error) {
        
    }
}

module.exports = {
    listarEspecialidadePeloIdUnidade,
    listarTempoDeEspera
}