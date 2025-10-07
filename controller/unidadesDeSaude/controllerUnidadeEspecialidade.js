/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD das relações entre unidade de saúde e suas respectivas especialidades
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
 const MESSAGE = require('../../modulo/config.js')
 const unidadeEspecialidadeDAO = require('../../model/DAO/unidadeEspecialidade.js')

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

module.exports = {
    listarEspecialidadePeloIdUnidade
}