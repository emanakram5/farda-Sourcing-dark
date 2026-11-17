import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* One set of cubes that morphs: Farda logo -> container stack -> global sphere, driven by scroll. */
const N = 460, CUBE = 0.19;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

function buildTargets() {
  // Logo rects (same geometry as Logo.jsx): x, y, w, h, isGreen
  const rects = [[0, 0, 42, 145, 0], [48, 0, 90, 43, 0], [48, 50, 46, 44, 0], [94, 100, 44, 44, 1]];
  const logo = [], green = [];
  for (const [x, y, w, h, g] of rects)
    for (let cx = 0; cx < Math.round(w / 10); cx++)
      for (let cy = 0; cy < Math.round(h / 10); cy++)
        for (const z of [-0.5, 0.5]) {
          logo.push(new THREE.Vector3((x + cx * 10 + 5 - 70) * 0.022, -(y + cy * 10 + 5 - 72) * 0.022, z * 0.21));
          green.push(g);
        }
  const L = [], T = [], S = [], col = [], sc = [];
  const silver = new THREE.Color('#e6ebe4'), lime = new THREE.Color('#70D900');
  for (let i = 0; i < N; i++) {
    if (i < logo.length) { L.push(logo[i]); sc.push(1); col.push(green[i] ? lime : silver); }
    else {
      const r = 3 + Math.random() * 2.6, a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
      L.push(new THREE.Vector3(r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)));
      sc.push(0.45 + Math.random() * 0.5); col.push(Math.random() < 0.3 ? lime : silver);
    }
    // container-stack lattice
    const cx = i % 10, cy = Math.floor(i / 10) % 8, cz = Math.floor(i / 80);
    T.push(new THREE.Vector3((cx - 4.5) * 0.42, (cy - 3.5) * 0.42, (cz - 2.5) * 0.42));
    // fibonacci globe
    const k = i + 0.5, phi = Math.acos(1 - 2 * k / N), th = Math.PI * (1 + Math.sqrt(5)) * k;
    S.push(new THREE.Vector3(2.3 * Math.sin(phi) * Math.cos(th), 2.3 * Math.cos(phi), 2.3 * Math.sin(phi) * Math.sin(th)));
  }
  return { L, T, S, col, sc };
}

export default function Scene3D() {
  const host = useRef(null);
  const { pathname } = useLocation();
  const isHome = useRef(true);
  const story = pathname === '/';
  isHome.current = story;

  useEffect(() => {
    const el = host.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch { return; } // no WebGL: page still works on the dark background
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    cam.position.set(0, 0, 9);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.add(new THREE.AmbientLight('#ffffff', 0.25));
    const key = new THREE.DirectionalLight('#ffffff', 2.2); key.position.set(4, 5, 6); scene.add(key);
    const glow = new THREE.PointLight('#70D900', 40, 14); glow.position.set(-3, -1, 3); scene.add(glow);

    const { L, T, S, col, sc } = buildTargets();
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(CUBE, CUBE, CUBE),
      new THREE.MeshStandardMaterial({ metalness: 0.75, roughness: 0.22, envMapIntensity: 1.2 }), N);
    col.forEach((c, i) => mesh.setColorAt(i, c));
    const group = new THREE.Group(); group.add(mesh); scene.add(group);
    const rnd = Array.from({ length: N }, () => new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).multiplyScalar(2));
    const spin = Array.from({ length: N }, () => Math.random() * 6.283);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; };
    addEventListener('pointermove', onMove);
    const resize = () => { renderer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); };
    resize(); addEventListener('resize', resize);

    const dummy = new THREE.Object3D(), v = new THREE.Vector3();
    let p = 0, raf = 0, t0 = performance.now();
    const frame = (now) => {
      const t = (now - t0) / 1000;
      if (document.querySelector('.afly')) { raf = requestAnimationFrame(frame); return; }
      const cine = document.querySelector('.cine');
      let target;
      if (cine) target = clamp(scrollY / Math.max(1, cine.offsetHeight - innerHeight));
      else target = 0.62 + 0.38 * clamp(scrollY / Math.max(1, document.body.scrollHeight - innerHeight));
      p += (target - p) * 0.06;
      const s = p * 2, a = smooth(clamp(s)), b = smooth(clamp(s - 1));
      const burst = Math.sin(a * Math.PI) + Math.sin(b * Math.PI);
      for (let i = 0; i < N; i++) {
        v.copy(L[i]).lerp(T[i], a).lerp(S[i], b).addScaledVector(rnd[i], burst * 0.9);
        v.y += Math.sin(t * 0.8 + spin[i]) * 0.04;
        dummy.position.copy(v);
        dummy.rotation.set(burst * spin[i], burst * spin[i] * 0.7, 0);
        dummy.scale.setScalar(sc[i] + (1 - sc[i]) * a);
        dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      const wide = innerWidth > 900, home = isHome.current;
      const tx = !wide ? 0 : home ? (1 - a) * 2.1 : 2.6;
      group.position.x += (tx - group.position.x) * 0.06;
      group.position.y += ((wide ? 0 : 1.6) - group.position.y) * 0.06;
      group.rotation.y = (reduce ? 0 : t * 0.12) + p * 5.2 + mouse.x * 0.7;
      group.rotation.x = mouse.y * 0.35 + Math.sin(p * 6.283) * 0.15;
      glow.position.x = -3 + mouse.x * 4;
      cam.position.z = (wide ? 9 : 12) - a * 1.2 + b * 0.8;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } };
    document.addEventListener('visibilitychange', vis);
    return () => {
      cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', vis);
      mesh.geometry.dispose(); mesh.material.dispose(); pm.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`scene3d ${story ? '' : 'scene3d--dim'}`} aria-hidden="true" />;
}