const express = require('express');
const cors = require('cors');
const { pool } = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());

// API para tabela categorias
const getCategorias = async (request, response) => {
    try {
        // bloco do código a ser executado
        const { rows } = await pool.query('SELECT * FROM categorias order by codigo');
        return response.status(200).json(rows);
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao consultar as categorias: ' + err
        })
    }
}

const addCategoria = async (request, response) => {
    try {
        // bloco do código a ser executado
        const { nome } = request.body;
        const results = await pool.query(`INSERT INTO categorias (nome) 
        VALUES ($1) RETURNING codigo, nome`,[nome]);
        const linhainserida = results.rows[0];
        return response.status(200).json({
            status : "success" , message : "Categoria criada",
            objeto : linhainserida
        })
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao inserir a categoria: ' + err
        })
    }
}

const updateCategoria = async (request, response) => {
    try {
        // bloco do código a ser executado
        const { codigo, nome } = request.body;
        const results = await pool.query(`UPDATE categorias SET
        nome = $1 where codigo = $2 RETURNING codigo, nome`,[nome, codigo]);
        const linhaalterada = results.rows[0];
        return response.status(200).json({
            status : "success" , message : "Categoria alterada",
            objeto : linhaalterada
        })
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao atualizar a categoria: ' + err
        })
    }
}

const deleteCategoria = async (request, response) => {
    try {
        // bloco do código a ser executado
        const codigo = request.params.codigo;
        const results = await pool.query(`DELETE FROM categorias
        WHERE codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            return response.status(400).json({
                status : 'error',
                message : `Nenhum registro com o código ${codigo} para ser removido`
            })  
        } else {
            return response.status(200).json({
                status : 'success', message : 'Categoria removida com sucesso!'
            })
        }
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao remover a categoria: ' + err
        })
    }
}

const getCategoriaPorCodigo = async (request, response) => {
    try {
        // bloco do código a ser executado
        const codigo = request.params.codigo;
        const results = await pool.query(`SELECT * FROM categorias
        WHERE codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            return response.status(400).json({
                status : 'error',
                message : `Nenhum registro encontrado com o código ${codigo} `
            })  
        } else {
            const categoria = results.rows[0];
            return response.status(200).json(categoria);
        }
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao recuperar a categoria: ' + err
        })
    }
}

app.route('/categorias')
   .get(getCategorias)
   .post(addCategoria)
   .put(updateCategoria)

app.route('/categorias/:codigo')
   .delete(deleteCategoria)
   .get(getCategoriaPorCodigo)

// API para tabela produtos
const getFilmes = async (request, response) => {
    try {
        // bloco do código a ser executado
        const { rows } = await pool.query(`select p.codigo as codigo, 
        p.titulo as titulo, p.sinopse as sinopse,
        to_char(p.data_estreia,'YYYY-MM-DD') as data_estreia, 
        p.categoria as categoria, c.nome as categoria_nome
        from filmes p
        join categorias c on p.categoria = c.codigo
        order by p.codigo`);
        return response.status(200).json(rows);
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao consultar os filmes: ' + err
        })
    }
}

const addFilme = async (request, response) => {
    try {
        // bloco do código a ser executado
        const { titulo, sinopse, data_estreia, categoria } = request.body;
        const results = await pool.query(`INSERT INTO filmes 
            (titulo, sinopse, data_estreia, categoria)
            VALUES ($1, $2, $3, $4)
            RETURNING codigo, nome, descricao, quantidade_estoque, ativo, 
            valor, to_char(data_cadastro,'YYYY-MM-DD') as data_cadastro, categoria`,
            [ titulo, sinopse, data_estreia, categoria ]);
        const linhainserida = results.rows[0];
        return response.status(200).json({
            status : "success" , message : "Filme inserido",
            objeto : linhainserida
        })
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao inserir o filme: ' + err
        })
    }
}

const updateFilme = async (request, response) => {
    try {
        // bloco do código a ser executado
        const { titulo, sinopse, data_estreia, categoria, codigo } = request.body;
        const results = await pool.query(`UPDATE filmes SET 
        titulo = $1, sinopse = $2, 
        data_estreia = $3, categoria = $4
        WHERE codigo = $5
        RETURNING codigo, titulo, sinopse, to_char(data_estreia,'YYYY-MM-DD') as data_estreia, categoria`,
        [ titulo, sinopse, data_estreia, categoria, codigo ]);
        const linhaalterada = results.rows[0];
        return response.status(200).json({
            status : "success" , message : "Filme alterado",
            objeto : linhaalterada
        })
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao atualizar o filme: ' + err
        })
    }
}

const deleteFilme = async (request, response) => {
    try {
        // bloco do código a ser executado
        const codigo = request.params.codigo;
        const results = await pool.query(`DELETE FROM filmes
        WHERE codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            return response.status(400).json({
                status : 'error',
                message : `Nenhum registro com o código ${codigo} para ser removido`
            })  
        } else {
            return response.status(200).json({
                status : 'success', message : 'Filme removido com sucesso!'
            })
        }
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao remover o filme: ' + err
        })
    }
}

const getFilmePorCodigo = async (request, response) => {
    try {
        // bloco do código a ser executado
        const codigo = request.params.codigo;
        const results = await pool.query(`select p.codigo as codigo, 
        p.titulo as titulo, p.sinopse as sinopse,
        to_char(p.data_estreia,'YYYY-MM-DD') as data_estreia, 
        p.categoria as categoria, c.nome as categoria_nome
        from filmes p
        join categorias c on p.categoria = c.codigo
        WHERE p.codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            return response.status(400).json({
                status : 'error',
                message : `Nenhum registro encontrado com o código ${codigo} `
            })  
        } else {
            const produto = results.rows[0];
            return response.status(200).json(produto);
        }
    } catch (err) {
        // bloco do tratamento de erro caso ele ocorra
        return response.status(400).json({
            status : 'error',
            message : 'Erro ao recuperar filme: ' + err
        })
    }
}

app.route('/filmes')
   .get(getFilmes)
   .post(addFilme)
   .put(updateFilme)

app.route('/filmes/:codigo')
   .delete(deleteFilme)
   .get(getFilmePorCodigo)


app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor da API Rodando');
})