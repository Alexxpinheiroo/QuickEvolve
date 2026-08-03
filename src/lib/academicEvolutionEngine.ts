/**
 * Sistema Completo de Cadastramento, Admissão e Evolução POO
 * SPARTAN ACADEMY: O Caminho do Guerreiro Acadêmico
 */

export interface CursoInfo {
  nome: string;
  dominio: number;
  velocidade: number;
  resistencia: number;
  focoArea: string;
}

export const CURSOS_SPARTAN: Record<string, CursoInfo> = {
  'Direito & Leis': {
    nome: 'Direito & Leis',
    dominio: 15,
    velocidade: 10,
    resistencia: 20,
    focoArea: 'Legislação, Doutrina e Jurisprudência STF/STJ'
  },
  'Exatas (Matemática/Física)': {
    nome: 'Exatas (Matemática/Física)',
    dominio: 20,
    velocidade: 8,
    resistencia: 15,
    focoArea: 'Raciocínio Lógico, Estatística e Cálculos Avançados'
  },
  'Humanas (História/Geografia)': {
    nome: 'Humanas (História/Geografia)',
    dominio: 12,
    velocidade: 12,
    resistencia: 18,
    focoArea: 'Geopolítica, História do Brasil e Análise Crítica'
  },
  'Linguagens (Português/Inglês)': {
    nome: 'Linguagens (Português/Inglês)',
    dominio: 18,
    velocidade: 15,
    resistencia: 12,
    focoArea: 'Gramática Normativa, Semântica e Redação Oficial'
  },
  'Tecnologia (TI/Programação)': {
    nome: 'Tecnologia (TI/Programação)',
    dominio: 25,
    velocidade: 5,
    resistencia: 10,
    focoArea: 'Engenharia de Software, Bancos de Dados e Segurança'
  },
  'Saúde (Biologia/Medicina)': {
    nome: 'Saúde (Biologia/Medicina)',
    dominio: 10,
    velocidade: 10,
    resistencia: 25,
    focoArea: 'Anatomia, Saúde Pública e Bioética'
  }
};

export class Materia {
  nome: string;
  foco: string;
  nivel: number;
  questoesAcertadas: number;
  questoesErradas: number;
  progressoPontos: number;

  constructor(nome: string, foco: string) {
    this.nome = nome;
    this.foco = foco;
    this.nivel = 1;
    this.questoesAcertadas = 0;
    this.questoesErradas = 0;
    this.progressoPontos = 0;
  }

  calcularPontosNecessarios(): number {
    return Math.max(7, Math.round(this.nivel * 10 * (this.nivel / 1.5)));
  }

  resolverQuestao(acertou: boolean): { subiuDeNivel: boolean; pontosGanhos: number; novoNivel: number } {
    let subiuDeNivel = false;
    let pontosGanhos = 0;

    if (acertou) {
      this.questoesAcertadas += 1;
      pontosGanhos = 1;
      this.progressoPontos += 1;
    } else {
      this.questoesErradas += 1;
      pontosGanhos = -0.5;
      this.progressoPontos = Math.max(0, this.progressoPontos - 0.5);
    }

    const pontosNecessarios = this.calcularPontosNecessarios();

    if (this.progressoPontos >= pontosNecessarios && this.nivel < 100) {
      this.progressoPontos -= pontosNecessarios;
      this.nivel += 1;
      subiuDeNivel = true;
    }

    return { subiuDeNivel, pontosGanhos, novoNivel: this.nivel };
  }

  getPorcentagemProgresso(): number {
    const pontosNecessarios = this.calcularPontosNecessarios();
    return Math.min(100, Math.round((this.progressoPontos / pontosNecessarios) * 100));
  }

  gerarBarraProgressoTexto(largura: number = 10): string {
    const pct = this.getPorcentagemProgresso();
    const preenchido = Math.round((pct / 100) * largura);
    const vazio = largura - preenchido;
    const barra = '#'.repeat(preenchido) + '-'.repeat(vazio);
    return `${this.nome.padEnd(25)} [${barra}] ${pct.toString().padStart(3)}% (Nível ${this.nivel})`;
  }
}

// Classe base: Candidato
export class Candidato {
  nomeCompleto: string;
  apelidoGuerra: string;
  idade: number;
  cidadeEstado: string;
  cursoEscolha: string;
  escolhaFilosofica: number;
  espiritoGuerreiro: number;

  constructor(
    nomeCompleto: string = '',
    apelidoGuerra: string = '',
    idade: number = 18,
    cidadeEstado: string = '',
    cursoEscolha: string = 'Direito & Leis',
    escolhaFilosofica: number = 4
  ) {
    this.nomeCompleto = nomeCompleto;
    this.apelidoGuerra = apelidoGuerra;
    this.idade = idade;
    this.cidadeEstado = cidadeEstado;
    this.cursoEscolha = cursoEscolha;
    this.escolhaFilosofica = escolhaFilosofica;

    // Pontuação de Espírito Guerreiro com base na pergunta filosófica:
    // 1 -> 5, 2 -> 10, 3 -> 20, 4 -> 15
    switch (Number(escolhaFilosofica)) {
      case 1: this.espiritoGuerreiro = 5; break;
      case 2: this.espiritoGuerreiro = 10; break;
      case 3: this.espiritoGuerreiro = 20; break;
      case 4: default: this.espiritoGuerreiro = 15; break;
    }
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];
    if (!this.nomeCompleto || this.nomeCompleto.trim().length < 3) {
      erros.push('Nome Completo deve conter no mínimo 3 caracteres.');
    }
    if (!this.apelidoGuerra || this.apelidoGuerra.trim().length < 2) {
      erros.push('Apelido de Guerra é obrigatório (mínimo 2 letras).');
    }
    if (!this.idade || this.idade < 14) {
      erros.push('O candidato deve possuir no mínimo 14 anos.');
    }
    if (!CURSOS_SPARTAN[this.cursoEscolha]) {
      erros.push('Selecione uma especialização de guerra válida.');
    }
    return { valido: erros.length === 0, erros };
  }
}

// Classe herdeira: Guerreiro (POO - Herança de Candidato)
export class Guerreiro extends Candidato {
  dominio: number;
  velocidade: number;
  resistencia: number;
  intuicao: number;
  materias: Map<string, Materia>;
  juramentoAssinado: boolean;
  dataAdmissao: string;
  
  // Status de Teste de Fogo (XP Duplo)
  testeDeFogoAtivo: boolean;
  tempoRestanteFogo: number; // minutos

  // Prestígio
  ciclosRevisao: number;
  multiplicadorAtributos: number;

  constructor(candidato?: Candidato) {
    super(
      candidato?.nomeCompleto || 'Leonidas da Silva',
      candidato?.apelidoGuerra || 'SpartanX',
      candidato?.idade || 25,
      candidato?.cidadeEstado || 'Sparta / BR',
      candidato?.cursoEscolha || 'Direito & Leis',
      candidato?.escolhaFilosofica || 4
    );

    const curso = CURSOS_SPARTAN[this.cursoEscolha] || CURSOS_SPARTAN['Direito & Leis'];

    // Atributos base vindos do Curso + Bônus de Espírito Guerreiro
    this.dominio = curso.dominio + Math.round(this.espiritoGuerreiro / 2);
    this.velocidade = curso.velocidade + Math.round(this.espiritoGuerreiro / 3);
    this.resistencia = curso.resistencia + this.espiritoGuerreiro;
    this.intuicao = 10 + Math.round(this.espiritoGuerreiro / 2);

    this.juramentoAssinado = false;
    this.dataAdmissao = new Date().toLocaleDateString('pt-BR');
    this.testeDeFogoAtivo = false;
    this.tempoRestanteFogo = 0;

    this.ciclosRevisao = 0;
    this.multiplicadorAtributos = 1.0;

    // Inicialização das 4 Matérias Pilares com Foco na Área
    this.materias = new Map<string, Materia>();
    this.materias.set('Língua Portuguesa & Redação', new Materia('Língua Portuguesa & Redação', 'Gramática e Texto'));
    this.materias.set('Raciocínio Lógico & Exatas', new Materia('Raciocínio Lógico & Exatas', 'Lógica e Números'));
    this.materias.set('Direito & Legislação Especial', new Materia('Direito & Legislação Especial', 'Normas e Doutrina'));
    this.materias.set(`Especialidade: ${this.cursoEscolha}`, new Materia(`Especialidade: ${this.cursoEscolha}`, curso.focoArea));
  }

  getNivelGeral(): number {
    let somaNiveis = 0;
    this.materias.forEach((m) => { somaNiveis += m.nivel; });
    return Math.floor(somaNiveis / this.materias.size);
  }

  getTituloRank(): string {
    const nivel = this.getNivelGeral();
    let tituloBase = '';

    if (nivel >= 100) tituloBase = 'APROVADO! (Transcendeu a Academia)';
    else if (nivel >= 75) tituloBase = 'Spartan Lenda Viva (Insuperável)';
    else if (nivel >= 50) tituloBase = 'Comandante de Falange (Estrategista)';
    else if (nivel >= 25) tituloBase = 'Guerreiro de Elite (Forjado no Fogo)';
    else if (nivel >= 10) tituloBase = 'Hoplita Veterano (Inabalável)';
    else if (nivel >= 5) tituloBase = 'Recruta Determinado (Em Evolução)';
    else tituloBase = 'Estagiário Guerreiro (Nível 1)';

    if (this.ciclosRevisao > 0) {
      return `[Glória ${this.ciclosRevisao}x] ${tituloBase}`;
    }
    return tituloBase;
  }

  getFraseJuramentoEsperada(): string {
    return `EU, ${this.apelidoGuerra.toUpperCase().trim()}, JUBILO MINHA VIDA AO CONHECIMENTO E NUNCA DESISTIREI.`;
  }

  getTotalAcertos(): number {
    let total = 0;
    this.materias.forEach((m) => { total += m.questoesAcertadas; });
    return total;
  }

  getTotalErros(): number {
    let total = 0;
    this.materias.forEach((m) => { total += m.questoesErradas; });
    return total;
  }

  aplicarEvolucaoAtributos(niveisGanhos: number) {
    if (niveisGanhos <= 0) return;
    this.dominio += Math.round(5 * niveisGanhos * this.multiplicadorAtributos);
    this.velocidade += Math.round(3 * niveisGanhos * this.multiplicadorAtributos);
    this.resistencia += Math.round(20 * niveisGanhos * this.multiplicadorAtributos);
    this.intuicao += Math.round(10 * niveisGanhos * this.multiplicadorAtributos);
  }

  // Desafio Especial: Teste de Fogo (Dobra XP)
  ativarTesteDeFogo(): string {
    this.testeDeFogoAtivo = true;
    this.tempoRestanteFogo = 60; // 60 min
    return `🔥 [TESTE DE FOGO ATIVADO!] Pelas próximas 1 hora, os pontos de experiência e foco serão DOBRADOS! Prepare o escudo e lute!`;
  }

  executarRevisaoRefinamento(): { sucesso: boolean; mensagem: string } {
    const nivelGeral = this.getNivelGeral();

    if (nivelGeral < 100) {
      return {
        sucesso: false,
        mensagem: `Ainda não é possível realizar a Revisão Periódica! Você está no Nível ${nivelGeral}. É necessário atingir o Nível 100 (APROVADO).`
      };
    }

    this.ciclosRevisao += 1;
    this.multiplicadorAtributos *= 1.5;
    this.dominio = Math.round(this.dominio * 1.5);
    this.velocidade = Math.round(this.velocidade * 1.5);
    this.resistencia = Math.round(this.resistencia * 1.5);
    this.intuicao = Math.round(this.intuicao * 1.5);

    this.materias.forEach((m) => {
      m.nivel = 1;
      m.progressoPontos = 0;
    });

    return {
      sucesso: true,
      mensagem: `✨ REVISÃO PERIÓDICA CONCLUÍDA! Nível resetado para 1. Atributos multiplicados por 1.5x! Título: ${this.getTituloRank()}`
    };
  }

  // Serialização para salvar e carregar JSON no localStorage
  toJSON() {
    const materiasObj: Record<string, any> = {};
    this.materias.forEach((mat, key) => {
      materiasObj[key] = {
        nome: mat.nome,
        foco: mat.foco,
        nivel: mat.nivel,
        questoesAcertadas: mat.questoesAcertadas,
        questoesErradas: mat.questoesErradas,
        progressoPontos: mat.progressoPontos,
      };
    });

    return {
      nomeCompleto: this.nomeCompleto,
      apelidoGuerra: this.apelidoGuerra,
      idade: this.idade,
      cidadeEstado: this.cidadeEstado,
      cursoEscolha: this.cursoEscolha,
      escolhaFilosofica: this.escolhaFilosofica,
      espiritoGuerreiro: this.espiritoGuerreiro,
      dominio: this.dominio,
      velocidade: this.velocidade,
      resistencia: this.resistencia,
      intuicao: this.intuicao,
      juramentoAssinado: this.juramentoAssinado,
      dataAdmissao: this.dataAdmissao,
      ciclosRevisao: this.ciclosRevisao,
      multiplicadorAtributos: this.multiplicadorAtributos,
      materias: materiasObj
    };
  }

  static fromJSON(data: any): Guerreiro {
    const candidato = new Candidato(
      data.nomeCompleto,
      data.apelidoGuerra,
      data.idade,
      data.cidadeEstado,
      data.cursoEscolha,
      data.escolhaFilosofica
    );
    const g = new Guerreiro(candidato);
    g.espiritoGuerreiro = data.espiritoGuerreiro || candidato.espiritoGuerreiro;
    g.dominio = data.dominio || g.dominio;
    g.velocidade = data.velocidade || g.velocidade;
    g.resistencia = data.resistencia || g.resistencia;
    g.intuicao = data.intuicao || g.intuicao;
    g.juramentoAssinado = !!data.juramentoAssinado;
    g.dataAdmissao = data.dataAdmissao || g.dataAdmissao;
    g.ciclosRevisao = data.ciclosRevisao || 0;
    g.multiplicadorAtributos = data.multiplicadorAtributos || 1.0;

    if (data.materias) {
      g.materias.clear();
      Object.keys(data.materias).forEach((key) => {
        const mData = data.materias[key];
        const m = new Materia(mData.nome, mData.foco);
        m.nivel = mData.nivel;
        m.questoesAcertadas = mData.questoesAcertadas;
        m.questoesErradas = mData.questoesErradas;
        m.progressoPontos = mData.progressoPontos;
        g.materias.set(key, m);
      });
    }

    return g;
  }
}

// Class SistemaAdmissao
export class SistemaAdmissao {
  candidatoAtual: Candidato;
  tentativasJuramento: number;

  constructor() {
    this.candidatoAtual = new Candidato();
    this.tentativasJuramento = 3;
  }

  iniciarCadastro(
    nomeCompleto: string,
    apelidoGuerra: string,
    idade: number,
    cidadeEstado: string,
    cursoEscolha: string,
    escolhaFilosofica: number
  ): { sucesso: boolean; erros: string[]; guerreiro?: Guerreiro } {
    const cand = new Candidato(nomeCompleto, apelidoGuerra, idade, cidadeEstado, cursoEscolha, escolhaFilosofica);
    const val = cand.validarDados();

    if (!val.valido) {
      return { sucesso: false, erros: val.erros };
    }

    this.candidatoAtual = cand;
    const guerreiro = new Guerreiro(cand);
    return { sucesso: true, erros: [], guerreiro };
  }

  validarJuramento(textoDigitado: string, guerreiro: Guerreiro): { sucesso: boolean; mensagem: string; tentativasRestantes: number } {
    const fraseEsperada = guerreiro.getFraseJuramentoEsperada().trim().toUpperCase();
    const digitadoNormalizado = textoDigitado.trim().toUpperCase();

    if (digitadoNormalizado === fraseEsperada) {
      guerreiro.juramentoAssinado = true;
      return {
        sucesso: true,
        mensagem: `[SOM DE TROVÃO] 🌩️ JURAMENTO ACEITO PELO MESTRE! Bem-vindo à Spartan Academy, ${guerreiro.apelidoGuerra}!`,
        tentativasRestantes: this.tentativasJuramento
      };
    } else {
      this.tentativasJuramento -= 1;
      return {
        sucesso: false,
        mensagem: `❌ "Sua determinação falhou. O juramento deve ser exatamente como escrito." (Tentativas restantes: ${this.tentativasJuramento})`,
        tentativasRestantes: Math.max(0, this.tentativasJuramento)
      };
    }
  }
}

// Class SistemaEvolucao
export class SistemaEvolucao {
  guerreiro: Guerreiro;
  logsTerminal: string[];

  constructor(guerreiro: Guerreiro) {
    this.guerreiro = guerreiro;
    this.logsTerminal = [
      `🏛️ [SPARTAN ACADEMY] Sistema de Evolução POO ativo para Guerreiro: ${guerreiro.apelidoGuerra}`,
      `⚔️ Especialização: ${guerreiro.cursoEscolha} | Nível Inicial: ${guerreiro.getNivelGeral()}`,
      `🔥 Espírito Guerreiro: ${guerreiro.espiritoGuerreiro} pt | Frase de Guerra Pronta!`
    ];
  }

  log(msg: string) {
    this.logsTerminal.unshift(msg);
    if (this.logsTerminal.length > 50) this.logsTerminal.pop();
  }

  obterMensagemMestre(): string {
    const nivel = this.guerreiro.getNivelGeral();
    if (nivel >= 100) return '🗣️ Mestre: "APROVADO! Você transcendeu. Agora ensine os outros." 🏆';
    if (nivel >= 75) return '🗣️ Mestre: "Poucos chegaram até aqui. Você é uma lenda viva." ⚔️';
    if (nivel >= 50) return '🗣️ Mestre: "Metade do caminho. O Mestre está orgulhoso." 🛡️';
    if (nivel >= 25) return '🗣️ Mestre: "Você está começando a cheirar a vitória. Não pare." 🔥';
    if (nivel >= 10) return '🗣️ Mestre: "Seu primeiro teste foi superado. Agora a dor começa de verdade." 🗡️';
    if (nivel >= 5) return '🗣️ Mestre: "Você está evoluindo, mas ainda é frágil. Continue." ⚡';
    return '🗣️ Mestre: "Aqui não há derrota, apenas lições. Levante-se e lute." 🏛️';
  }

  resolverQuestao(nomeMateria: string, acertou: boolean): { mensagem: string; subiuNivel: boolean; mensagemMestre?: string } {
    const materia = this.guerreiro.materias.get(nomeMateria);
    if (!materia) {
      return { mensagem: `⚠️ Matéria não encontrada!`, subiuNivel: false };
    }

    const nivelAnterior = this.guerreiro.getNivelGeral();
    const mult = this.guerreiro.testeDeFogoAtivo ? 2 : 1;
    const res = materia.resolverQuestao(acertou);

    let msg = '';
    if (acertou) {
      msg = `[SOM DE ESPADAS] 🗡️ ACERTO TÁTICO! +${1 * mult} Ponto em ${materia.nome}. (${materia.progressoPontos}/${materia.calcularPontosNecessarios()} pt).`;
    } else {
      msg = `[ROSNADO DO MESTRE] ❌ ERRO DE COMBATE! -0.5 Ponto debitado em ${materia.nome}. Foco atual: ${materia.progressoPontos} pt.`;
    }

    const novoNivel = this.guerreiro.getNivelGeral();
    let subiu = false;
    let msgMestre = undefined;

    if (res.subiuDeNivel) {
      msg += ` 🎉 EVOLUÇÃO EM ${materia.nome.toUpperCase()}! Subiu para Nível ${materia.nivel}!`;
      if (novoNivel > nivelAnterior) {
        subiu = true;
        this.guerreiro.aplicarEvolucaoAtributos(novoNivel - nivelAnterior);
        msg += ` 🚀 [TOCAR DE CORNETAS] 🎺 PATENTE SPARTAN AUMENTADA PARA NÍVEL ${novoNivel}! (${this.guerreiro.getTituloRank()})`;
        msgMestre = this.obterMensagemMestre();
      }
    }

    this.log(msg);
    return { mensagem: msg, subiuNivel: subiu, mensagemMestre: msgMestre };
  }

  simularSimulado(): { acertos: number; erros: number; xp: number; resumo: string } {
    const materiasKeys = Array.from(this.guerreiro.materias.keys());
    let acertos = 0;
    let erros = 0;

    for (let i = 0; i < 10; i++) {
      const key = materiasKeys[Math.floor(Math.random() * materiasKeys.length)];
      const chance = Math.min(0.92, 0.5 + (this.guerreiro.dominio / 800));
      const acertou = Math.random() < chance;
      if (acertou) acertos++; else erros++;
      this.resolverQuestao(key, acertou);
    }

    const mult = this.guerreiro.testeDeFogoAtivo ? 2 : 1;
    const xp = acertos * 25 * mult;
    const resumo = `[MARCHA DOS GUERREIROS] 🛡️ SIMULADO CONCLUÍDO! Resultado: ${acertos}/10 Acertos (${erros} Erros). XP de Combate: +${xp} XP!`;
    this.log(resumo);
    return { acertos, erros, xp, resumo };
  }

  executarChamadoDoMestre(respostaOpcao: number): { acertou: boolean; mensagem: string } {
    const respostaCorreta = 2; // Opção correta no desafio surpresa
    if (respostaOpcao === respostaCorreta) {
      this.guerreiro.dominio += 10;
      this.guerreiro.espiritoGuerreiro += 5;
      const msg = `[SOM DE TRIUNFO] 🏆 RESPOSTA MAGISTRAL! O Mestre abençoou sua sabedoria! +10 Domínio e +5 Espírito Guerreiro!`;
      this.log(msg);
      return { acertou: true, mensagem: msg };
    } else {
      this.guerreiro.resistencia = Math.max(10, this.guerreiro.resistencia - 5);
      const msg = `[ROSNADO DO MESTRE] ⚡ "ERRADO! Pague 20 flexões mentais!" -5 Resistência. Releia a legislação!`;
      this.log(msg);
      return { acertou: false, mensagem: msg };
    }
  }

  obterRankingGlobal(): Array<{ posicao: number; nome: string; titulo: string; nivel: number; acertos: number }> {
    const ranking = [
      { posicao: 1, nome: this.guerreiro.apelidoGuerra, titulo: this.guerreiro.getTituloRank(), nivel: this.guerreiro.getNivelGeral(), acertos: this.guerreiro.getTotalAcertos() },
      { posicao: 2, nome: 'Leonidas_SP', titulo: 'Comandante de Falange', nivel: 48, acertos: 380 },
      { posicao: 3, nome: 'Atena_Leges', titulo: 'Guerreira de Elite', nivel: 34, acertos: 290 },
      { posicao: 4, nome: 'Esfinge_Juridica', titulo: 'Hoplita Veterano', nivel: 19, acertos: 145 },
      { posicao: 5, nome: 'Spartan_Zero', titulo: 'Recruta Determinado', nivel: 8, acertos: 62 },
    ];

    ranking.sort((a, b) => b.nivel - a.nivel || b.acertos - a.acertos);
    ranking.forEach((r, idx) => { r.posicao = idx + 1; });
    return ranking;
  }
}
