/********************************************************************************
 * Objetivo: Model responsavel pelo CRUD de dados referente a unidades de saúde no Banco de Dados
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
//Import da biblioteca do prisma client para executar scripts no banco de dados
const {PrismaClient} = require ('@prisma/client')

//instancia da classe do prisma client para gerar um objeto
const prisma = new PrismaClient()

//Fucao para inserir no Banco de Dados uma nova unidade de saude
const inserirUnidadeDeSaude = async function(UnidadeDeSaude){ 
    try {

        let sql = `insert into tbl_unidade_saude(
                                        nome,
                                        telefone,
                                        disponibilidade_24h,
                                        foto,
                                        tbl_local_id,
                                        tbl_categoria_id

        )values(
            '${UnidadeDeSaude.nome}',
            '${UnidadeDeSaude.telefone}',
            '${UnidadeDeSaude.disponibilidade_24h}',
            '${UnidadeDeSaude.foto}',
            '${UnidadeDeSaude.tbl_local_id}',
            '${UnidadeDeSaude.tbl_categoria_id}'
        )`
        // console.log(sql)
        //executa o script sql no banco de dados e aguarda o retorno do banco
        //so pode ter await em uma funcao se ela for async, e ela so pode ser async se ela precisa fazer uma requisicao que esta em outro servidor
        let result = await prisma.$executeRawUnsafe(sql) //enquanto o banco nao da uma devolutiva, nao passa para a proxima linha
            
        if (result)
            return true

        else
            return false
    } catch (error) {
        console.log(error)
    }
}


//função para retornar do banco de dados uma lista de unidades de saúde
const selecionarTodasUnidadesDeSaude = async function () {
    try {
        let sql = `select * from tbl_unidade_saude order by id desc`

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

//selecionar uma unidade de saúde pelo id
const listarUnidadePeloId = async function(idUnidade){
    try {
        let sql = `select * from tbl_unidade_saude where id = ${idUnidade}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (result)
            return result
        else
            return false
        
    } catch (error) {
        return false
    }
    
}

//atualizar uma unidade de saúde
const atualizarUnidadeDeSaude = async function (unidadeDeSaude) {
    try {
        let sql = `update tbl_unidade_saude set nome = '${unidadeDeSaude.nome}',
                                    telefone = "${unidadeDeSaude.telefone}",
                                    disponibilidade_24h = "${unidadeDeSaude.disponibilidade_24h}",
                                    foto = "${unidadeDeSaude.foto}",
                                    tbl_local_id = "${unidadeDeSaude.tbl_local_id}",
                                    tbl_categoria_id = "${unidadeDeSaude.tbl_categoria_id}"
                                    where id = ${unidadeDeSaude.id}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        if(result)
            return true
        else
            return false
        
    } catch (error) {
        console.log(error)
        return false
    }
    
}

module.exports = {
    inserirUnidadeDeSaude,
    selecionarTodasUnidadesDeSaude,
    listarUnidadePeloId,
    atualizarUnidadeDeSaude
}