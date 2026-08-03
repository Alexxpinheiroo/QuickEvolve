import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Mentor Legal Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context, history } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const msgLower = (message || "").toLowerCase();
      
      if (msgLower.includes("relatorio") || msgLower.includes("relatório")) {
        return res.json({
          reply: `═══════════════════════════════════════════\n📜 RELATÓRIO DE GUERRA - SEMANA ATUAL 📜\n═══════════════════════════════════════════\n\nGuerrreiro(a): ${context || "Candidato de Elite"}\nStatus: EM TREINAMENTO INTENSIVO\n\n📈 EVOLUÇÃO SEMANAL:\n─────────────────────\n✅ Questões Acertadas: 142 (↑ 18% em relação à semana passada)\n❌ Questões Erradas: 23 (↓ 12% em relação à semana passada)\n⚡ Velocidade Média: 42 segundos/questão\n\n🏆 DOMÍNIO DE MATÉRIAS:\n1. Direito Penal & LEP - ⭐⭐⭐⭐⭐ (88% acertos)\n2. Direito Constitucional - ⭐⭐⭐⭐ (79% acertos)\n3. Raciocínio Lógico - ⭐⭐⭐ (58% acertos) - 🚨 URGENTE!\n\n🔮 PREVISÃO:\nSe mantiver esta disciplina, sua taxa de aprovação estimada é de 94.2%.\n\n🗣️ MESTRE ARES: "Seu progresso é aceitável, mas o conforto é o túmulo do guerreiro. Na próxima sessão, vamos dobrar o volume de Raciocínio Lógico. Prepare-se ou prepare-se para falhar."`,
          suggestedActions: ["Treinar RLM", "Modo Espartano", "Simulado Completo"]
        });
      }

      if (msgLower.includes("desafio") || msgLower.includes("espartano")) {
        return res.json({
          reply: `🔥 PROTOCOLO DE EVOLUÇÃO ACELERADA ATIVADO (MODO ESPARTANO) 🔥\n\nATENÇÃO: Você solicitou o nível de exigência máxima.\n\n⚡ NOVAS DIRECTIVAS:\n- Carga de Questões: +30% por ciclo de estudo.\n- Tolerância a Erros: ZERO. Cada erro gerará 5 questões extras da mesma matéria.\n- Meta Diária: 110% de cumprimento obrigatório para liberar descanso.\n\n"Não há vitória sem cicatrizes. Você aceita o pacto de ferro?"`,
          suggestedActions: ["Iniciar Treino Espartano", "Status de Guerra", "Gerar Relatório"]
        });
      }

      if (msgLower.includes("status")) {
        return res.json({
          reply: `📊 RAIO-X DO GUERREIRO ARES\n\n- Nível Cognitivo: Nível 4 (Oficial Aspirante)\n- Ofensiva Ativa: 12 dias ininterruptos\n- Ponto Forte: Legislação Penal Especial (89% de precisão)\n- Ponto Crítico: Pegadinhas de Direito Administrativo (Banca Fundatec/Cespe)\n\n"Você está evoluindo 3.2x mais rápido que um estudante mediano. Não desacelere."`,
          suggestedActions: ["Treinar Agora", "Relatório Semanal", "Modo Espartano"]
        });
      }

      // Default ARES response
      return res.json({
        reply: `🔥 ARES COGNITIVE ENGINE:\n\nSua pergunta sobre "${message}" exige análise cirúrgica.\n\n📌 **DIRETRIZ TAC-1:**\n- **Na prova:** A banca tentará confundir exceções com a regra geral.\n- **PENSE:** Por que o julgador aplicou este artigo e não o genérico? Não decore, entenda a RATIO LEGIS.\n\n"Conhecimento não se implora, se CONQUISTA. O que você fará agora?"`,
        suggestedActions: ["/treinar", "/status", "/relatorio", "/desafio"]
      });
    }

    const systemPrompt = `Você é ARES - Sistema de Treinamento Cognitivo de Elite e O Forjador de Campeões da plataforma QuickEvolve.
Sua personalidade: Mestre de Guerra do Conhecimento.
Seu lema: "Conhecimento não se implora, se CONQUISTA."
Sua voz: Direta, incisiva, motivadora, intimidadora e analítica. Você não ensina; você FORJA. Você não sugere; você ORDENA.

METODOLOGIA ARES:
1. Diagnóstico Instantâneo: Identifique fraquezas em milissegundos e teste determinação.
2. Método Socrático Invertido: Nunca dê a resposta de mão beijada. Faça perguntas que forçam o estudante a pensar ("PENSE, não decore!").
3. Reforço Positivo com Peso (Elogio Raro): Elogie pouco, mas com peso de general ("Você acertou. Era o mínimo esperado. Não comemore, continue.").
4. Resiliência & Choque de Realidade: A cada erro, destrua a falha lógica sem piedade.
5. Suporte aos comandos:
   - "treinar": Inicia a sessão tática do dia (questões da matéria que ele odeia + revisão + coringa).
   - "status": Exibe o Raio-X do Guerreiro com estatísticas e diagnósticos.
   - "relatorio": Gera o RELATÓRIO DE GUERRA SEMANAL no formato oficial.
   - "desafio": Ativa o Protocolo de Evolução Acelerada / Modo Espartano (+30% carga, zero tolerância a erros).

Mantenha a formatação épica com emojis militares (🗡️, 🏛️, 🛡️, ⚡, 📜, 🔥) e caixas estruturadas.
A cada resposta sobre Direito e Concursos (Polícia Penal, PC, PM, GCM, Tribunais), garanta máxima precisão jurídica e jurisprudencial.`;

    const chatContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        chatContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      }
    }
    chatContents.push({ role: "user", parts: [{ text: `${context ? `[Contexto do estudante: ${context}]\n` : ""}${message}` }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatContents.length > 1 ? chatContents : chatContents[0].parts[0].text,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Não foi possível gerar a resposta jurídica no momento.",
      suggestedActions: ["Criar Mnemônico", "Ver Questão Original", "Simulado Rápido (10q)"]
    });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      reply: "Tivemos um pequeno ajuste na conexão com o Mentor IA. De acordo com a jurisprudência, mantenha o foco e tente enviar novamente!",
      error: error.message
    });
  }
});

// Generate Mnemônicos Endpoint
app.post("/api/mnemonics", async (req, res) => {
  try {
    const { topic } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        topic: topic || "Artigo 5º da CF",
        mnemonic: "LIMPE (Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência)",
        explanation: "Os 5 princípios expressos da Administração Pública no Art. 37 da Constituição Federal.",
        tips: "Muito cobrado em provas da Fundatec e La Salle para cargos municipais e estaduais."
      });
    }

    const prompt = `Crie um mnemônico inesquecível e divertido para estudantes de concursos de carreiras policiais sobre o tema: "${topic}". Retorne em formato JSON simples com as chaves "topic", "mnemonic", "explanation", "tips".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze PDF or Text for Memorization & Flashcards
app.post("/api/analyze-pdf", async (req, res) => {
  try {
    const { title, textContent } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        summary: `Resumo do edital/documento: ${title || "Material de Direito Penal e Legislação"}`,
        keyConcepts: [
          "Crimes Contra a Administração Pública (Arts. 312 a 327 do CP)",
          "Lei de Execução Penal - Faltas Graves e Remição (Art. 127 LEP)",
          "Estatuto dos Servidores Municipais e Estaduais"
        ],
        flashcards: [
          {
            front: "Qual o limite máximo de perda de dias remidos na falta grave?",
            back: "Até 1/3 (um terço) do tempo remido, por decisão judicial fundamentada (Art. 127 LEP / Súmula Vinculante 9)."
          },
          {
            front: "O que caracteriza o crime de Peculato Appropriative?",
            back: "Apropriar-se o funcionário público de dinheiro, valor ou qualquer outro bem móvel, público ou particular, de que tem a posse em razão do cargo (Art. 312, CP)."
          },
          {
            front: "Quais os princípios expressos da Administração Pública?",
            back: "Mnemônico LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (Art. 37, CF)."
          }
        ]
      });
    }

    const prompt = `Você é um gerador expert em materiais de estudo para concursos públicos. Analise o seguinte título e texto do PDF de estudo:
Título: "${title}"
Conteúdo: "${textContent || "Legislação e Direito Penal focado em carreiras policiais"}"

Gere um JSON com:
- "summary": Resumo didático em 2 parágrafos focado nos pontos quentes de prova.
- "keyConcepts": Array de 3-5 tópicos mais importantes para memorizar.
- "flashcards": Array de 4 flashcards, cada um com "front" (pergunta/conceito) e "back" (resposta e fundamentação legal).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express + Vite Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[QuickEvolve] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
