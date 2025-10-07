/********************************************************************************
 * Objetivo: controller responsavel pela rega de negocio do CRUD das unidades de saúde
 * Data: 18/09/2025
 * Autor: Ana Julia Macedo
 * Versao: 1.0
 ********************************************************************************/
const MESSAGE = require('../../modulo/config.js')
const unidadeDeSaudeDAO = require('../../model/DAO/unidadesDeSaude.js')
const controllerLocal = require('../local/controllerLocal.js')
const controllerCategoria = require('../categoria/controllerCategoria.js')
const controllerUnidadeEspecialidade = require('../unidadesDeSaude/controllerUnidadeEspecialidade')


//Função para inserir uma unidade de saúde

const inserirUnidadeDeSaude = async function (unidadeDeSaude, contentType) {
    try {
        if(contentType == 'application/json'){
            let resultUnidadeDeSaude = await unidadeDeSaudeDAO.inserirUnidadeDeSaude(unidadeDeSaude)
                if(resultUnidadeDeSaude)
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

//função para listar todas as unidades de saúde

const listarUnidadesDeSaude = async function(){
    try {
        let dadosUnidades = {}
        let resultUnidades = await unidadeDeSaudeDAO.selecionarTodasUnidadesDeSaude()

        if(resultUnidades != false){
            if(resultUnidades.length > 0 || typeof(resultUnidades) == 'object'){

                // Definindo os dados do objeto JSON que será retornado
                dadosUnidades.status = true
                dadosUnidades.status_code = 200
                dadosUnidades.item = resultUnidades.length
                dadosUnidades.unidadesDeSaude = []  

                for (let itemUnidade of resultUnidades){
                    
                    // Local
                    let dadosLocal = await controllerLocal.listarLocalPeloId(itemUnidade.tbl_local_id)
                    itemUnidade.local = dadosLocal
                    delete itemUnidade.tbl_local_id
                    delete itemUnidade.local.status
                    delete itemUnidade.local.status_code

                    // Categoria
                    let dadosCategoria = await controllerCategoria.listarCategoriaPeloId(itemUnidade.tbl_categoria_id)
                    itemUnidade.categoria = dadosCategoria
                    delete itemUnidade.tbl_categoria_id
                    delete itemUnidade.categoria.status
                    delete itemUnidade.categoria.status_code

                    //especialidade
                    let dadosEspecialidade = await controllerUnidadeEspecialidade.listarEspecialidadePeloIdUnidade(itemUnidade.id)
                    itemUnidade.especialidades = dadosEspecialidade

                    // Adiciona a unidade no array
                    dadosUnidades.unidadesDeSaude.push(itemUnidade)
                    delete itemUnidade.especialidades.status
                    delete itemUnidade.especialidades.status_code
                }

                return dadosUnidades

            } else {
                return MESSAGE.ERROR_NOT_FOUND
            } 
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


//fução para listar a unidade de saúde pelo id
const listarUnidadePeloId = async function(id){
    try {
        if(id == "" || id == undefined || id == null || isNaN(id) || id<=0){
            
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else{
            const arrayUnidades = []
            let dadosUnidade = {}
            let resultUnidade = await unidadeDeSaudeDAO.listarUnidadePeloId(parseInt(id)) //se caso chegar um numero decimal, o parse int pega só a parte inteira
            
            if (resultUnidade != false){

                if (resultUnidade.length > 0 || typeof(resultUnidade) == 'object'){

                    //cria um objeto do tipo json para retornar a lista de jogos
                    dadosUnidade.status = true
                    dadosUnidade.status_code = 200
                    //dadosUnidade.unidadeDeSaude = resultUnidade
                    

                    for (itemUnidade of resultUnidade){

                        //LOCAL
                        let dadosLocal = await controllerLocal.listarLocalPeloId(itemUnidade.tbl_local_id)

                        itemUnidade.local = dadosLocal

                        delete itemUnidade.tbl_local_id

                        delete itemUnidade.local.status
                        delete itemUnidade.local.status_code

                        //CATEGORIA
                        let dadosCategoria = await controllerCategoria.listarCategoriaPeloId(itemUnidade.tbl_categoria_id)

                        itemUnidade.categoria = dadosCategoria

                        delete itemUnidade.tbl_categoria_id
                        delete itemUnidade.categoria.status
                        delete itemUnidade.categoria.status_code


                        //ESPECIALIDADE
                        let dadosEspecialidade = await controllerUnidadeEspecialidade.listarEspecialidadePeloIdUnidade(itemUnidade.id)

                        itemUnidade.especialidades = dadosEspecialidade

                        delete itemUnidade.especialidades.status
                        delete itemUnidade.especialidades.status_code


                        
                        
                    }

                    dadosUnidade.unidadeDeSaude = itemUnidade

                    return dadosUnidade
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

//função para atualizar uma unidade de saúde
const atualizarUnidadeDeSaude = async function (unidadeDeSaude, idUnidade, contentType) {
    try {
        if (contentType == 'application/json'){

            //verificar se o id existe no banco
            let resultBusca = await unidadeDeSaudeDAO.listarUnidadePeloId(parseInt(idUnidade))
            console.log(resultBusca);

            if(resultBusca.status_code == 200){
                unidadeDeSaude.id = parseInt(idUnidade)
                let result = await unidadeDeSaudeDAO.atualizarUnidadeDeSaude(unidadeDeSaude)

                if (result)
                    return MESSAGE.SUCESS_CREATED_ITEM
                else 
                    console.log("321");
                    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
            }else if(resultBusca.status_code == 400){
                return MESSAGE.ERROR_NOT_FOUND
            }else{

                console.log("123");
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
            }
            
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

//função para retornar baseado nos filtros

const filtrarUnidadeDeSaude = async function (idEspecialidade, idCategoria, disponibilidade) {
    try {
      // Normaliza parâmetros
      idEspecialidade = (!idEspecialidade || isNaN(idEspecialidade)) ? 0 : idEspecialidade
      idCategoria = (!idCategoria || isNaN(idCategoria)) ? 0 : idCategoria
  
      let dadosUnidades = {}
      let resultUnidades = await unidadeDeSaudeDAO.filtrarUnidadeDeSaude(idEspecialidade, idCategoria, disponibilidade)
  
      if (resultUnidades && resultUnidades.length > 0) {
        dadosUnidades.status = true
        dadosUnidades.status_code = 200
        dadosUnidades.unidadesDeSaude = []
  
        for (let itemUnidade of resultUnidades) {
            let unidadeCompleta = await listarUnidadePeloId(itemUnidade.id)
            if(unidadeCompleta.status) {
                dadosUnidades.unidadesDeSaude.push(unidadeCompleta.unidadeDeSaude)
            }
        }
        
  
        return dadosUnidades
      } else {
        return MESSAGE.ERROR_NOT_FOUND
      }
  
    } catch (error) {
      console.log(error)
      return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
  }

  // Função para pesquisar unidades pelo nome
const pesquisarUnidadePeloNome = async function(nomeDigitado) {
    try {
        // validação: não pode vir vazio
        if (!nomeDigitado || nomeDigitado.trim() === "") {
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }

        let dadosUnidades = {}
        let resultUnidades = await unidadeDeSaudeDAO.pesquisarNomeUnidade(nomeDigitado)

        if (resultUnidades && resultUnidades.length > 0) {
            dadosUnidades.status = true
            dadosUnidades.status_code = 200
            dadosUnidades.unidadesDeSaude = []

            // reaproveita a função de listar pelo id para montar cada unidade completa
            for (let itemUnidade of resultUnidades) {
                let unidadeCompleta = await listarUnidadePeloId(itemUnidade.id)
                
                // como listarUnidadePeloId já devolve {status, status_code, unidadeDeSaude}
                // aqui pegamos apenas a parte "unidadeDeSaude"
                if (unidadeCompleta && unidadeCompleta.unidadeDeSaude) {
                    dadosUnidades.unidadesDeSaude.push(unidadeCompleta.unidadeDeSaude)
                }
            }

            return dadosUnidades
        } else {
            return MESSAGE.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

  


module.exports = {
    inserirUnidadeDeSaude,
    listarUnidadesDeSaude,
    listarUnidadePeloId,
    atualizarUnidadeDeSaude,
    filtrarUnidadeDeSaude,
    pesquisarUnidadePeloNome
}