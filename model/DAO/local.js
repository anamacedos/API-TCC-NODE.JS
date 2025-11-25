/********************************************************************************
 * Objetivo: Model responsavel pelo CRUD de dados referente a local no Banco de Dados
 * Data: 25/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
//Import da biblioteca do prisma client para executar scripts no banco de dados
const {PrismaClient} = require ('@prisma/client')

//instancia da classe do prisma client para gerar um objeto
const prisma = new PrismaClient()

//função para inserir um local no banco
const inserirLocal = async function(local) {

    try {
        let sql = `insert into tbl_local(
                    cep,
                    logradouro,
                    bairro,
                    cidade,
                    estado,
                    regiao

        )values(
        '${local.cep}',
        '${local.logradouro}',
        '${local.bairro}',
        '${local.cidade}',
        '${local.estado}',
        '${local.regiao}'
        )`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        
    }
    
}


//função para retornar do banco uma lista de todos os locais
const selecionarTodosLocais = async function () {
    try {
        let sql = `select * from tbl_consulta order by id desc`

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

//função para buscar um local pelo id
const listarLocalPeloId = async function(idLocal){
    try {
        let sql = `select * from tbl_local where id = ${idLocal}`

        
        let result = await prisma.$queryRawUnsafe(sql)

        

        if (result)
            return result
        else
            return false
        
    } catch (error) {
        return false
    }
    
}

module.exports = {
    inserirLocal,
    selecionarTodosLocais,
    listarLocalPeloId
}