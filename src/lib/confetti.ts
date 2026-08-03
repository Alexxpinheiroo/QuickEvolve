import confetti from 'canvas-confetti';

/**
 * Dispara um estouro único de confetes na tela
 */
export function fireConfetti(particleCount = 100, spread = 70) {
  try {
    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#8b5cf6', '#eab308', '#ec4899'],
      zIndex: 9999,
    });
  } catch (e) {
    console.error('Erro ao disparar confetes:', e);
  }
}

/**
 * Dispara celebração de subida de nível / conquista épica com múltiplos fogos de confete
 */
export function fireLevelUpCelebration() {
  try {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    // Estouro inicial central de grande impacto
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#22c55e', '#10b981', '#3b82f6', '#f59e0b', '#6366f1'],
      zIndex: 10000,
    });

    // Cascata contínua lateral de 3 segundos
    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 10000,
        particleCount,
        origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 },
        colors: ['#22c55e', '#3b82f6', '#fbbf24', '#a855f7'],
      });

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 10000,
        particleCount,
        origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'],
      });
    }, 250);
  } catch (e) {
    console.error('Erro ao disparar celebração de nível:', e);
  }
}
