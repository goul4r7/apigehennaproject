create table categorias (
	codigo serial not null primary key,
	nome varchar(20) not null
);

insert into categorias (nome) values ('Terror'), ('Suspense'), ('Thriller'), ('Comédia'), ('Drama'), ('Noir');

select * from categorias;

create table filmes (
	codigo serial not null primary key,
	titulo varchar(60) not null,
	sinopse text,
	data_estreia date,
	categoria integer not null,
	foreign key (categoria) references categorias (codigo)
);

insert into filmes (titulo, sinopse, data_estreia, categoria) 
values ('O Palhaço da Meia Noite: Curta Metragem', 'Em uma noite aparentemente normal, um encontro inesperado transforma o normal em paranoia','2022-11-02', 1)
returning codigo, titulo, sinopse, data_estreia, categoria;

insert into filmes (titulo, sinopse, data_estreia, categoria) 
values ('A Loira do Banheiro', 'Um grupo de três amigos inconsequentes decidem tentar fazer um ritual para conjurar a Loira do Banheiro','2022-06-02', 1)
returning codigo, titulo, sinopse, data_estreia, categoria;

insert into filmes (titulo, sinopse, data_estreia, categoria) 
values ('A Boneca', 'Ana se vê numa crescente paranoia para desvendar uma presença aterrorizante', null, 3)
returning codigo, titulo, sinopse, data_estreia, categoria

select * from filmes

-- Para inserir um objeto com um valor nulo (considerando que não seja um valor not null), se insere null onde iria o valor

-- consultar filmes e categorias

select p.codigo as codigo, 
        p.titulo as titulo, p.sinopse as sinopse,
        to_char(p.data_estreia,'YYYY-MM-DD') as data_estreia, 
        p.categoria as categoria, c.nome as categoria_nome
        from filmes p
        join categorias c on p.categoria = c.codigo
        order by p.codigo