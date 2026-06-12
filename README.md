# Painel de Transparência · Banco do Brasil

Mapa interativo do endividamento no Brasil — visão agregada e anonimizada do risco financeiro da população por estado (apostas/bets, inadimplência adulta e inadimplência PF). Projeto de hackathon.

## Estrutura

```
.
├── index.html        # marcação da página
├── css/
│   └── styles.css    # estilos
└── js/
    ├── geo-data.js   # geojson dos estados do Brasil (const GEO)
    └── app.js        # lógica do mapa (D3) e indicadores
```

## Como rodar

É um site estático. Por causa da política de CORS dos navegadores, sirva por um servidor local em vez de abrir o `index.html` direto:

```bash
# Python
python -m http.server 8000
# ou Node
npx serve
```

Depois acesse http://localhost:8000.

## Dados

Indicadores construídos a partir de dados públicos do DataSenado, Serasa e Banco Central. Demonstração; nenhum dado individual é exibido.
