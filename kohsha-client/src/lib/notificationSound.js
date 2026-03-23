// Simple notification sound using Web Audio API
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a pleasant notification sound (bell-like)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Notification sound not available:', error);
  }
};

// Alternative: Use a simple base64 encoded mp3/wav notification sound
// This is a short beep sound in base64 format
const BEEP_SOUND = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';

export const playNotificationSoundAlt = () => {
  try {
    const audio = new Audio(BEEP_SOUND);
    audio.volume = 0.5;
    audio.play().catch((err) => console.log('Could not play sound', err));
  } catch (error) {
    console.log('Sound playback not available:', error);
  }
};
