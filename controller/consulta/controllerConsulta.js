/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD das consultas
 * Data: 24/11/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
 const MESSAGE = require('../../modulo/config.js')
 const consultaDAO = require('../../model/DAO/consulta.js')
 const { param } = require('express/lib/application')

//Função para inserir uma unidade de saúde
const inserirConsulta = async function (consulta, contentType) {
    try {
        if(contentType == 'application/json'){
            let resultConsulta = await consultaDAO.inserirConsulta(consulta)
                if(resultConsulta)
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

module.exports = {
    inserirConsulta
}