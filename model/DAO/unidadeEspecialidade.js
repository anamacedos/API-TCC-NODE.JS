/********************************************************************************
 * Objetivo: Model responsavel pelo CRUD de dados referente a tabela relacionamento entre unidade de saúde e especialidade no Banco de Dados
 * Data: 30/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
//Import da biblioteca do prisma client para executar scripts no banco de dados
const {PrismaClient} = require ('@prisma/client')
const res = require('express/lib/response')

//instancia da classe do prisma client para gerar um objeto
const prisma = new PrismaClient()

//função para listar todas as especialidades de uma determinada unidade
const selecionarTodasEspecialidadesDaUnidade = async function (idUnidade) {
    try {
        let sql = `
        SELECT 
            e.id, 
            e.nome,
            e.foto
        FROM tbl_especialidade e
        JOIN tbl_unidade_especialidade ue 
            ON e.id = ue.fk_especialidade_id
        WHERE ue.fk_unidade_saude_id = ${idUnidade}
    `

        //para fazer select é o query, para insert, update ou delete é o execute

        let result = await prisma.$queryRawUnsafe(sql)


        if(result)
            return result
        else
            return false
  
            
    } catch (error) {
        console.log(error);
        
        return false
        
        
    }
}

module.exports = {
    selecionarTodasEspecialidadesDaUnidade
}