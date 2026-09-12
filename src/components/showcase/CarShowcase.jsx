import React from 'react';
import { CAR_SPECS_CONFIG } from '../../config/carSpecsConfig';

export function CarShowcase({ onReplayIntro }) {
  const { brand, model, subtitle, tagline, heroSpecs, specCategories } = CAR_SPECS_CONFIG;

  return (
    <div className="showcase-container animate-fade-in">
      {/* Top Header */}
      <header className="showcase-header">
        <div className="showcase-brand-block">
          <div className="showcase-badge">{subtitle}</div>
          <h1 className="showcase-title">{model}</h1>
          <p className="showcase-tagline">{tagline}</p>
        </div>

        {onReplayIntro && (
          <button 
            className="btn-replay" 
            onClick={onReplayIntro}
            aria-label="Replay intro cinematic"
          >
            <span>↺ REPLAY CINEMATIC</span>
          </button>
        )}
      </header>

      {/* Hero Metrics Row */}
      <section className="hero-specs-grid" aria-label="Key vehicle specifications">
        {heroSpecs.map((spec) => (
          <div key={spec.id} className="hero-spec-card">
            <div className="hero-spec-value">{spec.value}</div>
            <div className="hero-spec-unit">{spec.unit}</div>
            <div className="hero-spec-label">{spec.label}</div>
          </div>
        ))}
      </section>

      {/* Detailed Technical Specifications Sheet */}
      <section className="spec-sheet-section" aria-label="Detailed technical specifications">
        <div className="spec-categories-grid">
          {specCategories.map((cat) => (
            <div key={cat.category} className="spec-category-card">
              <h2 className="spec-category-title">{cat.category}</h2>
              <div className="spec-items-list">
                {cat.items.map((item) => (
                  <div key={item.label} className="spec-item-row">
                    <span className="spec-item-label">{item.label}</span>
                    <span className="spec-item-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
