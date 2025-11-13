// Advanced Workflow Image Animations
// Handles scroll-triggered reveals, hover effects, and particle animations

export class WorkflowImageManager {
  private observers: IntersectionObserver[] = [];
  private animationTimeouts: number[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.initScrollObservers();
    this.initHoverEffects();
    this.initRevealAnimations();
  }

  private initScrollObservers() {
    // Enhanced intersection observer for workflow images
    const workflowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateWorkflowImage(entry.target as HTMLElement);
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    // Observe all workflow images and containers
    document.querySelectorAll('.workflow-image, .workflow-step-image, .service-workflow-overlay').forEach((img) => {
      workflowObserver.observe(img);
    });

    // Observe choice boxes for enhanced animations
    document.querySelectorAll('.choice-box').forEach((box) => {
      workflowObserver.observe(box);
    });

    this.observers.push(workflowObserver);

    // Observer for general reveal animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    this.observers.push(revealObserver);
  }

  private initHoverEffects() {
    // Enhanced hover effects for workflow images
    document.querySelectorAll('.workflow-image, .workflow-step-image').forEach((img) => {
      const imageElement = img as HTMLElement;

      imageElement.addEventListener('mouseenter', () => {
        imageElement.style.filter = 'brightness(1.2) saturate(1.3) contrast(1.1)';
        imageElement.style.transform = 'scale(1.02)';
      });

      imageElement.addEventListener('mouseleave', () => {
        imageElement.style.filter = 'brightness(1) saturate(1) contrast(1)';
        imageElement.style.transform = 'scale(1)';
      });
    });

    // Enhanced hover effects for choice boxes
    document.querySelectorAll('.choice-box').forEach((box) => {
      const boxElement = box as HTMLElement;

      boxElement.addEventListener('mouseenter', () => {
        this.createHoverParticles(boxElement);
      });
    });
  }

  private initRevealAnimations() {
    // Add CSS for particle animations if not present
    if (!document.getElementById('workflow-particle-styles')) {
      this.addParticleStyles();
    }
  }

  private animateWorkflowImage(image: HTMLElement) {
    image.classList.add('workflow-animate');

    // Add specific effects based on workflow type
    const workflowType = this.getWorkflowType(image);

    switch (workflowType) {
      case 'lead-capture':
        this.createFlowEffect(image);
        break;
      case 'automation':
        this.createPulseEffect(image);
        break;
      case 'conversion':
        this.createFunnelEffect(image);
        break;
      case 'results':
        this.createDataEffect(image);
        break;
      case 'choice-box':
        this.createChoiceBoxEffect(image);
        break;
    }
  }

  private getWorkflowType(image: HTMLElement): string {
    const src = image.style.backgroundImage || '';
    if (src.includes('workflow_1')) return 'lead-capture';
    if (src.includes('workflow_2')) return 'automation';
    if (src.includes('workflow_3')) return 'conversion';
    if (src.includes('workflow_4')) return 'results';
    if (image.classList.contains('choice-box')) return 'choice-box';
    return 'default';
  }

  private createFlowEffect(container: HTMLElement) {
    // Create flowing particles across the image
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createParticle(container, 'flow-particle', i * 500);
      }, i * 200);
    }
  }

  private createPulseEffect(container: HTMLElement) {
    // Create pulsing energy effect
    const pulse = document.createElement('div');
    pulse.className = 'pulse-effect';
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: pulseExpand 2s ease-out forwards;
      pointer-events: none;
      z-index: 10;
    `;
    container.appendChild(pulse);

    setTimeout(() => pulse.remove(), 2000);
  }

  private createFunnelEffect(container: HTMLElement) {
    // Create funnel visualization effect
    const funnel = document.createElement('div');
    funnel.className = 'funnel-effect';
    funnel.style.cssText = `
      position: absolute;
      top: 10%;
      left: 50%;
      width: 2px;
      height: 80%;
      background: linear-gradient(to bottom, transparent, #8b5cf6, transparent);
      transform: translateX(-50%);
      animation: funnelFlow 1.5s ease-out forwards;
      pointer-events: none;
      z-index: 10;
    `;
    container.appendChild(funnel);

    setTimeout(() => funnel.remove(), 1500);
  }

  private createDataEffect(container: HTMLElement) {
    // Create data visualization effect
    const dataPoints = 5;
    for (let i = 0; i < dataPoints; i++) {
      setTimeout(() => {
        const point = document.createElement('div');
        point.className = 'data-point';
        point.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: #8b5cf6;
          border-radius: 50%;
          box-shadow: 0 0 10px #8b5cf6;
          top: ${20 + Math.random() * 60}%;
          left: ${10 + Math.random() * 80}%;
          animation: dataPulse 1s ease-out forwards;
          pointer-events: none;
          z-index: 10;
        `;
        container.appendChild(point);

        setTimeout(() => point.remove(), 1000);
      }, i * 150);
    }
  }

  private createChoiceBoxEffect(container: HTMLElement) {
    // Create subtle glow effect for choice boxes
    container.style.boxShadow = '0 20px 40px rgba(110, 0, 255, 0.15)';
    setTimeout(() => {
      container.style.boxShadow = '';
    }, 1000);
  }

  private createHoverParticles(container: HTMLElement) {
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'hover-particle';
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: #8b5cf6;
        border-radius: 50%;
        box-shadow: 0 0 15px #8b5cf6;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particleFloat 1s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;
      container.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);
    }
  }

  private createParticle(container: HTMLElement, className: string, delay: number = 0) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = className;
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: #8b5cf6;
        border-radius: 50%;
        box-shadow: 0 0 15px #8b5cf6;
        top: 50%;
        left: 0;
        animation: flowAcross 3s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;
      container.appendChild(particle);

      setTimeout(() => particle.remove(), 3000);
    }, delay);
  }

  private addParticleStyles() {
    const style = document.createElement('style');
    style.id = 'workflow-particle-styles';
    style.textContent = `
      @keyframes flowAcross {
        0% { left: 0; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { left: 100%; opacity: 0; }
      }

      @keyframes pulseExpand {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
      }

      @keyframes funnelFlow {
        0% { height: 0; opacity: 0; }
        50% { opacity: 1; }
        100% { height: 80%; opacity: 0; }
      }

      @keyframes dataPulse {
        0% { transform: scale(0); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.8; }
        100% { transform: scale(0); opacity: 0; }
      }

      @keyframes particleFloat {
        0% { transform: translateY(0) scale(0); opacity: 1; }
        50% { transform: translateY(-20px) scale(1); opacity: 0.8; }
        100% { transform: translateY(-40px) scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Cleanup method for performance
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.observers = [];
    this.animationTimeouts = [];
  }
}

// Initialize when DOM is ready
export function initWorkflowAnimations() {
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      new WorkflowImageManager();
    });

    // Also initialize immediately if DOM is already loaded
    if (document.readyState === 'loading') {
      // Wait for DOM
    } else {
      new WorkflowImageManager();
    }
  }
}

// Auto-initialize for browser environments
if (typeof window !== 'undefined') {
  initWorkflowAnimations();
}
