# Política de Seguridad de la Información — ServiDiesel

Documento de referencia alineado con ISO/IEC 27001, NIST Cybersecurity Framework y legislación chilena aplicable.

## 1. Alcance

Esta política cubre el sistema de historial de servicios automotrices (frontend Next.js, backend NestJS, base SQLite, almacenamiento de fotografías).

## 2. Marco legal

- **Ley N° 19.628** — Protección de la Vida Privada: consentimiento, finalidad, derechos ARCO.
- **Ley N° 21.459** — Protección de Activos Digitales: medidas de seguridad sobre activos digitales.
- **Ley N° 20.663** — Delitos informáticos: prevención de accesos no autorizados.
- **Ley N° 19.799** — Documentos electrónicos: integridad de registros digitales (audit logs).

## 3. Clasificación de datos

| Clase | Ejemplos | Controles |
|-------|----------|-----------|
| Público | Patente, marca, tipo de servicio | Sin restricción |
| Personal | Nombre, teléfono cliente | Auth cliente + consentimiento |
| Confidencial | Notas técnicas, costos | Auth cliente/staff |
| Restringido | Fotografías del vehículo | Auth + audit log |

## 4. Controles implementados

### Acceso (ISO 27001 A.9)
- RBAC: `admin`, `mechanic`, `client`
- JWT con expiración configurable
- Contraseñas staff con bcrypt (factor 12)

### Criptografía (ISO 27001 A.10)
- Passwords hasheados con bcrypt
- JWT firmado con HMAC-SHA256
- HTTPS recomendado en producción

### Operaciones (ISO 27001 A.12)
- Registro de auditoría inmutable (AuditLog)
- Headers de seguridad HTTP
- Validación de entrada (class-validator)

### Minimización (Ley 19.628 Art. 4)
- Endpoint público excluye PII
- Fotos servidas solo con token válido

## 5. Responsabilidades

- **Administrador**: gestión de usuarios staff, revisión de audit logs.
- **Mecánico**: registro de servicios y fotografías.
- **Titular de datos**: acceso, rectificación vía contacto privacidad@servidiesel.cl.

## 6. Incidentes

Ante una brecha de datos (Ley 21.459):
1. Contener el acceso
2. Revisar audit logs
3. Notificar al titular si hay riesgo para datos personales
4. Documentar el incidente

## 7. Retención

- Historial de servicios: mientras exista relación comercial + plazo legal.
- Audit logs: mínimo 12 meses.
- Fotografías: vinculadas al servicio, eliminables por admin.

---

*Última revisión: 2025-06-12*
