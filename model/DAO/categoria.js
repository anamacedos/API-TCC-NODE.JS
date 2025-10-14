/********************************************************************************
 * Objetivo: Model responsavel pelo CRUD de dados referente a categoria no Banco de Dados
 * Data: 25/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
//Import da biblioteca do prisma client para executar scripts no banco de dados
const {PrismaClient} = require ('@prisma/client')

//instancia da classe do prisma client para gerar um objeto
const prisma = new PrismaClient()

//função para inserir uma nova categoria
const inserirCategoria = async function(categoria) {

    try {
        let sql = `insert into tbl_categoria (
    nome,
    foto_claro,
    foto_escuro
) values (
    '${categoria.nome}',
    '${categoria.foto_claro}',
    '${categoria.foto_escuro}'
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


//função para listar todas as categorias
const selecionarTodasCategorias = async function () {
    try {
        let sql = `select * from tbl_categoria order by id desc`

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

//selecionar categoria pelo id
const listarCategoriaPeloId = async function(idCategoria){
    try {
        let sql = `select * from tbl_categoria where id = ${idCategoria}`
        
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
    inserirCategoria,
    selecionarTodasCategorias,
    listarCategoriaPeloId
}