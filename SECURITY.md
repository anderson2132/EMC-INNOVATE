# Política de Seguridad

Este es un sitio estático (HTML/CSS/JS) sin backend ni base de datos. No procesa
ni almacena datos sensibles: el formulario de contacto es una demo local y no
envía información a ningún servidor.

## Reportar una vulnerabilidad

Si encuentras un problema de seguridad en este repositorio o en el sitio
publicado, repórtalo abriendo un issue o escribiendo a contacto@emcinnovate.com.

## Medidas aplicadas

- Escaneo de secretos (Secret scanning) y protección contra push de secretos.
- Alertas y actualizaciones automáticas de Dependabot.
- Rama `main` protegida contra force-push y borrado.
- Content-Security-Policy y Referrer-Policy configurados en el sitio.
