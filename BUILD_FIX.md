# Solución para el error de build de Next.js

El error "lockfile missing swc dependencies" ocurre debido a problemas con el lockfile de Yarn antiguo.

## Solución:

Ejecuta los siguientes comandos en orden:

\`\`\`bash
# 1. Elimina el lockfile actual y node_modules
rm -rf node_modules yarn.lock

# 2. Reinstala las dependencias (esto regenerará el lockfile)
npm install

# 3. Intenta hacer el build nuevamente
npm run build
\`\`\`

## Alternativa si el problema persiste:

Si el error continúa, asegúrate de tener Node.js actualizado:

\`\`\`bash
node --version  # Debe ser v18 o superior
\`\`\`

Y usa npm en lugar de yarn:

\`\`\`bash
npm install
npm run build
\`\`\`

## Por qué ocurre esto:

Next.js 16 usa dependencias opcionales de SWC (un compilador rápido) que varían según la plataforma (Windows, Mac, Linux). Yarn 1.x a veces no maneja correctamente estas dependencias opcionales en el lockfile, causando que falten las dependencias necesarias para tu plataforma específica.
