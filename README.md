# Nexus Carpete — Loja Black Friday (Tapete Bandeja 3D)

Funil de produto único com a estrutura e os componentes da loja Bruttus, na identidade azul e branco da Nexus.
Site 100% estático (HTML/CSS/JS, sem build e sem banco de dados). Pode ser publicado na Vercel a partir da raiz.

## Estrutura
```
index.html        Página do produto (funil)
politicas.html    Contato, prazo, trocas, garantia, pagamento, privacidade e termos (só dados que o site atual já publica)
banners.html      Gerador de banners Black Friday (HTML → PNG)
brand/            logo.svg (fundo escuro), logo-azul.svg (fundo branco), favicon.svg, logo-original.png
css/styles.css    Visual base (tokens de cor da Nexus no topo)
css/v2.css        Componentes: compra segura, seletor de veículo, CEP, avaliações, GIFs, antes/depois, modais
js/config.js      ⭐ O que você edita no dia a dia: preços, kits, checkout, adicional, FAQ, avaliações, vídeos
js/vehicles.js    Base de marcas/modelos/anos/cabines/lugares (extraída sem alterações do site atual)
js/app.js         Monta a página a partir do config
images/, media/   Fotos, vídeos e GIFs do site atual (+ images/banners gerados)
tools/serve.ps1   Servidor local (preview + "Salvar no site" dos banners). Não vai para a Vercel.
```

## Cores (tokens do site atual)
| Uso | Cor |
|---|---|
| Azul principal | `#0b3165` |
| Azul dos botões | `#1763cf` |
| Azul-marinho (hero / Black Friday) | `#061b37` |
| Fundo | `#f5f7fa` · cards `#ffffff` |
| Selo de desconto | `#ed2c2c` |

## Ordem do funil
Barra de contagem → header (Compra segura) → galeria com miniaturas e lightbox + caixa de compra
(seletor de veículo → kits com desconto e preço por peça → preço → CEP → seleção → Comprar agora)
→ benefícios → descrição (banner BF, faixa de specs, banner principal, GIFs em loop, antes/depois, kit,
para quem é, comparativo, especificações, o que vem na caixa, garantia) → entrega segura → bastidores
→ avaliações (vídeos, fotos reais, filtro por estrela, escrever, busca, ordenação) → CTA final
→ sobre nós → FAQ → selos → mapa → rodapé. Barra fixa no celular leva até as ofertas.

## Checkout (mesmos links do site atual)
| Botão | Link |
|---|---|
| Kit Interno + Porta-Malas (R$ 137,00) | https://checkout.nexuscarpete.shop/VCCL1O8SD4VI |
| Kit Interno + Caçamba — Caminhonete (R$ 137,00) | https://checkout.nexuscarpete.shop/VCCL1O8SD4VI |
| Kit Tapetes Interno (R$ 97,00) | https://checkout.nexuscarpete.shop/VCCL1O8SD4VO |
| Kit Interno + adicional porta-malas/caçamba (+ R$ 40,00) | https://checkout.nexuscarpete.shop/VCCL1O8SD4VI |

O popup "Confirmar pedido" pede a textura (A/B/C) antes de liberar "Finalizar pagamento".
As UTMs da URL são repassadas ao checkout (sem duplicar chaves). Como no site atual, o veículo,
a textura e a observação aparecem só na tela: o checkout não recebe esses dados.

## Pixels
Mesmos do site atual:
- Meta Pixel `2298845797620394`: PageView ao abrir a página (index e políticas) e InitiateCheckout
  sem parâmetros no clique de **Finalizar pagamento** (equivale ao "Confirmar ✓" antigo), com trava
  de 800ms contra clique duplo. Só dispara com a textura escolhida; espera 220ms antes de ir ao checkout.
- UTMify (mesma tag) + script de preservação de UTMs.

## Banners
Rode o servidor local, abra `banners.html` e clique em **Salvar no site** (atualiza `images/banners/`) ou **Baixar PNG**.
```
powershell -ExecutionPolicy Bypass -File tools\serve.ps1 -Root . -Port 8093
```
