// src/ia/materialMapping.ts

export type MaterialBase =
  | 'plastico'
  | 'vidro'
  | 'metal'
  | 'papel'
  | 'organico'
  | 'eletronico'
  | 'nao_reciclavel';

export type MaterialMapEntry = {
  labelPt: string;
  materialBase: MaterialBase;
  reciclavel: boolean;
};

export const MATERIAL_MAP: Record<string, MaterialMapEntry> = {
  // ------------------------
  // PLÁSTICO
  // ------------------------
  'water bottle': {
    labelPt: 'garrafa plástica',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'plastic bottle': {
    labelPt: 'garrafa plástica',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'pop bottle': {
    labelPt: 'garrafa de refrigerante (plástica)',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'soda bottle': {
    labelPt: 'garrafa de refrigerante (plástica)',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'plastic bag': {
    labelPt: 'sacola plástica',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'grocery bag': {
    labelPt: 'sacola de supermercado (plástica)',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'packet': {
    labelPt: 'embalagem plástica',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'plastic wrap': {
    labelPt: 'filme plástico',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'plastic cup': {
    labelPt: 'copo plástico',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'coffee cup': {
    labelPt: 'copo descartável',
    materialBase: 'plastico',
    reciclavel: false, // mistura papel + plástico, muitas vezes não aceito
  },
  'disposable cup': {
    labelPt: 'copo descartável',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'plate': {
    labelPt: 'prato descartável (plástico)',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'plastic plate': {
    labelPt: 'prato descartável (plástico)',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'fork': {
    labelPt: 'garfo plástico',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'spoon': {
    labelPt: 'colher plástica',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'knife': {
    labelPt: 'faca plástica descartável',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'toothbrush': {
    labelPt: 'escova de dente (plástico)',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'pen': {
    labelPt: 'caneta (plástico/metal)',
    materialBase: 'nao_reciclavel',
    reciclavel: false,
  },

  // ------------------------
  // VIDRO
  // ------------------------
  'bottle': {
    labelPt: 'garrafa',
    materialBase: 'vidro',
    reciclavel: true,
  },
  'beer bottle': {
    labelPt: 'garrafa de vidro (cerveja)',
    materialBase: 'vidro',
    reciclavel: true,
  },
  'wine bottle': {
    labelPt: 'garrafa de vinho (vidro)',
    materialBase: 'vidro',
    reciclavel: true,
  },
  'glass': {
    labelPt: 'copo de vidro',
    materialBase: 'vidro',
    reciclavel: true,
  },
  'goblet': {
    labelPt: 'taça de vidro',
    materialBase: 'vidro',
    reciclavel: true,
  },
  'jar': {
    labelPt: 'pote de vidro',
    materialBase: 'vidro',
    reciclavel: true,
  },

  // ------------------------
  // METAL
  // ------------------------
  'can': {
    labelPt: 'lata',
    materialBase: 'metal',
    reciclavel: true,
  },
  'tin can': {
    labelPt: 'lata metálica',
    materialBase: 'metal',
    reciclavel: true,
  },
  'soda can': {
    labelPt: 'lata de refrigerante',
    materialBase: 'metal',
    reciclavel: true,
  },
  'beer can': {
    labelPt: 'lata de cerveja',
    materialBase: 'metal',
    reciclavel: true,
  },
  'aluminum can': {
    labelPt: 'lata de alumínio',
    materialBase: 'metal',
    reciclavel: true,
  },
  'metal can': {
    labelPt: 'lata metálica',
    materialBase: 'metal',
    reciclavel: true,
  },
  'pop can': {
    labelPt: 'lata de refrigerante',
    materialBase: 'metal',
    reciclavel: true,
  },
  'screw': {
    labelPt: 'parafuso (metal)',
    materialBase: 'metal',
    reciclavel: true,
  },
  'nail': {
    labelPt: 'prego (metal)',
    materialBase: 'metal',
    reciclavel: true,
  },
  'spatula': {
    labelPt: 'espátula metálica',
    materialBase: 'metal',
    reciclavel: true,
  },

  // ------------------------
  // PAPEL / PAPELÃO
  // ------------------------
  'carton': {
    labelPt: 'embalagem cartonada',
    materialBase: 'papel',
    reciclavel: true,
  },
  'cardboard': {
    labelPt: 'papelão',
    materialBase: 'papel',
    reciclavel: true,
  },
  'cardboard box': {
    labelPt: 'caixa de papelão',
    materialBase: 'papel',
    reciclavel: true,
  },
  'paper towel': {
    labelPt: 'papel toalha',
    materialBase: 'papel',
    reciclavel: false, // geralmente sujo / não aceito
  },
  'toilet tissue': {
    labelPt: 'papel higiênico',
    materialBase: 'papel',
    reciclavel: false,
  },
  'tissue': {
    labelPt: 'lenço de papel',
    materialBase: 'papel',
    reciclavel: false,
  },
  'newspaper': {
    labelPt: 'jornal',
    materialBase: 'papel',
    reciclavel: true,
  },
  'book': {
    labelPt: 'livro',
    materialBase: 'papel',
    reciclavel: true,
  },
  'notebook': {
    labelPt: 'caderno',
    materialBase: 'papel',
    reciclavel: true,
  },
  'envelope': {
    labelPt: 'envelope de papel',
    materialBase: 'papel',
    reciclavel: true,
  },
  'paper plate': {
    labelPt: 'prato de papel',
    materialBase: 'papel',
    reciclavel: false,
  },
  'paper napkin': {
    labelPt: 'guardanapo de papel',
    materialBase: 'papel',
    reciclavel: false,
  },

  // ------------------------
  // ORGÂNICO
  // ------------------------
  'banana': {
    labelPt: 'banana',
    materialBase: 'organico',
    reciclavel: false,
  },
  'banana peel': {
    labelPt: 'casca de banana',
    materialBase: 'organico',
    reciclavel: false,
  },
  'apple': {
    labelPt: 'maçã',
    materialBase: 'organico',
    reciclavel: false,
  },
  'orange': {
    labelPt: 'laranja',
    materialBase: 'organico',
    reciclavel: false,
  },
  'lemon': {
    labelPt: 'limão',
    materialBase: 'organico',
    reciclavel: false,
  },
  'tomato': {
    labelPt: 'tomate',
    materialBase: 'organico',
    reciclavel: false,
  },
  'cucumber': {
    labelPt: 'pepino',
    materialBase: 'organico',
    reciclavel: false,
  },
  'carrot': {
    labelPt: 'cenoura',
    materialBase: 'organico',
    reciclavel: false,
  },
  'broccoli': {
    labelPt: 'brócolis',
    materialBase: 'organico',
    reciclavel: false,
  },
  'cauliflower': {
    labelPt: 'couve-flor',
    materialBase: 'organico',
    reciclavel: false,
  },
  'pizza': {
    labelPt: 'pizza (resto de comida)',
    materialBase: 'organico',
    reciclavel: false,
  },
  'hamburger': {
    labelPt: 'hambúrguer',
    materialBase: 'organico',
    reciclavel: false,
  },

  // ------------------------
  // ELETRÔNICO
  // ------------------------
  'cell phone': {
    labelPt: 'celular',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'mobile phone': {
    labelPt: 'celular',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'smartphone': {
    labelPt: 'smartphone',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'computer': {
    labelPt: 'computador',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'laptop': {
    labelPt: 'notebook',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'keyboard': {
    labelPt: 'teclado',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'mouse': {
    labelPt: 'mouse',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'monitor': {
    labelPt: 'monitor',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'television': {
    labelPt: 'televisão',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'remote control': {
    labelPt: 'controle remoto',
    materialBase: 'eletronico',
    reciclavel: true,
  },
  'printer': {
    labelPt: 'impressora',
    materialBase: 'eletronico',
    reciclavel: true,
  },

  // ------------------------
  // NÃO RECICLÁVEL / DÚVIDOSOS
  // ------------------------
  'plastic fork': {
    labelPt: 'garfo plástico descartável',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'plastic spoon': {
    labelPt: 'colher plástica descartável',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'plastic knife': {
    labelPt: 'faca plástica descartável',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'straw': {
    labelPt: 'canudo plástico',
    materialBase: 'plastico',
    reciclavel: false,
  },
  'cigarette': {
    labelPt: 'bituca de cigarro',
    materialBase: 'nao_reciclavel',
    reciclavel: false,
  },
  'diaper': {
    labelPt: 'fralda descartável',
    materialBase: 'nao_reciclavel',
    reciclavel: false,
  },
  'syringe': {
    labelPt: 'seringa',
    materialBase: 'nao_reciclavel',
    reciclavel: false,
  },
  'battery': {
    labelPt: 'pilha/bateria',
    materialBase: 'nao_reciclavel', // coleta especial
    reciclavel: false,
  },
  'light bulb': {
    labelPt: 'lâmpada',
    materialBase: 'nao_reciclavel', // ponto específico
    reciclavel: false,
  },
  'shoe': {
    labelPt: 'sapato',
    materialBase: 'nao_reciclavel',
    reciclavel: false,
  },
  'tire': {
    labelPt: 'pneu',
    materialBase: 'nao_reciclavel',
    reciclavel: false,
  },

  // ------------------------
  // FALLBACKS GENÉRICOS (CASO O LABEL VENHA MUITO GENÉRICO)
  // ------------------------
  'bottlecap': {
    labelPt: 'tampa de garrafa (plástico/metal)',
    materialBase: 'plastico',
    reciclavel: true,
  },
  'pack': {
    labelPt: 'embalagem',
    materialBase: 'nao_reciclavel',
    reciclavel: false,
  },
  'packet of chips': {
    labelPt: 'pacote de salgadinho',
    materialBase: 'plastico',
    reciclavel: false,
  },
};