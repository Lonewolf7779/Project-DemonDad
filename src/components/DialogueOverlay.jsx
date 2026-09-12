import React from 'react';
import { INTRO_CONFIG } from '../config/introConfig';

export function DialogueOverlay({ currentDialogue }) {
  if (!currentDialogue) return null;

  const { text, visible } = currentDialogue;
  const typo = INTRO_CONFIG.typography;

  return (
    <div 
      className={`dialogue-container ${visible ? 'dialogue-visible' : 'dialogue-hidden'}`}
      style={{
        position: 'absolute',
        top: typo.verticalPosition,
        left: typo.horizontalPosition,
        transform: 'translateY(-50%)',
        maxWidth: typo.maxWidth,
        fontFamily: typo.fontFamily,
        fontSize: typo.fontSize,
        fontWeight: typo.fontWeight,
        lineHeight: typo.lineHeight,
        letterSpacing: typo.letterSpacing,
        color: typo.color,
      }}
    >
      <div className="dialogue-text">
        {text}
      </div>
    </div>
  );
}
