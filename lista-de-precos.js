// O cliente 'supabaseClient' e a biblioteca 'lucide' estão disponíveis globalmente.
const supabase = window.supabaseClient;

// Esta chamada renderiza os ícones.
lucide.createIcons();

const content = document.getElementById('price-list-content');
const loading = document.getElementById('loading-state');
const printBtn = document.getElementById('print-btn');

const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        return 'N/A';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const loadPriceList = async () => {
    if (!supabase) {
        console.error("Cliente Supabase não encontrado. O script supabaseClient.js falhou ao carregar.");
        loading.style.display = 'none';
        content.innerHTML = `<p class="error-message">Erro de configuração: não foi possível conectar ao banco de dados.</p>`;
        return;
    }

    try {
        const { data: products, error } = await supabase
            .from('produtos')
            .select('nome, preco, grupos_produtos ( nome )')
            .order('nome', { referencedTable: 'grupos_produtos', ascending: true })
            .order('nome', { ascending: true });

        loading.style.display = 'none';

        if (error) {
            throw error;
        }

        if (!products || products.length === 0) {
            content.innerHTML = '<p>Nenhum produto cadastrado para exibir.</p>';
            return;
        }

        // Agrupar produtos por grupo
        const groupedProducts = products.reduce((acc, product) => {
            const groupName = product.grupos_produtos?.nome || 'Outros';
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(product);
            return acc;
        }, {});

        renderPriceList(groupedProducts);
    } catch (error) {
        loading.style.display = 'none';
        console.error('Erro ao buscar produtos:', error);
        if (!content.querySelector('.error-message')) {
            content.innerHTML = `<p class="error-message">Não foi possível carregar a lista de preços. Verifique o console para mais detalhes.</p>`;
        }
    }
};

const renderPriceList = (groupedProducts) => {
    let html = '';

    // Ordenar os grupos alfabeticamente
    const sortedGroupNames = Object.keys(groupedProducts).sort();

    for (const groupName of sortedGroupNames) {
        html += `
            <section class="price-group">
                <h2 class="group-title">${groupName}</h2>
                <div class="product-grid">
        `;

        groupedProducts[groupName].forEach(product => {
            html += `
                <div class="product-card-price">
                    <h3 class="product-name">${product.nome}</h3>
                    <p class="product-price">${formatCurrency(product.preco)}</p>
                </div>
            `;
        });

        html += `
                </div>
            </section>
        `;
    }

    content.innerHTML = html;
};

printBtn.addEventListener('click', () => {
    window.print();
});

// Carrega a lista de preços quando o script é executado
loadPriceList();
