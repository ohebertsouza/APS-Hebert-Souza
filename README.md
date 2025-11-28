# APS: Desenvolvimento Front-End - To-Do List Server

Este projeto foi desenvolvido como parte da Atividade Prática Supervisionada (APS) da disciplina de Desenvolvimento Front-End. O objetivo foi criar uma interface cliente (Front-end) para interagir com uma API de lista de tarefas pré-existente.

## 🎨 Identidade Visual e Inspiração

Para a interface, fugi do padrão básico. Busquei inspiração no **Ecossistema Apple (iOS/macOS)** e no estilo **Glassmorphism** (Vidro Fosco).

* **Conceito:** "Dark Mode Premium".
* **Elementos:**
    * Uso de **Glassmorphism** (transparência e desfoque) nos containers e menus.
    * Botões arredondados (formato pílula e círculo) para melhor usabilidade mobile.
    * Fundo animado com "Luzes Líquidas" (Radial Gradients) para dar profundidade sem pesar o carregamento.
    * Fonte **Inter**, utilizada em interfaces modernas de alta legibilidade.
    * **Feedback Visual:** Botões e inputs reagem ao hover e focus.

## 🚀 Funcionalidades Implementadas

O cliente atende aos requisitos de CRUD completo:
1.  **Cadastro de Usuários:** Interface dedicada com validação visual.
2.  **Login:** Sistema de autenticação via Token (armazenado no LocalStorage).
3.  **Gestão de Tarefas:**
    * **Visualização:** Listagem em Grid Layout para melhor aproveitamento de espaço.
    * **Criação:** Validação de input e feedback de "Salvando...".
    * **Exclusão:** Modo "Gerenciar" que permite seleção múltipla e exclusão em massa.
    * **Menu Suspenso:** Acesso rápido a logout e perfil.

## 🛠️ Desafios e Aprendizados

Durante o desenvolvimento, enfrentei desafios técnicos interessantes que serviram de aprendizado:

1.  **Integração com o Backend (Python/FastAPI):**
    * Houve dificuldade inicial em entender o schema de dados que o servidor esperava. O código JavaScript foi adaptado para enviar payloads robustos (incluindo `title`, `name` e `description`) para garantir a compatibilidade.
    * A leitura da resposta da API também exigiu ajustes, pois o servidor retornava objetos aninhados (`{ tasks: [...] }`) que precisaram ser tratados no script.

2.  **CSS e Nomenclatura:**
    * Um bug visual persistente foi causado pelo uso da propriedade `colour` (inglês britânico) ao invés de `color`, o que impedia a renderização correta das fontes. O problema foi identificado e corrigido em todo o arquivo de estilos.

3.  **Manipulação do DOM:**
    * A lógica para atualizar a lista de tarefas sem recarregar a página (AJAX) foi desafiadora, especialmente para garantir que o "Estado Vazio" (mensagem de "Tudo Limpo") aparecesse e desaparecesse nos momentos certos.

## 📦 Como Rodar o Projeto

1.  **Backend:**
    * Acesse a pasta `server`.
    * Crie o ambiente virtual e instale as dependências (`pip install -r requirements.txt`).
    * Inicie o servidor: `uvicorn main:app --reload`.
    * Certifique-se que está rodando na porta **8000**.

2.  **Frontend:**
    * Acesse a pasta `client`.
    * Abra o arquivo `index.html` ou `login.html` no navegador (recomendado uso do Live Server).

---
**Aluno:** Hebert Souza
**Matrícula:** 2023101267
