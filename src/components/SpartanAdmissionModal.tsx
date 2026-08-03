import React, { useState } from 'react';
import {
  Guerreiro,
  SistemaAdmissao,
  CURSOS_SPARTAN
} from '../lib/academicEvolutionEngine';
import { fireLevelUpCelebration } from '../lib/confetti';

interface SpartanAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdmitted?: (guerreiro: Guerreiro) => void;
  initialUserName?: string;
}

type EtapaModal = 'boas_vindas' | 'recusado' | 'cadastro' | 'certificado_juramento';

export const SpartanAdmissionModal: React.FC<SpartanAdmissionModalProps> = ({
  isOpen,
  onClose,
  onAdmitted,
  initialUserName = ''
}) => {
  const [sistemaAdmissao] = useState(() => new SistemaAdmissao());
  const [etapa, setEtapa] = useState<EtapaModal>('boas_vindas');
  const [guerreiro, setGuerreiro] = useState<Guerreiro | null>(null);

  // Form State
  const [formNome, setFormNome] = useState(initialUserName);
  const [formApelido, setFormApelido] = useState(initialUserName ? initialUserName.split(' ')[0] : '');
  const [formIdade, setFormIdade] = useState<number>(20);
  const [formCidade, setFormCidade] = useState('São Paulo / SP');
  const [formCurso, setFormCurso] = useState('Direito & Leis');
  const [formFilosofica, setFormFilosofica] = useState<number>(4);
  const [errosCadastro, setErrosCadastro] = useState<string[]>([]);

  // Oath State
  const [textoJuramentoDigitado, setTextoJuramentoDigitado] = useState('');
  const [mensagemJuramento, setMensagemJuramento] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEscolhaInicial = (aceitou: boolean) => {
    if (aceitou) {
      setEtapa('cadastro');
    } else {
      setEtapa('recusado');
    }
  };

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

  const handleConfirmarJuramento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guerreiro) return;

    const res = sistemaAdmissao.validarJuramento(textoJuramentoDigitado, guerreiro);
    setMensagemJuramento(res.mensagem);

    if (res.sucesso) {
      fireLevelUpCelebration();
      if (onAdmitted) {
        onAdmitted(guerreiro);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } else if (res.tentativasRestantes <= 0) {
      setTimeout(() => {
        alert('Sua determinação fraquejou. O portal da Spartan Academy se fechou. Reiniciando teste de admissão.');
        setEtapa('boas_vindas');
        sistemaAdmissao.tentativasJuramento = 3;
        setTextoJuramentoDigitado('');
        setMensagemJuramento(null);
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto custom-scrollbar">
      <div className="bg-mesh spartan-card text-slate-100 rounded-[36px] w-full max-w-3xl border-2 spartan-border gold-glow relative overflow-hidden my-8 transition-all">
        
        {/* Background Glow Overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header Controls */}
        <div className="p-4 border-b border-amber-500/20 flex items-center justify-between bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-xl animate-float">shield</span>
            <span className="font-sparta font-bold text-xs uppercase tracking-wider text-amber-400">
              Spartan Academy • Admissão Oficial
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 flex items-center justify-center font-bold border border-slate-800 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* ========================================== */}
          {/* ETAPA 1: BOAS VINDAS ÉPICAS               */}
          {/* ========================================== */}
          {etapa === 'boas_vindas' && (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 font-mono text-amber-400 text-xs md:text-sm tracking-widest leading-relaxed shadow-inner overflow-x-auto gold-glow">
                <div>═══════════════════════════════════════════════════════════</div>
                <div className="font-extrabold my-1 text-base md:text-lg text-amber-300 font-sparta">
                  🏛️ SPARTAN ACADEMY - O TEMPLO DO CONHECIMENTO 🏛️
                </div>
                <div>═══════════════════════════════════════════════════════════</div>
              </div>

              {/* Master Message Card with Animation */}
              <div className="p-6 bg-slate-900/90 rounded-3xl border border-amber-500/30 space-y-4 shadow-xl text-left md:text-center animate-fadeIn transition-all transform hover:scale-[1.01]">
                <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-base">record_voice_over</span>
                  Mensagem do Mestre Spartan
                </div>

                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-serif italic">
                  "Olá, Candidato(a).<br />
                  Você está prestes a cruzar o portal de um mundo onde não há volta.<br />
                  Aqui, o conhecimento é forjado no fogo da disciplina e da dor.<br />
                  Se você entrar, não há retorno. Não há desistência. Não há medo."
                </p>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-amber-400 text-base md:text-lg font-black block tracking-wide font-sparta my-2 animate-pulse">
                    🗡️ VOCÊ ESTÁ DISPOSTO(A) A SER TREINADO(A) POR MIM? 🗡️
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleEscolhaInicial(true)}
                  className="py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 gold-glow"
                >
                  <span className="material-symbols-outlined text-xl">swords</span>
                  (1) SIM - Eu nasci para isso. Forje-me.
                </button>

                <button
                  onClick={() => handleEscolhaInicial(false)}
                  className="py-4 px-6 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 font-bold text-sm uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                  (2) NÃO - Ainda não estou pronto(a).
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* ETAPA 1.B: RECUSADO                       */}
          {/* ========================================== */}
          {etapa === 'recusado' && (
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              <div className="w-16 h-16 bg-slate-900 text-slate-500 rounded-full mx-auto flex items-center justify-center border border-slate-800 animate-float">
                <span className="material-symbols-outlined text-3xl">door_front</span>
              </div>

              <h2 className="font-sparta text-xl font-bold text-slate-200">
                As Portas Permanecem Fechadas
              </h2>

              <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto italic font-serif bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 animate-fadeIn">
                "Então volte quando seu espírito estiver pronto. As portas da Spartan Academy permanecerão abertas para os corajosos."
              </p>

              <button
                onClick={() => setEtapa('boas_vindas')}
                className="px-6 py-3 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-amber-400 transition-all shadow-lg gold-glow"
              >
                🔄 Recobrar Coragem e Tentar Novamente
              </button>
            </div>
          )}

          {/* ========================================== */}
          {/* ETAPA 2: FORMULÁRIO DE CADASTRO           */}
          {/* ========================================== */}
          {etapa === 'cadastro' && (
            <form onSubmit={handleSubmeterCadastro} className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-1">
                    CADASTRO DO CANDIDATO
                  </span>
                  <h3 className="font-sparta text-xl font-black text-slate-100 flex items-center gap-2">
                    Criação do Perfil de Guerra
                    <span className="material-symbols-outlined text-amber-400 text-lg animate-float">shield</span>
                  </h3>
                </div>
              </div>

              {errosCadastro.length > 0 && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-200 space-y-1 animate-fadeIn">
                  <strong className="block font-bold">⚠️ Ajustes necessários:</strong>
                  <ul className="list-disc pl-5">
                    {errosCadastro.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dados Pessoais */}
              <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 animate-fadeIn">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">badge</span>
                  a) Dados Pessoais
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={formNome}
                      onChange={(e) => setFormNome(e.target.value)}
                      placeholder="Ex: Leônidas da Silva"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Apelido de Guerra *</label>
                    <input
                      type="text"
                      required
                      value={formApelido}
                      onChange={(e) => setFormApelido(e.target.value)}
                      placeholder="Ex: Spartan_01"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-extrabold outline-none focus:border-amber-500/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Idade (mín. 14) *</label>
                    <input
                      type="number"
                      min={14}
                      required
                      value={formIdade}
                      onChange={(e) => setFormIdade(parseInt(e.target.value) || 18)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Cidade / Estado</label>
                    <input
                      type="text"
                      value={formCidade}
                      onChange={(e) => setFormCidade(e.target.value)}
                      placeholder="Ex: Brasília / DF"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Escolha do Curso */}
              <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 animate-fadeIn">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">military_tech</span>
                  b) Especialização de Guerra (Curso)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(CURSOS_SPARTAN).map((key) => {
                    const c = CURSOS_SPARTAN[key];
                    const isSelected = formCurso === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setFormCurso(key)}
                        className={`p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold gold-glow scale-[1.02]'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-sparta text-[11px] line-clamp-1">{c.nome}</div>
                        <div className="text-[9px] font-mono text-slate-400 mt-1">
                          Dom: {c.dominio} | Vel: {c.velocidade} | Res: {c.resistencia}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Teste de Determinação */}
              <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 animate-fadeIn">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">psychology</span>
                  c) Teste de Determinação (Pergunta Filosófica)
                </h4>
                
                {/* Master Question Box */}
                <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1 animate-fadeIn">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">forum</span> Pergunta do Mestre:
                  </span>
                  <p className="text-xs text-slate-200 italic font-serif leading-relaxed">
                    "Você está estudando há 6 horas seguidas. Seu cérebro dói. Seus olhos ardem. Um amigo te chama para sair. O que você faz?"
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  {[
                    { op: 1, text: '(1) Paro imediatamente. Saúde em primeiro lugar.', pts: 5 },
                    { op: 2, text: '(2) Estudo mais 1 hora e depois vou.', pts: 10 },
                    { op: 3, text: '(3) Ignoro o amigo e estudo até o amanhecer. Eu sou uma máquina.', pts: 20 },
                    { op: 4, text: '(4) Faço uma pausa de 15 minutos para meditar e volto com mais força.', pts: 15 },
                  ].map((item) => (
                    <label
                      key={item.op}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        formFilosofica === item.op
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold gold-glow'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="pr-2">{item.text}</span>
                      <span className="text-[10px] font-mono text-amber-400 flex-shrink-0">+{item.pts} pt</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-center gap-2 gold-glow"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                📜 Gerar Certificado de Admissão
              </button>
            </form>
          )}

          {/* ========================================== */}
          {/* ETAPA 3: CERTIFICADO & JURAMENTO           */}
          {/* ========================================== */}
          {etapa === 'certificado_juramento' && guerreiro && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-950 p-4.5 rounded-2xl border-2 border-amber-500/40 text-center space-y-3 gold-glow">
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-xl animate-float">workspace_premium</span>
                  <h3 className="font-sparta text-lg font-black text-amber-300">
                    📜 CERTIFICADO DE ADMISSÃO - SPARTAN ACADEMY 📜
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-left bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div>🛡️ Guerreiro: <strong className="text-amber-400">{guerreiro.apelidoGuerra}</strong></div>
                  <div>📛 Nome: <strong className="text-slate-200">{guerreiro.nomeCompleto}</strong></div>
                  <div>🎂 Idade: <strong className="text-slate-200">{guerreiro.idade} anos</strong></div>
                  <div>📍 Origem: <strong className="text-slate-200">{guerreiro.cidadeEstado}</strong></div>
                  <div className="col-span-2">⚔️ Curso: <strong className="text-amber-300">{guerreiro.cursoEscolha}</strong></div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 font-mono text-[10px] text-center">
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block">Domínio</span>
                    <strong className="text-amber-400 text-xs">{guerreiro.dominio}</strong>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block">Velocidade</span>
                    <strong className="text-blue-400 text-xs">{guerreiro.velocidade}</strong>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block">Resistência</span>
                    <strong className="text-purple-400 text-xs">{guerreiro.resistencia}</strong>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block">Intuição</span>
                    <strong className="text-amber-300 text-xs">{guerreiro.intuicao}</strong>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block">Espírito</span>
                    <strong className="text-red-400 text-xs">{guerreiro.espiritoGuerreiro} pt</strong>
                  </div>
                </div>
              </div>

              {/* Master Welcome Speech */}
              <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 text-xs text-slate-200 italic space-y-1 animate-fadeIn">
                <span className="text-amber-400 not-italic font-bold block flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-sm">record_voice_over</span>
                  Mestre Spartan:
                </span>
                <p>
                  "Bem-vindo(a) à sua nova vida, <strong className="text-amber-300 not-italic">{guerreiro.apelidoGuerra}</strong>.
                  O treinamento começa AGORA. Lembre-se: aqui não há derrota, apenas lições."
                </p>
              </div>

              {/* Juramento Digital */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/30 space-y-3 animate-fadeIn">
                <h4 className="font-sparta font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">history_edu</span>
                  a) Juramento do Guerreiro (Assinatura Digital)
                </h4>

                <p className="text-xs text-slate-300">
                  Digite exatamente a frase abaixo para oficializar a admissão:
                </p>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/40 font-mono text-xs text-amber-300 text-center select-all gold-glow">
                  {guerreiro.getFraseJuramentoEsperada()}
                </div>

                {mensagemJuramento && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold animate-fadeIn ${
                    mensagemJuramento.includes('ACEITO')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 gold-glow'
                      : 'bg-rose-950 text-rose-200 border border-rose-800'
                  }`}>
                    {mensagemJuramento}
                  </div>
                )}

                <form onSubmit={handleConfirmarJuramento} className="space-y-2">
                  <input
                    type="text"
                    required
                    value={textoJuramentoDigitado}
                    onChange={(e) => setTextoJuramentoDigitado(e.target.value)}
                    placeholder="Digite a frase do juramento..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-bold outline-none focus:border-amber-500/60 transition-all"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-center gap-2 gold-glow"
                  >
                    <span className="material-symbols-outlined text-base">draw</span>
                    🖊️ Assinar Juramento Digital
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
