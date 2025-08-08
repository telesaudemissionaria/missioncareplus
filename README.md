# MissionCare Plus &mdash; Cuidado Integral para Missionários

> Levando cura e esperança aos confins da Terra.

## 📋 Descrição

O **MissionCare Plus** é uma plataforma digital inovadora voltada para suporte integral &mdash; físico, emocional e espiritual &mdash; de missionários cristãos e suas famílias em regiões remotas, de difícil acesso ou sob risco de perseguição. Construída como **PWA** (Progressive Web App) no modelo "Offline-First", a solução funciona mesmo sem internet e permite acompanhamento de saúde autônomo, triagem, primeiros socorros, informações medicamentosas seguras, devocionais e suporte de rede missionária[1].

## ⚠️ Aviso Importante

_Este aplicativo **não substitui consultas médicas presenciais**. Use em caráter educacional, de apoio e em situações onde o acesso à saúde formal é limitado. Em emergências graves, **busque auxílio médico imediatamente**. Mais detalhes estão disponíveis na seção “Avisos de Segurança”._

## 🎯 Propósito e Público-Alvo

- Missionários cristãos em campo transcultural ou regiões isoladas
- Famílias missionárias e apoiadores
- Organizações missionárias e ONGs de apoio ao campo
- Profissionais de saúde voluntários em trabalho remoto

## ✨ Funcionalidades Principais

- **Triagem de Sintomas (Adulto e Pediátrico):**
  - Formulários interativos autodiagnóstico (“anamnese simplificada”) que geram relatórios de urgência, recomendam ações e podem ser exportados em PDF ou compartilhados via WhatsApp.
  - Exemplo: `3-triagem-adulto.html`, `3b-triagem-pediatria.html`
- **Guia de Emergências:**
  - Listagem interativa de protocolos para primeiros socorros em casos como afogamento, fraturas e queimaduras, com links para manuais detalhados. Acesso fácil em “acordeão”.
  - Exemplo: `4-emergencias.html`
- **Assistente IA (MedGemma):**
  - Chat inteligente via API Google Gemini, personalizado para aconselhamento médico cristocêntrico, com empatia e fé.
  - Exemplo: `5-assistenteIA.html`
- **Guia de Medicamentos Essenciais em Campo:**
  - Consultas rápidas sobre fármacos importantes, indicações, doses, justificativas, alertas de segurança e categorias.
  - Exemplo: `8-medicamentos.html`
- **Renovação Diária:**
  - Devocionais e versos bíblicos contextualizados ao campo missionário, promovendo encorajamento e suporte espiritual.
  - Exemplo: `6-textos-biblico.html`
- **Contatos e Rede de Apoio:**
  - Ligações rápidas para emergências via WhatsApp, e-mail, ou redes sociais; rede de voluntários e apoio missionário.
  - Exemplo: `9-contatos.html`
- **Avisos de Segurança:**
  - Alertas explícitos para sintomas graves (ex: infarto, AVC, convulsão, sangramento intenso) e instruções especiais para busca imediata de ajuda.
  - Exemplo: `sintomas-graves.html`
- **Internacionalização (i18n):**
  - Suporte multilíngue (Português, Espanhol, Inglês) gerenciado via JS, facilitando uso global.

## 🛠️ Tecnologias Utilizadas

| Camada    | Ferramentas                                           |
| --------- | ----------------------------------------------------- |
| Frontend  | HTML5, Tailwind CSS (CDN), JavaScript (ES6+)          |
| IA        | Google Gemini API (para o MedGemma)                   |
| PDF       | jsPDF, html2canvas                                    |
| PWA       | manifest.json (para instalação e uso offline)         |
| Scripts   | `/js/` (lógica customizada)                           |
| Estilos   | `/css/` (folhas de estilo, otimização responsive)     |

## 📁 Estrutura do Projeto

```
MissionCarePlus/
│
├── index.html
├── sintomas-graves.html
├── 3-triagem-adulto.html
├── 3b-triagem-pediatria.html
├── 4-emergencias.html
├── 5-assistenteIA.html
├── 6-textos-biblico.html
├── 8-medicamentos.html
├── 9-contatos.html
├── manifest.json
├── /js/
├── /css/
└── /docs/      # Documentação adicional, imagens e materiais de apoio
```

## 🚀 Como Executar

1. **Clone o repositório:**
   ```
   git clone https://github.com/SEU_USUARIO/missioncareplus.git
   cd missioncareplus
   ```
2. **Abra o `index.html`** em qualquer navegador moderno.  
   Para testar recursos offline e PWA, recomendo rodar um servidor local:
   ```
   python -m http.server
   ```
   Em seguida, acesse http://localhost:8000.

3. **Selecione o idioma desejado** logo ao entrar no app.

## 💡 Exemplo de Uso

- Realize a triagem de sintomas e compartilhe o resultado com o supervisor ou grupo de apoio diretamente via WhatsApp.
- Consulte informações de primeiros socorros durante emergências no campo.
- Use o chat inteligente para tirar dúvidas médicas de rotina e receber mensagens de encorajamento cristão.
- Acesse devocionais diários ao iniciar o dia em missão.

## 🔒 Segurança & Limitações

- Não oferece diagnóstico; serve apenas como orientação de primeiros passos e educação em saúde.
- Não armazena dados sensíveis do usuário.
- Orienta busca imediata por hospital em casos de sintomas graves.
- Atualizações de conteúdo seguem protocolos médicos reconhecidos, mas podem variar conforme contexto local.

## 🎯 Missão

Levar cuidado médico, emocional e espiritual a missionários, famílias e voluntários, usando tecnologia acessível e fé cristã para fortalecer o trabalho no campo e apoiar àqueles que levam o Evangelho onde há mais desafio[1].

## 🤝 Como Contribuir

1. Faça um **fork** deste repositório.
2. Crie um novo branch para seu recurso.
3. Faça commit das alterações.
4. Envie um **pull request** explicando a contribuição.
5. Colabore com sugestões, traduções ou novos conteúdos médicos e devocionais.

## 📞 Contato e Suporte

- **E-mail:** missionarymedicalcare@gmail.com
- **Site Oficial:** Telessaúde Missionária

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para detalhes.

## 👨⚕️ Autor

Samuel Silva &mdash; missionário e estudante de Medicina, idealizador do projeto Telessaúde Missionária (servindo na Bolívia desde 2012).  
Contato: missionarymedicalcare@gmail.com

> _"Porque eu era forasteiro e me acolhestes; estava nu e me vestistes; enfermo e me visitastes."_  
> &mdash; Mateus 25:35-36
