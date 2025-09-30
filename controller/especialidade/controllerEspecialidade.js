/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD das especialidades
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
 const MESSAGE = require('../../modulo/config.js')
 const especialidadeDAO = require('../../model/DAO/especialidade.js')

 //Função para listar todas as especialidades
const listarEspecialidades = async function(){
    try {
        let dadosEspecialidades = {}
        let resultEspecialidades = await especialidadeDAO.selecionarTodasEspecialidades()


        if(resultEspecialidades != false){
            if(resultEspecialidades.length > 0 || typeof(resultEspecialidades == 'object')){

                //definindo os dados do objeto json que será retornado
                dadosEspecialidades.status = true
                dadosEspecialidades.status_code = 200
                dadosEspecialidades.item = resultEspecialidades.length
                dadosEspecialidades.especialidades = resultEspecialidades

                return dadosEspecialidades

    
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


module.exports = {
    listarEspecialidades
}