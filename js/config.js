/* =====================================================================
   NEXUS CARPETE — CONFIGURAÇÃO DA LOJA
   Tudo que muda com frequência (preço, checkout, textos, FAQ, avaliações)
   fica aqui. O app.js lê este arquivo e monta a página.
   Textos, preços e links vieram do site atual (nexuscarpete.shop).
   ===================================================================== */
window.STORE = {
  brand: {
    name: "Nexus Carpete",
    address: "R. 1500, 820 - Centro, Balneário Camboriú - SC, 88330-526",
    email: "contato@nexuscarpete.shop",
    hours: "Seg à Sex: 08h às 18h · Sáb: 08h às 12h",
    about: "Carpetes automotivos sob medida, com acabamento premium e envio para todo o Brasil. Qualidade, segurança e satisfação garantidas."
  },

  // Fim da campanha (barra de contagem e banners). Formato ISO com fuso de Brasília.
  offerEndsAt: "2026-11-30T23:59:59-03:00",
  campaignLabel: "BLACK FRIDAY",
  discountLabel: "ATÉ 48% OFF",

  product: {
    title: "Tapete Bandeja 3D, sob medida para seu carro",
    shortTitle: "Tapete Bandeja 3D",
    subtitle: "Proteção premium impermeável e encaixe sob medida para o seu veículo.",
    rating: "4,9",
    ratingCount: "847",
    clients: "+15.000",
    warranty: "Garantia 12 meses",
    images: [
      { src: "images/banners/capa-produto.png", alt: "Tapete Bandeja 3D Nexus Carpete — Black Friday" },
      { src: "images/produto/hero-1.webp", alt: "Tapete Bandeja 3D Nexus Carpete" },
      { src: "images/kits/kit-completo.webp", alt: "Kit completo de tapetes 3D com porta-malas" },
      { src: "images/kits/kit-interno.webp", alt: "Kit interno de tapetes 3D - 3 peças" },
      { src: "images/produto/hero-2.webp", alt: "Tapetes 3D dianteiro e traseiro vista superior" },
      { src: "images/produto/hero-3.webp", alt: "Tapete com altíssima durabilidade e borda elevada" },
      { src: "images/kits/kit-cacamba.webp", alt: "Kit interno + caçamba sob medida" }
    ]
  },

  /* Ofertas. Preço em centavos.
     off e save são os valores exibidos hoje no site da Nexus (mantidos como estão).
     variants.Caminhonete troca o texto/foto quando o cliente escolhe "Caminhonete"
     (o link de checkout continua o mesmo, como no site atual). */
  offers: [
    {
      id: "completo", pieces: 4, label: "Kit Interno + Porta-Malas", detail: "Proteção completa",
      price: 13700, compareAt: 33990, off: 48, save: 16290, badge: "Mais vendido",
      image: "images/kits/kit-completo.webp",
      features: ["3 tapetes internos sob medida", "Traseiro inteiriço c/ proteção central", "Tapete porta-malas sob medida"],
      checkoutUrl: "https://checkout.nexuscarpete.shop/VCCL1O8SD4VI",
      variants: {
        Caminhonete: {
          label: "Kit Interno + Caçamba", image: "images/kits/kit-cacamba.webp",
          features: ["3 tapetes internos sob medida", "Traseiro inteiriço c/ proteção central", "Tapete caçamba sob medida"]
        }
      }
    },
    {
      id: "interno", pieces: 3, label: "Kit Tapetes Interno", detail: "Sem porta-malas",
      price: 9700, compareAt: 23790, off: 42, save: 10090, badge: "Melhor preço",
      image: "images/kits/kit-interno.webp",
      features: ["3 tapetes internos sob medida", "Traseiro inteiriço c/ proteção central"],
      checkoutUrl: "https://checkout.nexuscarpete.shop/VCCL1O8SD4VO",
      variants: { Caminhonete: { detail: "Sem caçamba" } }
    }
  ],
  defaultOffer: "completo",

  /* Adicional do popup "Confirmar pedido" (order bump).
     Aparece só no Kit Interno: marcar troca o pedido para o kit completo
     (mesmo preço e mesmo link de checkout do kit completo). */
  upgrade: {
    from: "interno", to: "completo",
    title: "Adicionar tapete porta-malas sob medida",
    titleCaminhonete: "Adicionar tapete caçamba sob medida",
    detail: "Leve o kit completo e proteja também o porta-malas",
    detailCaminhonete: "Leve o kit completo e proteja também a caçamba"
  },

  installmentsNoInterest: 3,  // "3x sem juros no cartão ou até 12x com juros"
  installmentsMax: 12,

  textures: [
    { id: "A", label: "Textura A", image: "images/texturas/textura-a.webp" },
    { id: "B", label: "Textura B", image: "images/texturas/textura-b.webp" },
    { id: "C", label: "Textura C", image: "images/texturas/textura-c.webp" }
  ],

  /* Popup "Compra segura" (botão do escudo no topo) — só o que o site da Nexus já informa. */
  security: {
    intro: "Seus dados e seu pagamento protegidos em todas as etapas da compra.",
    items: [
      { icon: "lock", title: "Site 100% Seguro", text: "Conexão criptografada SSL 256 bits." },
      { icon: "refresh", title: "Compra Garantida", text: "7 dias por lei (CDC art. 49) e 30 dias de satisfação." },
      { icon: "card", title: "Pagamentos Aprovados", text: "Pix, Boleto e Cartão: 3x sem juros ou até 12x com juros." },
      { icon: "truck", title: "Frete para Todo Brasil", text: "Envio em até 48h após confirmação." },
      { icon: "badge", title: "Empresa registrada (CNPJ)", text: "Operação 100% legal, com nota fiscal e atendimento humanizado." },
      { icon: "shield", title: "Garantia 12 Meses", text: "Contra defeitos." }
    ]
  },

  highlights: [
    "Frete grátis para todo o Brasil",
    "30 dias para devolver",
    "Garantia 12 meses contra defeitos",
    "Pix aprovado na hora"
  ],

  /* "Por que o Tapete Bandeja 3D é diferente?" */
  benefits: [
    { image: "images/beneficios/beneficio-1.webp", icon: "drop", title: "100% Impermeável", text: "Borracha TPE forma barreira completa. Borda elevada de 3cm a 5cm conforme o modelo retém tudo dentro do tapete.", points: ["Líquidos contidos pela borda", "Superfície antiderrapante", "Limpeza em segundos"] },
    { image: "images/beneficios/beneficio-2.webp", icon: "ruler", title: "100% Sob Medida", text: "Modelado para o assoalho exato do seu carro. Encaixe milimétrico sem folgas.", points: ["Cobertura total do assoalho", "Sem corte ou ajuste", "+500 modelos disponíveis"] },
    { image: "images/beneficios/beneficio-3.webp", icon: "pin2", title: "Fixação Original de Fábrica", text: "Encaixa nos pinos originais do seu veículo. Tapete fixo durante toda a direção.", points: ["Não desloca em frenagens", "Encaixe nos pinos originais", "Maior segurança"] },
    { image: "images/beneficios/beneficio-4.webp", icon: "shield", title: "Altíssima Durabilidade", text: "TPE injetada de alta qualidade. Não amassa, não racha, não descolore.", points: ["Resistente a UV", "Suporta uso diário intenso", "Borda mantém forma"] }
  ],

  specs: [
    ["Material", "Borracha TPE de Alta Densidade"],
    ["Espessura", "6mm"],
    ["Bordas", "Elevadas de 3cm a 5cm conforme o modelo"],
    ["Fixação", "Ilhós originais de fábrica"],
    ["Cobertura", "Assoalho completo sob medida"],
    ["Limpeza", "Lavável com água e sabão"],
    ["Garantia", "12 meses"],
    ["Cor", "Preto"],
    ["Aplicação", "+500 modelos de veículos"]
  ],

  faq: [
    ["O tapete serve para o meu carro?", "Sim! Temos tapetes desenvolvidos sob medida para mais de 500 modelos de veículos. Ao selecionar a marca, modelo e ano do seu carro, você garante o tapete perfeito para o assoalho do seu veículo."],
    ["Como é feita a fixação do tapete?", "Nossos tapetes possuem ilhós de fixação original de fábrica, que encaixam nos pinos que já existem no assoalho do seu carro. Isso garante que o tapete não deslize durante a direção."],
    ["O tapete é realmente 100% impermeável?", "Sim! O material borracha TPE de alta densidade forma uma barreira completa contra água, lama, líquidos e detritos. A borda elevada de 3cm a 5cm conforme o modelo contém tudo dentro do tapete."],
    ["Quanto tempo leva para chegar?", "O prazo médio de entrega é de 5 a 10 dias úteis após a confirmação do pagamento. Você receberá o código de rastreio por e-mail assim que o pedido for despachado."],
    ["E se o tapete não servir no meu carro?", "Você tem 30 dias corridos a partir do recebimento para solicitar a troca ou devolução sem qualquer custo. Basta entrar em contato com nosso suporte via WhatsApp."],
    ["Quais formas de pagamento são aceitas?", "Aceitamos cartão de crédito em 3x sem juros ou até 12x com juros, PIX, boleto bancário e transferência. Todas as transações são 100% seguras com criptografia SSL."],
    ["O tapete danifica o carpete original?", "Não! O tapete é projetado para PROTEGER o carpete original do seu veículo. Ele não cola, não risca e não danifica nada. Você pode removê-lo a qualquer momento sem deixar marcas."]
  ],

  /* Prazo exibido no "Calcular prazo de entrega" (texto do site atual). */
  shippingEstimate: "10 a 13 dias úteis",

  /* Depoimentos em vídeo (mesmos do site atual). */
  videos: [
    { src: "media/video-homem-1.mp4", poster: "images/posters/carlos-mendes.jpg", name: "Carlos Mendes" },
    { src: "media/video-mulher-1.mp4", poster: "images/posters/patricia-souza.jpg", name: "Patrícia Souza" },
    { src: "media/video-homem-2.mp4", poster: "images/posters/roberto-alves.jpg", name: "Roberto Alves" },
    { src: "media/video-mulher-2.mp4", poster: "images/posters/fernanda-costa.jpg", name: "Fernanda Costa" },
    { src: "media/video-homem-3.mp4", poster: "images/posters/lucas-pereira.jpg", name: "Lucas Pereira" },
    { src: "media/video-mulher-3.mp4", poster: "images/posters/mariana-santos.jpg", name: "Mariana Santos" }
  ],

  /* Fotos reais (fotos enviadas pelos clientes nas avaliações). */
  realPhotos: [
    { src: "images/clientes/marcos.webp", alt: "Foto enviada por Marcos Silva — VW Virtus 2022" },
    { src: "images/clientes/ana.webp", alt: "Foto enviada por Ana Ferreira — Fiat Pulse 2023" },
    { src: "images/clientes/ricardo.webp", alt: "Foto enviada por Ricardo Oliveira — Toyota Hilux 2021" },
    { src: "images/clientes/camila.webp", alt: "Foto enviada por Camila Lima — Hyundai Creta 2023" },
    { src: "images/clientes/fernando.webp", alt: "Foto enviada por Fernando Gomes — Chevrolet Tracker 2022" },
    { src: "images/clientes/juliana.webp", alt: "Foto enviada por Juliana Bastos — Jeep Compass 2023" },
    { src: "images/clientes/trunk.webp", alt: "Foto enviada por Paulo Lopes — Chery Tiggo 7 2024" }
  ],

  /* Avaliações do site atual (nenhuma nova). */
  reviews: [
    { name: "Marcos Silva", city: "São Paulo, SP", car: "VW Virtus 2022", stars: 5, date: "2026-03-12", avatar: "images/avaliacoes/marcos.webp", photo: "images/clientes/marcos.webp", text: "Encaixou perfeitinho! A borda segurou até o café que derrubei na correria. Muito melhor que tapete universal." },
    { name: "Ana Ferreira", city: "Belo Horizonte, MG", car: "Fiat Pulse 2023", stars: 5, date: "2026-02-28", avatar: "images/avaliacoes/ana.webp", photo: "images/clientes/ana.webp", text: "Tenho dois filhos e meu carro vivia imundo. Agora limpo em 2 minutos. Instalou super fácil!" },
    { name: "Ricardo Oliveira", city: "Curitiba, PR", car: "Toyota Hilux 2021", stars: 5, date: "2026-03-05", avatar: "images/avaliacoes/ricardo.webp", photo: "images/clientes/ricardo.webp", text: "Uso em obra, entra muita lama. Já lavei 30 vezes e tá igual. Nunca vi tapete tão resistente." },
    { name: "Camila Lima", city: "Rio de Janeiro, RJ", car: "Hyundai Creta 2023", stars: 5, date: "2026-03-18", avatar: "images/avaliacoes/camila.webp", photo: "images/clientes/camila.webp", text: "Chegou rápido, embalado perfeitamente. Encaixe na primeira tentativa. Indiquei para 3 amigas!" },
    { name: "Fernando Gomes", city: "Fortaleza, CE", car: "Chevrolet Tracker 2022", stars: 5, date: "2026-02-22", avatar: "images/avaliacoes/fernando.webp", photo: "images/clientes/fernando.webp", text: "Aqui chove muito e sempre entrava lama. Desde que coloquei acabou o problema. Entrega rápida!" },
    { name: "Juliana Bastos", city: "Porto Alegre, RS", car: "Jeep Compass 2023", stars: 5, date: "2026-04-01", avatar: "images/avaliacoes/juliana.webp", photo: "images/clientes/juliana.webp", text: "Tenho cachorro e o carro ficava cheio de pelo. Agora é só tirar e lavar. Parece peça original!" },
    { name: "Paulo Lopes", city: "Campinas, SP", car: "Chery Tiggo 7 2024", stars: 5, date: "2026-04-08", avatar: "images/avaliacoes/paulo.webp", photo: "images/clientes/trunk.webp", text: "Porta-malas ficou 100% protegido. Encaixe perfeito, parece peça original. Recomendo demais!" }
  ],

  /* Aviso "fulano comprou" (mesma lista do site atual). */
  salesNotifications: [
    ["João M.", "Curitiba, PR", "Kit Interno + Porta-Malas", "há 2 minutos"],
    ["Mariana S.", "São Paulo, SP", "Kit Tapetes Interno", "há 5 minutos"],
    ["Ricardo A.", "Belo Horizonte, MG", "Kit Interno + Caçamba", "há 8 minutos"],
    ["Patrícia L.", "Florianópolis, SC", "Kit Interno + Porta-Malas", "há 11 minutos"],
    ["Carlos E.", "Porto Alegre, RS", "Kit Tapetes Interno", "há 14 minutos"],
    ["Fernanda R.", "Rio de Janeiro, RJ", "Kit Interno + Porta-Malas", "há 18 minutos"],
    ["Lucas P.", "Goiânia, GO", "Kit Interno + Caçamba", "há 22 minutos"],
    ["Juliana B.", "Campinas, SP", "Kit Tapetes Interno", "há 27 minutos"],
    ["André T.", "Salvador, BA", "Kit Interno + Porta-Malas", "há 33 minutos"],
    ["Camila O.", "Fortaleza, CE", "Kit Interno + Porta-Malas", "há 41 minutos"]
  ]
};
