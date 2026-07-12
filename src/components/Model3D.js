import React from 'react';
import './Model3D.css';

/*
  Inline 3D character viewer. Loads lazily (when scrolled into view) — no click
  gate — and is view-only: rotate/zoom, but no download affordance.
*/
function Model3D({ src, label, orbit, zoom, zoomFull, className, target, animated }) {
  const anim = animated ? { autoplay: true } : {};
  return (
    <div className={'m3d' + (zoom ? ' m3d-zoom' : '') + (zoomFull ? ' m3d-zoom-full' : '') + (className ? ' ' + className : '')}>
      <div className="m3d-stage">
        <model-viewer
          src={src}
          shadow-intensity="0.7"
          exposure="1.05"
          interaction-prompt="none"
          camera-orbit={orbit || '-22deg 82deg 100%'}
          camera-target={target}
          min-camera-orbit="auto auto 5%"
          max-camera-orbit="auto auto 1000%"
          disable-zoom=""
          disable-pan=""
          disable-tap=""
          loading="lazy"
          {...anim}
        />
      </div>
      {label ? <span className="m3d-label">{label}</span> : null}
    </div>
  );
}

export default Model3D;
