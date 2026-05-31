window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('navbar-dark');
    } else {
        navbar.classList.remove('navbar-dark');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    carregarListaDoBlog();
    carregarArtigoIndividual();
});

async function buscarArtigos() {
    try {
        const caminho = window.location.pathname.includes('/blog/')
            ? '../data/artigos.json'
            : 'data/artigos.json';

        const resposta = await fetch(caminho);

        if (!resposta.ok) {
            throw new Error('Não foi possível carregar os artigos.');
        }

        return await resposta.json();

    } catch (erro) {
        console.error('Erro ao carregar artigos:', erro);
        return [];
    }
}

async function carregarListaDoBlog() {
    const blogList = document.getElementById('blog-list');

    if (!blogList) return;

    const artigos = await buscarArtigos();

    if (!artigos.length) {
        blogList.innerHTML = `
            <p style="color:#555;">
                Nenhum artigo encontrado no momento.
            </p>
        `;
        return;
    }

    blogList.innerHTML = artigos.map(function (artigo) {
        return `
            <a class="article-card" href="artigo.html?slug=${artigo.slug}">
                <img src="${artigo.imagem}" alt="${artigo.titulo}">
                
                <div class="article-card-content">
                    <span>${artigo.categoria}</span>
                    <h2>${artigo.titulo}</h2>
                    <p>${artigo.descricao}</p>
                </div>
            </a>
        `;
    }).join('');
}

async function carregarArtigoIndividual() {
    const articleTitle = document.getElementById('article-title');

    if (!articleTitle) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    const artigos = await buscarArtigos();

    const artigo = artigos.find(function (item) {
        return item.slug === slug;
    });

    if (!artigo) {
        articleTitle.innerText = 'Artigo não encontrado';
        document.getElementById('article-body').innerHTML = `
            <p>
                O artigo solicitado não foi encontrado. 
                Volte para a página de artigos e escolha outro conteúdo.
            </p>
        `;
        return;
    }

    document.title = `${artigo.titulo} | Dr. Sérgio Henrique Santos Oliveira`;

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
        metaDescription.setAttribute('content', artigo.descricao);
    }

    document.getElementById('article-title').innerText = artigo.titulo;
    document.getElementById('article-category').innerText = artigo.categoria;
    document.getElementById('article-date').innerText = artigo.data;
    document.getElementById('article-body').innerHTML = artigo.conteudo;

    const imagem = document.getElementById('article-image');

    if (imagem) {
        imagem.src = artigo.imagem;
        imagem.alt = artigo.titulo;
    }
}