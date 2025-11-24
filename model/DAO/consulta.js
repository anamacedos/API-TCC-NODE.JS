/********************************************************************************
 * Objetivo: Model responsavel pelo CRUD de dados referente as consultas no Banco de Dados
 * Data: 24/11/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
//Import da biblioteca do prisma client para executar scripts no banco de dados
const {PrismaClient} = require ('@prisma/client')
const res = require('express/lib/response')

//instancia da classe do prisma client para gerar um objeto
const prisma = new PrismaClient()

//Função para inserir no banco de dados uma consulta
const inserirConsulta = async function(consulta){
    try {
        let sql = `insert into tbl_consulta (
            tempo_entrada,
            tempo_saida,
            fk_unidade_saude_id,
            fk_especialidade_id
    ) values (
            '${consulta.tempo_entrada}',
            '${consulta.tempo_saida}',
            '${consulta.id_unidade_saude}',
            '${consulta.id_especialidade}'
    )`
    
        console.log(sql);

    let result = await prisma.$executeRawUnsafe(sql)

    if(result)
        return true
    else
        return false

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    inserirConsulta
}