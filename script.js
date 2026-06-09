window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add("navbar-dark");
        } else {
            navbar.classList.remove("navbar-dark");
        }
    }
});

function revealPremiumElements() {
    const premiumElements = document.querySelectorAll(".reveal-premium");

    premiumElements.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 90) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealPremiumElements);
window.addEventListener("load", revealPremiumElements);

revealPremiumElements();

const blogList = document.getElementById("blog-list");

if (blogList) {
    fetch("../data/artigos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Arquivo artigos.json não encontrado");
            }

            return response.json();
        })
        .then(artigos => {
            blogList.innerHTML = "";

            artigos.forEach((artigo, index) => {
                const card = document.createElement("a");
                card.className = "article-card reveal-premium";
                card.href = `artigo.html?id=${index}`;

                card.innerHTML = `
                    <img src="../${artigo.imagem}" alt="${artigo.titulo}">
                    <div class="article-card-content">
                        <span>${artigo.categoria || "Artigo jurídico"}</span>
                        <h2>${artigo.titulo}</h2>
                        <p>${artigo.resumo || ""}</p>
                    </div>
                `;

                blogList.appendChild(card);
            });

            revealPremiumElements();
        })
        .catch(error => {
            console.error("Erro ao carregar artigos:", error);

            blogList.innerHTML = `
                <p style="color:#111; padding:30px; font-family:Montserrat, sans-serif;">
                    Os artigos não carregaram no modo arquivo local. 
                    Teste pelo Live Server ou depois que subir no Vercel.
                </p>
            `;
        });
}