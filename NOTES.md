# Notes

## Preferencias de la alumna
- Alumna: **Carmen**. Hispanohablante. (La cuenta/terminal es de Peter, su pareja: inglés C2, hace de profesor en casa.) Instrucción en español por ahora.
- Clases ~30 min. Formato mezcla: explicación breve → ejercicios variados → hablar en voz alta.
- Acento británico. **Voz femenina** en todo el audio Carmen usa **solo Chrome** — abrir lecciones con `open -a "Google Chrome" …`. La única voz femenina británica decente en este Mac es "Google UK English Female" (Chrome, online). Las voces del sistema Flo/Shelley/Sandy suenan rotas — Carmen las rechazó. Cada lección lleva un selector de voz (`data-voice-picker`).
- Trabajo actual: limpieza en un hospital. Meta: event manager. → Vocabulario en dos capas: (1) describir su trabajo actual y su plan de cambio (entrevistas), (2) reuniones, emails, proveedores, agenda, logística de eventos.
- Viaja → aeropuerto, hotel, restaurante, direcciones.
- Practica hablando a diario con Peter (C2) → cada lección termina con una "misión real" de 2–5 min con él, con instrucciones explícitas para él de qué corregir. Es el feedback loop principal.
- Sabe: palabras sueltas (hello, thank you, números). Nada activo.

## Pendiente de averiguar
- ¿De dónde es Carmen y dónde viven? (email .se → ¿Suecia?). Necesario para personalizar "I'm from… / I live in…".
- ¿Peter es nativo o C2 no nativo? ¿Qué acento tiene? (si no es británico, decidir si importa)
- ¿Tiene móvil con Anki o prefiere las flashcards del navegador?

## Decisiones didácticas
- Cada lección: 1 skill + ≤ 8 frases nuevas. No más.
- Errores típicos de hispanohablante que vigilar: "Me too" por "You too"; "I have 30 years"; e- delante de s+consonante (Espain); pronunciar la r final británica; omitir el sujeto ("Is good"); confundir "in/on/at"; vocales largas/cortas (sheep/ship).
- Repaso espaciado: cada lección nueva abre con 5 preguntas de lecciones anteriores (interleaving).
- Peter puede corregir con criterio: las misiones reales pueden pedirle feedback concreto (p. ej. "corrige solo la pronunciación de work").
- Quizzes: opciones con el mismo número de palabras. Sin pistas de formato.

## Registro de sesiones
- 2026-09-12: sesión 0. Misión, recursos, assets, lección 0001 (presentarse). Correcciones mid-sesión: trabajo actual limpieza hospital → meta event manager; alumna es Carmen, no Peter.

## Publicación
- GitHub Pages: https://germanicus1.github.io/english-a1/ (repo `Germanicus1/english-a1`, público, rama `pages`, ruta `/`). Cada lección nueva: commit + push a `pages` (solo cuando Peter lo pida). Carmen lo abre en Safari en el iPhone.
- **Audio pregenerado** (decisión 2026-09-12): las voces del navegador en iPhone/Mac sonaban rotas → cada frase se genera como mp3 con `tools/gen-audio.py` (edge-tts, voz `en-GB-SoniaNeural`, rate −15%) en `assets/audio/` + `manifest.json`. speak.js reproduce el mp3 y solo usa TTS del navegador para texto dinámico. **Después de escribir cada lección nueva: ejecutar el script antes de commit.** Venv: `/private/tmp/…/scratchpad/tts` (temporal; recrear con `python3 -m venv ~/.venvs/tts && ~/.venvs/tts/bin/pip install edge-tts` si desaparece).
- 2026-09-15: audio mp3 confirmado ("sounds much better") en iPhone. Sesión cerrada. **Siguiente**: preguntar a Carmen cómo fue la misión real de la lección 1 y qué corrigió Peter; con eso diseñar la lección 0002 (abrir con 5 preguntas de repaso de la 0001). Pendientes de la sección "Pendiente de averiguar".
