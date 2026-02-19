<div class="dna-helix" aria-hidden="true">
  {#each Array(20) as _, i}
    <div class="dna-pair" style="--i: {i}; --delay: {i * 0.15}s">
      <div class="dna-dot dna-dot-left"></div>
      <div class="dna-bridge"></div>
      <div class="dna-dot dna-dot-right"></div>
    </div>
  {/each}
</div>

<style>
  .dna-helix {
    position: relative;
    width: 120px;
    height: 400px;
    perspective: 500px;
    transform-style: preserve-3d;
  }
  .dna-pair {
    position: absolute;
    top: calc(var(--i) * 20px);
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    animation: dna-rotate 4s ease-in-out infinite;
    animation-delay: var(--delay);
    transform-style: preserve-3d;
  }
  .dna-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dna-dot-left {
    background: linear-gradient(135deg, #00E5CC, #3B82F6);
    box-shadow: 0 0 12px rgba(0, 229, 204, 0.6);
  }
  .dna-dot-right {
    background: linear-gradient(135deg, #8B5CF6, #3B82F6);
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.6);
  }
  .dna-bridge {
    height: 2px;
    flex-grow: 1;
    max-width: 60px;
    background: linear-gradient(90deg, rgba(0,229,204,0.4), rgba(139,92,246,0.4));
    border-radius: 1px;
  }
  @keyframes dna-rotate {
    0%, 100% { transform: rotateY(0deg) scaleX(1); }
    25% { transform: rotateY(90deg) scaleX(0.1); }
    50% { transform: rotateY(180deg) scaleX(1); }
    75% { transform: rotateY(270deg) scaleX(0.1); }
  }
</style>
