import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook pour gérer le focus trap dans les modals
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Sauvegarder l'élément actif
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Obtenir tous les éléments focusables
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus sur le premier élément
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Restaurer le focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook pour gérer les raccourcis clavier
 */
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifiers = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey
      };

      // Construire la combinaison de touches
      const combination = [
        modifiers.ctrl && 'ctrl',
        modifiers.alt && 'alt',
        modifiers.shift && 'shift',
        modifiers.meta && 'meta',
        key
      ].filter(Boolean).join('+');

      const handler = shortcuts[combination];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

/**
 * Hook pour annoncer les changements aux lecteurs d'écran
 */
export const useScreenReaderAnnouncement = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Nettoyer après l'annonce
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return announce;
};

/**
 * Hook pour gérer l'ID unique des éléments
 */
export const useUniqueId = (prefix: string = 'id') => {
  const idRef = useRef<string | undefined>(undefined);
  
  if (!idRef.current) {
    idRef.current = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return idRef.current;
};

/**
 * Hook pour détecter si l'utilisateur navigue au clavier
 */
export const useKeyboardNavigation = () => {
  const isKeyboardUser = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        isKeyboardUser.current = true;
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      isKeyboardUser.current = false;
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
};
