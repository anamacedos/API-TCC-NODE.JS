/********************************************************************************
 * Objetivo: Arquivo de padronização de mensagem e status code para o projeto
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/


/***************************** MENSAGENS DE ERRO ******************************/
//CAMPOS OBRIGATORIOS
const ERROR_REQUIRED_FIELDS =   {status: false, status_code: 400, message: "Existem campos obrigatórios que não foram preenchidos, ou ultrapassaram a quantidade de caracteres. A requisição não pode ser realizada!!!"}
const ERROR_INTERNAL_SERVER_CONTROLLER = {status: false, status_code: 500, message: "Não foi possível processar a requisção, pois ocorreram eros internos no servidor da controller!"}
const ERROR_INTERNAL_SERVER_MODEL = {status: false, status_code: 500, message: "Não foi possível processar a requisção, pois ocorreram eros internos no servidor da model!"}
const ERROR_CONTENT_TYPE = {status: false, status_code: 415, message: "Não foi possível processar a requisição, pois, o formato de dados encaminhado não é suportado pelo servidor. Favor encaminhar apenas JSON"}
const ERROR_NOT_FOUND = {status: false, status_code: 404, message: 'Não foram encontrados itens para retornar!!'}

/**************************** MENSAGENS DE SUCESSO ****************************/
const SUCESS_CREATED_ITEM = {status: true, status_code: 201, message: "Item criado com sucesso!"}
const SUCESS_DELETED_ITEM = {status: true, status_code: 200, message: 'Item deletado com sucesso!' }
const SUCESS_UPDATED_ITEM = {status: true, status_code: 200, message: "Item atualizado com sucesso!"}

module.exports = {
    ERROR_REQUIRED_FIELDS,
    SUCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_NOT_FOUND,
    SUCESS_DELETED_ITEM,
    SUCESS_UPDATED_ITEM
}