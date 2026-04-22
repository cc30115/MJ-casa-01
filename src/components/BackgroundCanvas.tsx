import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // We disable reduced motion check for now, or respect it if needed.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, preserveDrawingBuffer: false });
    if (!gl) return;

    const vertSrc = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    const fragSrc = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform float u_foldSpeed;
      uniform float u_layerCount;
      uniform vec2 u_mouse;

      float hash11(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }

      float hash21(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      vec2 hash22(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.xx + p3.yz) * p3.zy);
      }

      float vnoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; i++) {
          v += a * vnoise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      vec2 tectonicWarp(vec2 uv, float t) {
        float slow = t * 0.15;
        float warpX = fbm(uv * 1.5 + vec2(slow * 0.7, slow * 0.3)) - 0.5;
        float warpY = fbm(uv * 1.5 + vec2(slow * 0.5 + 50.0, slow * 0.8 + 30.0)) - 0.5;
        float compress = sin(uv.x * 2.0 + slow * 0.4) * 0.08;
        float shear = sin(uv.y * 3.0 + slow * 0.6) * 0.06;
        return vec2(uv.x + warpX * 0.25 + shear, uv.y + warpY * 0.18 + compress);
      }

      float layerBoundary(float x, float baseY, float idx, float t) {
        float h1 = hash11(idx * 7.13);
        float h2 = hash11(idx * 13.37);
        float h3 = hash11(idx * 23.71);
        float freq1 = 1.5 + h1 * 2.5;
        float freq2 = 3.0 + h2 * 3.0;
        float amp1 = 0.04 + h1 * 0.06;
        float amp2 = 0.015 + h2 * 0.025;
        float phase1 = t * (0.1 + h3 * 0.15);
        float phase2 = t * (0.08 + h1 * 0.12);
        float fold = amp1 * sin(x * freq1 + phase1 + h2 * 6.28);
        fold += amp2 * sin(x * freq2 + phase2 + h3 * 6.28);
        fold += 0.02 * vnoise(vec2(x * 4.0 + h1 * 100.0, t * 0.2 + idx));
        return baseY + fold;
      }

      vec3 stratumColor(float idx, float maxLayers) {
        vec3 colors[7];
        colors[0] = vec3(145.0, 105.0, 60.0) / 255.0;
        colors[1] = vec3(190.0, 155.0, 105.0) / 255.0;
        colors[2] = vec3(215.0, 195.0, 155.0) / 255.0;
        colors[3] = vec3(225.0, 205.0, 165.0) / 255.0;
        colors[4] = vec3(115.0, 85.0, 55.0) / 255.0;
        colors[5] = vec3(165.0, 120.0, 75.0) / 255.0;
        colors[6] = vec3(230.0, 218.0, 190.0) / 255.0;
        float h = hash11(idx * 17.31 + 3.7);
        int ci = int(mod(floor(h * 7.0), 7.0));
        vec3 base;
        if (ci == 0) base = colors[0];
        else if (ci == 1) base = colors[1];
        else if (ci == 2) base = colors[2];
        else if (ci == 3) base = colors[3];
        else if (ci == 4) base = colors[4];
        else if (ci == 5) base = colors[5];
        else base = colors[6];
        float h2 = hash11(idx * 31.17);
        base += (h2 - 0.5) * 0.06;
        return base;
      }

      float grainTexture(vec2 uv, float layerIdx) {
        float h = hash11(layerIdx * 41.93);
        float fiberAngle = h * 3.14 * 0.3;
        float ca = cos(fiberAngle), sa = sin(fiberAngle);
        vec2 rotUV = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);
        float fiber1 = vnoise(vec2(rotUV.x * 120.0, rotUV.y * 18.0) + layerIdx * 30.0);
        float fiber2 = vnoise(vec2(rotUV.x * 80.0, rotUV.y * 12.0) + layerIdx * 50.0 + 100.0);
        float intensity = fiber1 * 0.08 + fiber2 * 0.05;
        float cross = vnoise(vec2(rotUV.x * 15.0, rotUV.y * 70.0) + layerIdx * 40.0);
        intensity += cross * 0.03;
        intensity += vnoise(uv * 50.0 + layerIdx * 25.0) * 0.025;
        return intensity - 0.04;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float aspect = u_res.x / u_res.y;
        vec2 uvAspect = vec2(uv.x * aspect, uv.y);

        float t = u_time * u_foldSpeed;
        float layerCount = floor(u_layerCount);

        vec2 warped = tectonicWarp(uvAspect, t);
        vec2 mOff = vec2(0.0);
        if (u_mouse.x >= 0.0) {
          mOff = (u_mouse - 0.5) * vec2(-0.12, -0.06);
        }

        float layerSpacing = 1.0 / (layerCount + 1.0);
        float currentLayer = -1.0;
        float layerPos = 0.0;
        float prevBound = -0.2;

        for (int i = 0; i < 24; i++) {
          if (float(i) >= layerCount) break;
          float fi = float(i);
          float baseY = (fi + 1.0) * layerSpacing;
          float layerDepth = fi / layerCount;
          float px = warped.x + mOff.x * (0.3 + layerDepth * 1.5);
          float bound = layerBoundary(px, baseY, fi, t);
          bound += mOff.y * (0.1 + layerDepth * 0.4);
          if (warped.y >= prevBound && warped.y < bound) {
            currentLayer = fi;
            float thickness = bound - prevBound;
            layerPos = (warped.y - prevBound) / max(thickness, 0.001);
            break;
          }
          prevBound = bound;
        }

        if (currentLayer < 0.0) {
          currentLayer = layerCount;
          layerPos = 0.5;
        }

        vec3 col = stratumColor(currentLayer, layerCount);
        float grain = grainTexture(warped, currentLayer);
        col += grain;

        float edgeShade = smoothstep(0.0, 0.15, layerPos) * smoothstep(1.0, 0.85, layerPos);
        col *= 0.85 + 0.15 * edgeShade;

        float edgeShadow = smoothstep(0.0, 0.08, layerPos);
        col *= 0.82 + 0.18 * edgeShadow;
        float topHighlight = smoothstep(1.0, 0.92, layerPos);
        col += vec3(0.04, 0.035, 0.025) * (1.0 - topHighlight);

        float vig = 1.0 - 0.3 * length((uv - 0.5) * 1.5);
        col *= vig;

        float paperTex = vnoise(gl_FragCoord.xy * 0.15) * 0.03;
        paperTex += (hash21(gl_FragCoord.xy + fract(u_time * 0.1) * 1000.0) - 0.5) * 0.015;
        col += paperTex;

        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(lum), col, 0.82);
        col = pow(col, vec3(0.95, 1.0, 1.08));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if(!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    
    const vShader = compile(gl.VERTEX_SHADER, vertSrc);
    const fShader = compile(gl.FRAGMENT_SHADER, fragSrc);
    
    if (vShader) gl.attachShader(prog, vShader);
    if (fShader) gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uFoldSpeed = gl.getUniformLocation(prog, 'u_foldSpeed');
    const uLayerCount = gl.getUniformLocation(prog, 'u_layerCount');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const foldSpeedVal = 0.5;
    const layerCountVal = 16.0;
    
    let mx = -1.0;
    let my = -1.0;
    let smoothMX = -1.0;
    let smoothMY = -1.0;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let needsResize = true;
    let running = true;
    let rafId: number;

    function resize() {
      if (!canvas || !gl) return;
      needsResize = false;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }

    function render(now: number) {
      if (!running || !gl) { 
          rafId = requestAnimationFrame(render); 
          return; 
      }
      if (needsResize) resize();
      
      gl.uniform1f(uTime, prefersReduced ? 0.0 : now * 0.001);
      gl.uniform1f(uFoldSpeed, foldSpeedVal);
      gl.uniform1f(uLayerCount, layerCountVal);
      
      if (mx >= 0.0) {
        smoothMX += (mx - smoothMX) * 0.06;
        smoothMY += (my - smoothMY) * 0.06;
      } else {
        smoothMX = -1.0; smoothMY = -1.0;
      }
      gl.uniform2f(uMouse, smoothMX, smoothMY);
      
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(render);
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1.0 - e.clientY / window.innerHeight;
    };
    
    const mouseLeaveHandler = () => {
      mx = -1.0;
      my = -1.0;
    };

    const handleResize = () => { needsResize = true; };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseleave', mouseLeaveHandler);

    resize();
    rafId = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseleave', mouseLeaveHandler);
      window.removeEventListener('resize', handleResize);
      // Clean up WebGL context memory
      gl.deleteProgram(prog);
      if (vShader) gl.deleteShader(vShader);
      if (fShader) gl.deleteShader(fShader);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-[100dvh] pointer-events-none z-0"
      style={{
        opacity: 0.08, // Subtle texture presence
        mixBlendMode: 'screen'
      }}
    />
  );
}
