import React, { useState, useEffect } from 'react';
import {
  Guerreiro,
  Materia,
  SistemaAdmissao,
  SistemaEvolucao,
  CURSOS_SPARTAN
} from '../lib/academicEvolutionEngine';
import { fireConfetti, fireLevelUpCelebration } from '../lib/confetti';

interface AcademicEvolutionRPGViewProps {
  userName?: string;
}

type EtapaSistema = 'boas_vindas' | 'recusado' | 'cadastro' | 'certificado_juramento' | 'menu_guerreiro';

const SPARTAN_LOCALSTORAGE_KEY = 'spartan_academy_guerreiro_data_v2';

export const AcademicEvolutionRPGView: React.FC<AcademicEvolutionRPGViewProps> = ({ userName = '' }) => {
  // System Instances
  const [sistemaAdmissao] = useState<SistemaAdmissao>(() => new SistemaAdmissao());
  const [guerreiro, setGuerreiro] = useState<Guerreiro | null>(null);
  const [sistemaEvolucao, setSistemaEvolucao] = useState<SistemaEvolucao | null>(null);

  // App Stage Control
  const [etapa, setEtapa] = useState<EtapaSistema>('boas_vindas');

  // Form States for Admission
  const [formNome, setFormNome] = useState(userName || '');
  const [formApelido, setFormApelido] = useState(userName ? userName.split(' ')[0] : '');
  const [formIdade, setFormIdade] = useState<number>(22);
  const [formCidade, setFormCidade] = useState('São Paulo / SP');
  const [formCurso, setFormCurso] = useState('Direito & Leis');
  const [formFilosofica, setFormFilosofica] = useState<number>(4);
  const [errosCadastro, setErrosCadastro] = useState<string[]>([]);

  // Oath Typing State
  const [textoJuramentoDigitado, setTextoJuramentoDigitado] = useState('');
  const [mensagemJuramento, setMensagemJuramento] = useState<string | null>(null);

  // Warrior Menu Active Sub-Tab/Modal
  const [activeMenuTab, setActiveMenuTab] = useState<'questoes' | 'status' | 'simulado' | 'ranking' | 'chamado_mestre'>('questoes');
  const [selectedSubject, setSelectedSubject] = useState<string>('Língua Portuguesa & Redação');
  
  // Master Surprise Question Modal/Quiz State
  const [perguntaMestreRespondida, setPerguntaMestreRespondida] = useState<boolean>(false);
  const [opcaoMestreSelecionada, setOpcaoMestreSelecionada] = useState<number>(0);
  const [feedbackMestre, setFeedbackMestre] = useState<string | null>(null);

  const [, setRefresh] = useState(0);
  const forceUpdate = () => setRefresh((prev) => prev + 1);

  // Load persistent warrior from localStorage on mount
  useEffect(() => {
    try {
      const savedJSON = localStorage.getItem(SPARTAN_LOCALSTORAGE_KEY);
      if (savedJSON) {
        const parsed = JSON.parse(savedJSON);
        const gLoaded = Guerreiro.fromJSON(parsed);
        if (gLoaded.juramentoAssinado) {
          setGuerreiro(gLoaded);
          setSistemaEvolucao(new SistemaEvolucao(gLoaded));
          setEtapa('menu_guerreiro');
        }
      }
    } catch (e) {
      console.warn('Falha ao carregar estado salvo do Guerreiro:', e);
    }
  }, []);

  // Save state on warrior changes
  const autoSaveGuerreiro = (g: Guerreiro) => {
    try {
      localStorage.setItem(SPARTAN_LOCALSTORAGE_KEY, JSON.stringify(g.toJSON()));
    } catch (e) {
      console.warn('Erro ao salvar Guerreiro no localStorage:', e);
    }
  };

  // Handler 1: Escolha Inicial (SIM / NÃO)
  const handleEscolhaInicial = (aceitou: boolean) => {
    if (aceitou) {
      setEtapa('cadastro');
    } else {
      setEtapa('recusado');
    }
  };

  // Handler 2: Finalizar Formulário de Cadastro e Gerar Perfil
  const handleSubmeterCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setErrosCadastro([]);

    const res = sistemaAdmissao.iniciarCadastro(
      formNome,
      formApelido,
      formIdade,
      formCidade,
      formCurso,
      formFilosofica
    );

    if (!res.sucesso || !res.guerreiro) {
      setErrosCadastro(res.erros);
      return;
    }

    setGuerreiro(res.guerreiro);
    setEtapa('certificado_juramento');
  };

  // Handler 3: Assinar Juramento
  const handleConfirmarJuramento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guerreiro) return;

    const res = sistemaAdmissao.validarJuramento(textoJuramentoDigitado, guerreiro);
    setMensagemJuramento(res.mensagem);

    if (res.sucesso) {
      fireLevelUpCelebration();
      const novoEvol = new SistemaEvolucao(guerreiro);
      setSistemaEvolucao(novoEvol);
      autoSaveGuerreiro(guerreiro);

      setTimeout(() => {
        setEtapa('menu_guerreiro');
      }, 1500);
    } else if (res.tentativasRestantes <= 0) {
      setTimeout(() => {
        alert('Sua determinação fraquejou excessivamente. O portal se fechou temporariamente. Reiniciando o teste de admissão.');
        setEtapa('boas_vindas');
        sistemaAdmissao.tentativasJuramento = 3;
        setTextoJuramentoDigitado('');
        setMensagemJuramento(null);
      }, 2000);
    }
  };

  // Handler 4: Action - Resolver Questão
  const handleResolverQuestao = (acertou: boolean) => {
    if (!sistemaEvolucao || !guerreiro) return;

    const res = sistemaEvolucao.resolverQuestao(selectedSubject, acertou);

    if (acertou) {
      fireConfetti(25, 40);
    }

    if (res.subiuNivel) {
      fireLevelUpCelebration();
    }

    autoSaveGuerreiro(guerreiro);
    forceUpdate();
  };

  // Handler 5: Action - Simular Simulado
  const handleSimularSimulado = () => {
    if (!sistemaEvolucao || !guerreiro) return;

    const res = sistemaEvolucao.simularSimulado();
    if (res.acertos >= 7) {
      fireLevelUpCelebration();
    } else {
      fireConfetti(60, 50);
    }

    autoSaveGuerreiro(guerreiro);
    forceUpdate();
  };

  // Handler 6: Action - Ativar Teste de Fogo
  const handleAtivarTesteDeFogo = () => {
    if (!guerreiro || !sistemaEvolucao) return;
    const msg = guerreiro.ativarTesteDeFogo();
    sistemaEvolucao.log(msg);
    fireConfetti(100, 70);
    autoSaveGuerreiro(guerreiro);
    forceUpdate();
  };

  // Handler 7: Action - Executar Chamado do Mestre (Desafio Surpresa)
  const handleSubmeterChamadoMestre = (opcao: number) => {
    if (!sistemaEvolucao || !guerreiro) return;
    setOpcaoMestreSelecionada(opcao);

    const res = sistemaEvolucao.executarChamadoDoMestre(opcao);
    setFeedbackMestre(res.mensagem);
    setPerguntaMestreRespondida(true);

    if (res.acertou) {
      fireLevelUpCelebration();
    }

    autoSaveGuerreiro(guerreiro);
    forceUpdate();
  };

  // Handler 8: Action - Revisão Periódica / Prestígio
  const handleExecutarRevisao = () => {
    if (!guerreiro || !sistemaEvolucao) return;

    const res = guerreiro.executarRevisaoRefinamento();
    sistemaEvolucao.log(res.mensagem);

    if (res.sucesso) {
      fireLevelUpCelebration();
    }

    autoSaveGuerreiro(guerreiro);
    forceUpdate();
  };

  // Reset System to create a new profile
  const handleReiniciarTudo = () => {
    if (confirm('Deseja realmente abandonar seu progresso e redefinir o cadastro da Spartan Academy?')) {
      localStorage.removeItem(SPARTAN_LOCALSTORAGE_KEY);
      setGuerreiro(null);
      setSistemaEvolucao(null);
      setEtapa('boas_vindas');
      setTextoJuramentoDigitado('');
      setMensagemJuramento(null);
    }
  };

  // Quick Level Boost for Testing Level 100 Progression
  const handleQuickLevelBoost = () => {
    if (!guerreiro || !sistemaEvolucao) return;
    guerreiro.materias.forEach((m) => {
      m.nivel = Math.min(100, m.nivel + 25);
    });
    const novoNiv = guerreiro.getNivelGeral();
    guerreiro.aplicarEvolucaoAtributos(25);
    sistemaEvolucao.log(`⚡ [BOOST DE TESTE] Nível elevado para ${novoNiv}! (${guerreiro.getTituloRank()})`);
    fireConfetti(100, 80);
    autoSaveGuerreiro(guerreiro);
    forceUpdate();
  };

  // =========================================================================
  // RENDER SCREEN 1: INTRODUÇÃO ÉPICA (TELA DE BOAS-VINDAS)
  // =========================================================================
  if (etapa === 'boas_vindas') {
    return (
      <div className="pt-20 pb-28 px-4 md:px-12 max-w-4xl mx-auto animate-fadeIn">
        <div className="bg-[#0f172a] text-slate-100 rounded-[36px] p-6 md:p-10 border border-amber-500/40 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* ASCII Header Banner */}
          <div className="bg-slate-950 p-4 md:p-6 rounded-2xl border border-amber-500/30 text-center font-mono text-amber-400 text-xs md:text-sm tracking-widest leading-relaxed shadow-inner overflow-x-auto">
            <div>═══════════════════════════════════════════════════════════</div>
            <div className="font-extrabold my-1 text-base md:text-lg text-amber-300">
              🏛️ SPARTAN ACADEMY - O TEMPLO DO CONHECIMENTO 🏛️
            </div>
            <div>═══════════════════════════════════════════════════════════</div>
          </div>

          {/* Epic Message Content */}
          <div className="space-y-6 text-center md:text-left max-w-2xl mx-auto">
            <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-serif italic">
                "Olá, Candidato(a).<br />
                Você está prestes a cruzar o portal de um mundo onde não há volta.<br />
                Aqui, o conhecimento é forjado no fogo da disciplina e da dor.<br />
                Se você entrar, não há retorno. Não há desistência. Não há medo."
              </p>

              <div className="pt-2 border-t border-slate-800 text-center">
                <span className="text-amber-400 text-base md:text-xl font-black block tracking-wide font-sparta my-2">
                  🗡️ VOCÊ ESTÁ DISPOSTO(A) A SER TREINADO(A) POR MIM? 🗡️
                </span>
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => handleEscolhaInicial(true)}
                className="py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">swords</span>
                (1) SIM - Eu nasci para isso. Forje-me.
              </button>

              <button
                onClick={() => handleEscolhaInicial(false)}
                className="py-4 px-6 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 font-bold text-sm uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">close</span>
                (2) NÃO - Ainda não estou pronto(a).
              </button>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 font-mono uppercase tracking-widest pt-2">
            [SOM DE TROVÃO] • SISTEMA DE ADMISSÃO POO • SPARTAN ACADEMY 2026
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER SCREEN 1.B: TELA DE RECUSA / RETORNO
  // =========================================================================
  if (etapa === 'recusado') {
    return (
      <div className="pt-20 pb-28 px-4 max-w-2xl mx-auto animate-fadeIn text-center">
        <div className="bg-[#0f172a] text-slate-100 rounded-[36px] p-8 md:p-12 border border-slate-800 shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-slate-900 text-slate-500 rounded-full mx-auto flex items-center justify-center border border-slate-800">
            <span className="material-symbols-outlined text-4xl">door_front</span>
          </div>

          <h2 className="font-sparta text-2xl font-bold text-slate-200">
            As Portas do Templo Permanecem Fechadas
          </h2>

          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-md mx-auto italic font-serif">
            "Então volte quando seu espírito estiver pronto. As portas da Spartan Academy permanecerão abertas para os corajosos."
          </p>

          <button
            onClick={() => setEtapa('boas_vindas')}
            className="px-6 py-3 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-amber-400 transition-all shadow-lg"
          >
            🔄 Recobrar Coragem e Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER SCREEN 2: FORMULÁRIO DE CADASTRO DO CANDIDATO
  // =========================================================================
  if (etapa === 'cadastro') {
    return (
      <div className="pt-20 pb-28 px-4 md:px-12 max-w-3xl mx-auto animate-fadeIn">
        <div className="bg-[#0f172a] text-slate-100 rounded-[36px] p-6 md:p-9 border border-amber-500/30 shadow-2xl space-y-8">
          {/* Header */}
          <div className="border-b border-slate-800 pb-5 text-center md:text-left">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-2">
              ETAPA 2 DE 3 • PERFIL DO CANDIDATO
            </span>
            <h2 className="font-sparta text-2xl md:text-3xl font-black text-slate-100 flex items-center justify-center md:justify-start gap-2">
              Cadastro de Admissão Spartan
              <span className="material-symbols-outlined text-amber-400 text-2xl">shield</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Preencha os dados do candidato para calcular os atributos base e definir a especialização de guerra.
            </p>
          </div>

          {/* Error Banner */}
          {errosCadastro.length > 0 && (
            <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-200 space-y-1">
              <strong className="block font-bold">⚠️ Corrija os seguintes pontos:</strong>
              <ul className="list-disc pl-5 space-y-0.5">
                {errosCadastro.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmeterCadastro} className="space-y-6">
            {/* Section A: Dados Pessoais */}
            <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">badge</span>
                a) Dados Pessoais do Guerreiro
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Leônidas da Silva Ribeiro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-medium outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Apelido de Guerra (Exibição) *</label>
                  <input
                    type="text"
                    required
                    value={formApelido}
                    onChange={(e) => setFormApelido(e.target.value)}
                    placeholder="Ex: Spartan_X"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-extrabold outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Idade (mínimo 14 anos) *</label>
                  <input
                    type="number"
                    min={14}
                    max={100}
                    required
                    value={formIdade}
                    onChange={(e) => setFormIdade(parseInt(e.target.value) || 18)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-bold outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Cidade / Estado (Origem)</label>
                  <input
                    type="text"
                    value={formCidade}
                    onChange={(e) => setFormCidade(e.target.value)}
                    placeholder="Ex: Brasília / DF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-medium outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Escolha do Curso */}
            <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">military_tech</span>
                b) Escolha da Especialização de Guerra (Curso)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.keys(CURSOS_SPARTAN).map((key) => {
                  const curso = CURSOS_SPARTAN[key];
                  const isSelected = formCurso === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setFormCurso(key)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-lg'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sparta font-bold text-xs text-slate-100">{curso.nome}</span>
                        {isSelected && <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>}
                      </div>
                      <div className="text-[10px] space-y-0.5 text-slate-400 font-mono mt-2">
                        <div>Domínio: <strong className="text-amber-400">{curso.dominio}</strong></div>
                        <div>Velocidade: <strong className="text-blue-400">{curso.velocidade}</strong></div>
                        <div>Resistência: <strong className="text-purple-400">{curso.resistencia}</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section C: Teste de Determinação */}
            <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">psychology</span>
                c) Teste de Determinação (Pergunta Filosófica)
              </h3>

              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                "Você está estudando há 6 horas seguidas. Seu cérebro dói. Seus olhos ardem. Um amigo te chama para sair. O que você faz?"
              </p>

              <div className="space-y-2">
                {[
                  { op: 1, text: '(1) Paro imediatamente. Saúde em primeiro lugar.', pts: 5, label: 'Espírito Guerreiro = 5' },
                  { op: 2, text: '(2) Estudo mais 1 hora e depois vou.', pts: 10, label: 'Espírito Guerreiro = 10' },
                  { op: 3, text: '(3) Ignoro o amigo e estudo até o amanhecer. Eu sou uma máquina.', pts: 20, label: 'Espírito Guerreiro = 20 (Alta determinação)' },
                  { op: 4, text: '(4) Faço uma pausa de 15 minutos para meditar e volto com mais força.', pts: 15, label: 'Espírito Guerreiro = 15 (Equilíbrio)' },
                ].map((item) => (
                  <label
                    key={item.op}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                      formFilosofica === item.op
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="filosofica"
                        checked={formFilosofica === item.op}
                        onChange={() => setFormFilosofica(item.op)}
                        className="accent-amber-500"
                      />
                      <span>{item.text}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                      +{item.pts} pt
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">verified</span>
              📜 Gerar Certificado de Admissão & Juramento
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER SCREEN 3: CERTIFICADO DE ADMISSÃO & JURAMENTO DIGITAL
  // =========================================================================
  if (etapa === 'certificado_juramento' && guerreiro) {
    const fraseEsperada = guerreiro.getFraseJuramentoEsperada();

    return (
      <div className="pt-20 pb-28 px-4 md:px-12 max-w-3xl mx-auto animate-fadeIn space-y-8">
        {/* Certificate Box */}
        <div className="bg-[#0f172a] text-slate-100 rounded-[36px] p-6 md:p-9 border-2 border-amber-500/50 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Banner Title */}
          <div className="text-center space-y-1 border-b border-amber-500/30 pb-5">
            <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
              ═══════════════════════════════════════════════════════════
            </span>
            <h2 className="font-sparta text-xl md:text-2xl font-black text-amber-300">
              📜 CERTIFICADO DE ADMISSÃO - SPARTAN ACADEMY 📜
            </h2>
            <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
              ═══════════════════════════════════════════════════════════
            </span>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">🛡️ Guerreiro(a):</span>
              <strong className="text-amber-400 text-base font-sparta">{guerreiro.apelidoGuerra}</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">📛 Nome Real:</span>
              <strong className="text-slate-100">{guerreiro.nomeCompleto}</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">🎂 Idade:</span>
              <strong className="text-slate-100">{guerreiro.idade} anos</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">📍 Origem:</span>
              <strong className="text-slate-100">{guerreiro.cidadeEstado}</strong>
            </div>

            <div className="md:col-span-2">
              <span className="text-slate-400 block font-semibold">⚔️ Especialização de Guerra:</span>
              <strong className="text-amber-300 font-sparta text-sm">{guerreiro.cursoEscolha}</strong>
            </div>
          </div>

          {/* Initial Stats */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-2">
              🔰 ESTATÍSTICAS INICIAIS FORJADAS:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">🏹 Domínio</span>
                <strong className="text-amber-400 text-base">{guerreiro.dominio}</strong>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">⚡ Velocidade</span>
                <strong className="text-blue-400 text-base">{guerreiro.velocidade}</strong>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">🛡️ Resistência</span>
                <strong className="text-purple-400 text-base">{guerreiro.resistencia}</strong>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">🧠 Intuição</span>
                <strong className="text-amber-300 text-base">{guerreiro.intuicao}</strong>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 sm:col-span-2">
                <span className="text-slate-400 text-[10px] block">🔥 Espírito Guerreiro</span>
                <strong className="text-red-400 text-base">{guerreiro.espiritoGuerreiro} pt</strong>
              </div>
            </div>

            <div className="pt-2 text-xs flex justify-between items-center text-slate-300">
              <span>📈 NÍVEL ATUAL: <strong className="text-amber-400">1 - ESTAGIÁRIO</strong></span>
              <span className="text-[11px] text-slate-400 font-mono">🎯 Meta: 7 pts para Nível 2</span>
            </div>
          </div>

          {/* Master Callout */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 text-xs text-slate-200 italic space-y-1">
            <strong className="text-amber-400 not-italic font-bold block">🗣️ Mestre:</strong>
            <p>
              "Bem-vindo(a) à sua nova vida, {guerreiro.apelidoGuerra}.
              O treinamento começa AGORA. Lembre-se: aqui não há derrota, apenas lições. Levante-se e lute."
            </p>
          </div>

          {/* Oath Section */}
          <div className="p-6 bg-slate-900 rounded-3xl border-2 border-amber-500/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-xl">history_edu</span>
              <h3 className="font-sparta font-bold text-sm text-slate-100">
                a) Juramento do Guerreiro (Assinatura Digital)
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Para oficializar sua entrada e liberar o Menu do Guerreiro, digite a seguinte frase com exatidão:
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/40 font-mono text-xs font-bold text-amber-300 text-center select-all">
              {fraseEsperada}
            </div>

            {mensagemJuramento && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                mensagemJuramento.includes('ACEITO')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-950 text-rose-200 border border-rose-800'
              }`}>
                {mensagemJuramento}
              </div>
            )}

            <form onSubmit={handleConfirmarJuramento} className="space-y-3">
              <input
                type="text"
                required
                value={textoJuramentoDigitado}
                onChange={(e) => setTextoJuramentoDigitado(e.target.value)}
                placeholder={`Digite exato: ${fraseEsperada}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-bold outline-none focus:border-amber-500/70"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">draw</span>
                Assinar Juramento & Entrar na Academia
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER SCREEN 4: MENU PRINCIPAL DO GUERREIRO & EVOLUÇÃO POO
  // =========================================================================
  if (!guerreiro || !sistemaEvolucao) {
    return null;
  }

  const nivelGeral = guerreiro.getNivelGeral();
  const tituloRank = guerreiro.getTituloRank();
  const ranking = sistemaEvolucao.obterRankingGlobal();

  return (
    <div className="pt-20 pb-28 px-4 md:px-12 max-w-[1280px] mx-auto animate-fadeIn space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#070a12] rounded-[36px] p-6 md:p-8 text-slate-100 shadow-2xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[11px] font-extrabold uppercase tracking-widest">
                ⚔️ SPARTAN ACADEMY • GUERREIRO ATIVO
              </span>
              <span className="text-xs text-slate-400 font-bold hidden sm:inline">• POO Engine 2026</span>
              {guerreiro.testeDeFogoAtivo && (
                <span className="px-2.5 py-0.5 bg-red-600/30 text-red-400 border border-red-500/40 rounded-full text-[10px] font-extrabold animate-pulse">
                  🔥 TESTE DE FOGO (XP 2X ATIVO)
                </span>
              )}
            </div>
            <h1 className="font-sparta text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              Menu do Guerreiro - {guerreiro.apelidoGuerra}
              <span className="text-xs font-mono px-2.5 py-1 bg-slate-900 text-amber-400 rounded-lg border border-slate-800">
                {guerreiro.cursoEscolha}
              </span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              O conhecimento é forjado no fogo da disciplina. Resolva questões, dispute simulados e conquiste sua vaga!
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40 text-center min-w-[210px] shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Nível Spartan Geral</span>
            <div className="font-sparta text-3xl md:text-4xl font-black text-amber-400 my-1 font-mono">
              Nível {nivelGeral}
            </div>
            <span className="text-xs font-bold text-amber-300 block line-clamp-1 uppercase tracking-wider">
              {tituloRank}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Master Motivational Message Box */}
      <div className="p-4 bg-[#0f172a] rounded-2xl border border-amber-500/30 flex items-center justify-between gap-4 text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-lg flex-shrink-0">
            🏛️
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">TREINAMENTO DO MESTRE</span>
            <p className="text-slate-200 font-serif italic text-xs md:text-sm">
              {sistemaEvolucao.obterMensagemMestre()}
            </p>
          </div>
        </div>

        <button
          onClick={handleQuickLevelBoost}
          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold transition-all cursor-pointer hidden md:block flex-shrink-0"
          title="Acelerar níveis para testar as falas do Mestre nos níveis 5, 10, 25, 50, 75 e 100"
        >
          ⚡ Boost +25 Níveis
        </button>
      </div>

      {/* Main Navigation Sub-Tabs (Menu do Guerreiro) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'questoes', label: '[1] 📚 RESOLVER QUESTÃO', icon: 'quiz' },
          { id: 'status', label: '[2] 📊 MOSTRAR STATUS', icon: 'analytics' },
          { id: 'simulado', label: '[3] 🧪 SIMULAR SIMULADO', icon: 'military_tech' },
          { id: 'ranking', label: '[5] 🏆 RANKING GLOBAL', icon: 'trophy' },
          { id: 'chamado_mestre', label: '[7] ⚔️ CHAMADO DO MESTRE', icon: 'psychology' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMenuTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeMenuTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: RESOLVER QUESTÃO */}
      {activeMenuTab === 'questoes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Subject Select */}
          <div className="bg-[#0f172a] rounded-[32px] p-6 border border-amber-500/20 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                [1] TREINO INDIVIDUAL POR MATÉRIA
              </span>
              <h3 className="font-sparta font-bold text-lg text-slate-100">
                Resolução de Exercícios
              </h3>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400">Selecione a Matéria Pilar:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-bold outline-none focus:border-amber-500/60"
              >
                {Array.from(guerreiro.materias.keys()).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleResolverQuestao(true)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Simular Questão Correta (+1 PT)
              </button>

              <button
                onClick={() => handleResolverQuestao(false)}
                className="w-full py-3.5 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                Simular Questão Incorreta (-0,5 PT)
              </button>
            </div>

            {/* Special Action Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={handleAtivarTesteDeFogo}
                disabled={guerreiro.testeDeFogoAtivo}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  guerreiro.testeDeFogoAtivo
                    ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                    : 'bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30'
                }`}
              >
                <span className="material-symbols-outlined text-base">local_fire_department</span>
                [4] Ativar Teste de Fogo (XP 2x)
              </button>

              <button
                onClick={handleExecutarRevisao}
                disabled={nivelGeral < 100}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  nivelGeral >= 100
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30'
                    : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-base">published_with_changes</span>
                [6] Revisão Periódica (Prestígio Nível 100)
              </button>
            </div>
          </div>

          {/* Subject Bars Display */}
          <div className="bg-[#0f172a] rounded-[32px] p-6 border border-amber-500/20 shadow-2xl space-y-4 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                PILARES DE EVOLUÇÃO (MATÉRIAS)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Total Acertos: {guerreiro.getTotalAcertos()} | Erros: {guerreiro.getTotalErros()}
              </span>
            </div>

            <div className="space-y-4">
              {(Array.from(guerreiro.materias.values()) as Materia[]).map((mat) => {
                const reqPts = mat.calcularPontosNecessarios();
                const pct = mat.getPorcentagemProgresso();

                return (
                  <div key={mat.nome} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-sparta font-bold text-sm text-slate-100">{mat.nome}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{mat.foco}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-bold">
                        Nível {mat.nivel}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400">Progresso para Nível {mat.nivel + 1}</span>
                        <span className="text-amber-400 font-mono">{mat.progressoPontos} / {reqPts} pt ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500 shadow-[0_0_8px_#f59e0b]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950 text-amber-400 font-mono text-[10px] p-2 rounded-xl border border-slate-800 overflow-x-auto">
                      {mat.gerarBarraProgressoTexto(12)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: MOSTRAR STATUS & ATRIBUTOS */}
      {activeMenuTab === 'status' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] rounded-[32px] p-6 border border-amber-500/20 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                [2] FICHA DE ATRIBUTOS SPARTAN
              </span>
              <h3 className="font-sparta font-bold text-lg text-slate-100">
                Atributos Cognitivos e Resiliência
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">🏹 Domínio</span>
                <span className="font-black text-xl text-slate-100 font-mono">{guerreiro.dominio}</span>
                <span className="text-[10px] text-amber-400 block font-semibold">+5/nível</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">⚡ Velocidade</span>
                <span className="font-black text-xl text-slate-100 font-mono">{guerreiro.velocidade}</span>
                <span className="text-[10px] text-blue-400 block font-semibold">+3/nível</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">🛡️ Resistência</span>
                <span className="font-black text-xl text-slate-100 font-mono">{guerreiro.resistencia}</span>
                <span className="text-[10px] text-purple-400 block font-semibold">+20/nível</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">🧠 Intuição</span>
                <span className="font-black text-xl text-slate-100 font-mono">{guerreiro.intuicao}</span>
                <span className="text-[10px] text-amber-400 block font-semibold">+10/nível</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">🔥 Espírito Guerreiro:</span>
                <span className="text-red-400 font-mono">{guerreiro.espiritoGuerreiro} pts</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">📅 Data de Admissão:</span>
                <span className="text-slate-200 font-mono">{guerreiro.dataAdmissao}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">📜 Juramento Digital:</span>
                <span className="text-amber-400 font-bold">ASSINADO E HOMOLOGADO</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-[32px] p-6 border border-amber-500/20 shadow-2xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                DADOS DO CADASTRO
              </span>
              <h3 className="font-sparta font-bold text-lg text-slate-100">
                Perfil do Guerreiro
              </h3>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Apelido de Guerra:</span>
                <strong className="text-amber-300 font-sparta text-base">{guerreiro.apelidoGuerra}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Nome Real:</span>
                <strong className="text-slate-100">{guerreiro.nomeCompleto}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Origem & Idade:</span>
                <strong className="text-slate-100">{guerreiro.cidadeEstado} ({guerreiro.idade} anos)</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Frase do Juramento:</span>
                <p className="font-mono text-[11px] text-amber-400/90 pt-1">
                  "{guerreiro.getFraseJuramentoEsperada()}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SIMULAR SIMULADO */}
      {activeMenuTab === 'simulado' && (
        <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-8 border border-amber-500/20 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-widest">
                [3] SIMULADO DE COMBATE DE 10 QUESTÕES
              </span>
              <h3 className="font-sparta text-xl font-bold text-slate-100">
                Batalha de Conhecimento Multidisciplinar
              </h3>
            </div>

            <button
              onClick={handleSimularSimulado}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              Iniciar Batalha de 10 Questões
            </button>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
            <p className="leading-relaxed">
              Ao clicar no botão acima, o algoritmo testará suas competências nas 4 matérias pilares. O cálculo de acerto utiliza seu nível de Domínio e Intuição.
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: RANKING GLOBAL */}
      {activeMenuTab === 'ranking' && (
        <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-8 border border-amber-500/20 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
              [5] CLASSIFICAÇÃO GLOBAL SPARTAN
            </span>
            <h3 className="font-sparta text-xl font-bold text-slate-100">
              Ranking dos Guerreiros
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                  <th className="py-3 px-3">Pos</th>
                  <th className="py-3 px-3">Guerreiro</th>
                  <th className="py-3 px-3">Patente / Título</th>
                  <th className="py-3 px-3 text-center">Nível</th>
                  <th className="py-3 px-3 text-right">Acertos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ranking.map((r) => {
                  const isUser = r.nome === guerreiro.apelidoGuerra;
                  return (
                    <tr key={r.posicao} className={isUser ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-200'}>
                      <td className="py-3 px-3 font-mono font-black">#{r.posicao}</td>
                      <td className="py-3 px-3 font-sparta flex items-center gap-2">
                        {r.posicao === 1 ? '🥇' : r.posicao === 2 ? '🥈' : r.posicao === 3 ? '🥉' : '🛡️'}
                        {r.nome}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{r.titulo}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-400">Nível {r.nivel}</td>
                      <td className="py-3 px-3 text-right font-mono">{r.acertos} Qs</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: CHAMADO DO MESTRE (PERGUNTA SURPRESA) */}
      {activeMenuTab === 'chamado_mestre' && (
        <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-8 border border-amber-500/30 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
              ⚔️
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                [7] MECÂNICA ESPECIAL: CHAMADO DO MESTRE
              </span>
              <h3 className="font-sparta text-xl font-bold text-slate-100">
                Pergunta Surpresa de Legislação e Doutrina
              </h3>
            </div>
          </div>

          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed italic font-serif">
              🗣️ Mestre: "Candidato {guerreiro.apelidoGuerra}! Responda sem vacilar: no Direito Administrativo, qual o princípio explícito na CF/88 que impõe à Administração Pública o dever de agir com transparência, presteza e rendimento?"
            </p>

            {feedbackMestre && (
              <div className={`p-4 rounded-xl text-xs font-bold ${
                feedbackMestre.includes('TRIUNFO') || feedbackMestre.includes('MAGISTRAL')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-950 text-rose-200 border border-rose-800'
              }`}>
                {feedbackMestre}
              </div>
            )}

            {!perguntaMestreRespondida ? (
              <div className="space-y-2 pt-2">
                {[
                  { op: 1, text: '(1) Princípio da Oportunidade' },
                  { op: 2, text: '(2) Princípio da Eficiência (Inclusa pela EC 19/98)' },
                  { op: 3, text: '(3) Princípio da Anterioridade Tributária' },
                  { op: 4, text: '(4) Princípio do Contraditório Restrito' },
                ].map((item) => (
                  <button
                    key={item.op}
                    onClick={() => handleSubmeterChamadoMestre(item.op)}
                    className="w-full text-left p-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 hover:border-amber-500/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => {
                  setPerguntaMestreRespondida(false);
                  setFeedbackMestre(null);
                }}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-amber-400"
              >
                🔄 Solicitar Novo Chamado do Mestre
              </button>
            )}
          </div>
        </div>
      )}

      {/* Terminal Output Logs Console */}
      <div className="bg-[#0b1c30] text-slate-100 rounded-[32px] p-6 md:p-8 shadow-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">terminal</span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Terminal de Execução SPARTAN POO
            </span>
          </div>

          <button
            onClick={handleReiniciarTudo}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
          >
            🚪 [0] Reiniciar / Novo Cadastro
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 font-mono text-xs max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
          {sistemaEvolucao.logsTerminal.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                log.includes('✅') || log.includes('🏆') || log.includes('🎉')
                  ? 'text-amber-400 font-bold'
                  : log.includes('❌') || log.includes('ROSNADO')
                  ? 'text-rose-400 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
