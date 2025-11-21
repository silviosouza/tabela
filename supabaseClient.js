// Este arquivo cria uma instância global do cliente Supabase.
// Ele assume que a biblioteca Supabase foi carregada via CDN.

(() => {
    // A variável 'supabase' é criada globalmente pelo script da CDN.
    if (!window.supabase) {
        console.error('O cliente Supabase não foi carregado. Verifique a tag de script no index.html.');
        const errorMessageContainer = document.getElementById('price-list-content');
        if (errorMessageContainer) {
            document.getElementById('loading-state').style.display = 'none';
            errorMessageContainer.innerHTML = `
                <div class="error-message">
                    <p><strong>Erro Crítico</strong></p>
                    <p>A biblioteca do Supabase não foi carregada. Verifique sua conexão com a internet.</p>
                </div>
            `;
        }
        return;
    }

    const { createClient } = window.supabase;

    const supabaseUrl = "https://hxmqnosqboaiemvnvvdy.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bXFub3NxYm9haWVtdm52dmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNjM3ODksImV4cCI6MjA3NDgzOTc4OX0.QpEERtkeKc3mTWvah8L0HMV87XW8_ocZDYW0NTYgsqk";

    // Cria uma instância do cliente e a anexa ao objeto 'window' para ser acessível globalmente.
    window.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
})();
