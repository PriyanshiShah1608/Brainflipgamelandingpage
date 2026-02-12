// Sound utility using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 1;
  private isMuted: boolean = false;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  private ensureContext() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private getEffectiveVolume(baseVolume: number): number {
    if (this.isMuted) return 0;
    return baseVolume * this.masterVolume;
  }

  // Card flip sound
  playFlip() {
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(this.getEffectiveVolume(0.2), this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Match found sound
  playMatch() {
    this.ensureContext();
    if (!this.audioContext) return;

    const times = [0, 0.1, 0.2];
    const freqs = [523.25, 659.25, 783.99]; // C, E, G chord

    times.forEach((time, i) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freqs[i], this.audioContext!.currentTime + time);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + time);
      gainNode.gain.linearRampToValueAtTime(this.getEffectiveVolume(0.15), this.audioContext!.currentTime + time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + time + 0.3);

      oscillator.start(this.audioContext!.currentTime + time);
      oscillator.stop(this.audioContext!.currentTime + time + 0.3);
    });
  }

  // No match sound
  playNoMatch() {
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(this.getEffectiveVolume(0.15), this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Victory sound
  playVictory() {
    this.ensureContext();
    if (!this.audioContext) return;

    const melody = [
      { freq: 523.25, time: 0, duration: 0.15 },      // C
      { freq: 659.25, time: 0.15, duration: 0.15 },   // E
      { freq: 783.99, time: 0.3, duration: 0.15 },    // G
      { freq: 1046.50, time: 0.45, duration: 0.4 },   // C (high)
    ];

    melody.forEach(({ freq, time, duration }) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + time);
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + time);
      gainNode.gain.linearRampToValueAtTime(this.getEffectiveVolume(0.2), this.audioContext!.currentTime + time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + time + duration);

      oscillator.start(this.audioContext!.currentTime + time);
      oscillator.stop(this.audioContext!.currentTime + time + duration);
    });
  }

  // Button click sound
  playClick() {
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(this.getEffectiveVolume(0.15), this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // Hover sound (subtle)
  playHover() {
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(this.getEffectiveVolume(0.05), this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.03);
  }

  // Navigation button sound (Play, How to Play, Levels, Leaderboard)
  playNavigate() {
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(this.getEffectiveVolume(0.2), this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Happy celebration sound (2-3 stars)
  playHappyVictory() {
    this.ensureContext();
    if (!this.audioContext) return;

    // Uplifting melody with harmonics
    const melody = [
      { freq: 523.25, time: 0, duration: 0.12 },      // C
      { freq: 659.25, time: 0.1, duration: 0.12 },    // E
      { freq: 783.99, time: 0.2, duration: 0.12 },    // G
      { freq: 1046.50, time: 0.3, duration: 0.15 },   // C (high)
      { freq: 1318.51, time: 0.45, duration: 0.3 },   // E (high)
    ];

    melody.forEach(({ freq, time, duration }) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + time);
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + time);
      gainNode.gain.linearRampToValueAtTime(this.getEffectiveVolume(0.25), this.audioContext!.currentTime + time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + time + duration);

      oscillator.start(this.audioContext!.currentTime + time);
      oscillator.stop(this.audioContext!.currentTime + time + duration);
    });

    // Add sparkle effect
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext!.destination);
        
        osc.frequency.setValueAtTime(2000 + Math.random() * 1000, this.audioContext!.currentTime);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(this.getEffectiveVolume(0.1), this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.2);
        
        osc.start();
        osc.stop(this.audioContext!.currentTime + 0.2);
      }, i * 150);
    }
  }

  // Sad/disappointed sound (1 star)
  playSadVictory() {
    this.ensureContext();
    if (!this.audioContext) return;

    // Descending melody (sad trombone style)
    const melody = [
      { freq: 440, time: 0, duration: 0.25 },         // A
      { freq: 392, time: 0.25, duration: 0.25 },      // G
      { freq: 349.23, time: 0.5, duration: 0.25 },    // F
      { freq: 293.66, time: 0.75, duration: 0.4 },    // D (low)
    ];

    melody.forEach(({ freq, time, duration }) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + time);
      oscillator.frequency.linearRampToValueAtTime(freq * 0.95, this.audioContext!.currentTime + time + duration);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + time);
      gainNode.gain.linearRampToValueAtTime(this.getEffectiveVolume(0.2), this.audioContext!.currentTime + time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + time + duration);

      oscillator.start(this.audioContext!.currentTime + time);
      oscillator.stop(this.audioContext!.currentTime + time + duration);
    });
  }
}

export const soundManager = new SoundManager();