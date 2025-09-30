/********************************************************************************
 * Objetivo: Model responsavel pelo CRUD de dados referente a especialidade no Banco de Dados
 * Data: 30/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
//Import da biblioteca do prisma client para executar scripts no banco de dados
const {PrismaClient} = require ('@prisma/client')
const res = require('express/lib/response')

//instancia da classe do prisma client para gerar um objeto
const prisma = new PrismaClient()

//função para listar todas as especialidades
const selecionarTodasEspecialidades = async function () {
    try {
        let sql = `select * from tbl_especialidade order by id desc`

        //para fazer select é o query, para insert, update ou delete é o execute

        let result = await prisma.$queryRawUnsafe(sql)


        if(result)
            return result
        else
            return false
  
            
    } catch (error) {
        return false
        
        
    }
}


module.exports = {
    selecionarTodasEspecialidades
}