import React from 'react';
import './Decor3D.css';

/*
  Ambient 3D decoration woven into a section — auto-rotating, transparent,
  non-interactive (pointer-events off), lazy-loaded. Not a preview card.
*/
function Decor3D({ src, className, orbit }) {
  return (
    <div className={'decor3d ' + (className || '')} aria-hidden="true">
      <model-viewer
        src={src}
        interaction-prompt="none"
        disable-zoom=""
        disable-tap=""
        loading="lazy"
        camera-orbit={orbit}
      />
    </div>
  );
}

export default Decor3D;
