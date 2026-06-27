# ServiDiesel — Historial de Servicios

Aplicación web para consultar y administrar el historial de servicios de **ServiDiesel**, con protección de datos personales conforme a la legislación chilena e ISO/IEC 27001.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | NestJS, TypeORM, SQLite, JWT, bcrypt |
| Seguridad | RBAC, auditoría, minimización de datos |

## Estructura

```
├── backend/     → API REST + auth + fotos + auditoría
└── frontend/    → UI pública, login cliente, panel staff
```

## Instalación

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run start:dev    # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

## Modelo de privacidad

| Dato | Acceso público (sin login) | Cliente autenticado | Staff |
|------|---------------------------|---------------------|-------|
| Patente, marca, modelo, año | ✓ | ✓ | ✓ |
| Tipo/fecha/descripción servicio | ✓ | ✓ | ✓ |
| Nombre y teléfono cliente | ✗ | ✓ | ✓ |
| Notas técnicas, costos | ✗ | ✓ | ✓ |
| Fotografías del vehículo | ✗ | ✓ | ✓ |

### Login cliente

Verifique identidad con **patente + teléfono** o **patente + nombre**:

- URL: `/login` o formulario en `/historial`
- Ejemplo: patente `KJBB12` + teléfono `+56912345678` o nombre `Carlos Mendoza`

### Login staff (admin / mecánico)

- URL: `/admin`
- Demo: `admin` / `Admin2024!` o `mecanico1` / `Mecanico2024!`

## Fotografías de servicio

Solo **admin** y **mecánico** pueden:

- Subir fotos **antes** y **después** del servicio
- Eliminar fotografías
- Gestionar desde el panel Staff → Servicios → icono cámara

Clientes autenticados pueden **ver** las fotos de su vehículo.

## Cumplimiento normativo

| Norma | Implementación |
|-------|----------------|
| **Ley 19.628** (Protección de datos) | Consentimiento explícito, minimización en vista pública, derecho de acceso |
| **Ley 21.459** (Activos digitales) | RBAC, auditoría, controles de acceso |
| **Ley 20.663** (Ciberseguridad) | Headers de seguridad, JWT, bcrypt, registro de accesos |
| **ISO/IEC 27001** | Control de acceso, logging, gestión de activos |
| **NIST CSF** | Identificar, Proteger (auth/RBAC), Detectar (audit logs) |

### Auditoría

- Todos los logins, accesos a historial y fotos quedan registrados
- Admin puede consultar: `GET /api/audit` (requiere JWT admin)
- Cliente puede ver accesos a sus datos: `GET /api/audit/my-access`

### Aviso de privacidad

Disponible en `GET /api/auth/privacy-notice` y banner en la página de historial.

## API principal

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/client/login` | — | Login cliente |
| POST | `/api/auth/staff/login` | — | Login staff |
| GET | `/api/vehicles/search?patente=` | — | Historial público (sin PII) |
| GET | `/api/vehicles/my-history?patente=` | Cliente JWT | Historial completo |
| POST | `/api/photos/service/:id` | Staff JWT | Subir foto |
| GET | `/api/photos/service/:id` | Cliente/Staff JWT | Listar fotos |
| GET | `/api/photos/:id/file` | Cliente/Staff JWT | Descargar foto |
| DELETE | `/api/photos/:id` | Staff JWT | Eliminar foto |

## Variables de entorno

### Backend (`.env`)

```
PORT=3001
JWT_SECRET=cambiar-en-produccion-minimo-32-caracteres
JWT_EXPIRES_IN=8h
DATABASE_PATH=./servidiesel.db
FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Datos de prueba

| Patente | Cliente | Teléfono | Login |
|---------|---------|----------|-------|
| KJBB12 | Carlos Mendoza | +56912345678 | teléfono o nombre |
| HYCD45 | María González | +56987654321 | teléfono o nombre |
| KJFG78 | Roberto Silva | +56911223344 | teléfono o nombre |

## Producción

1. Cambiar `JWT_SECRET` por un valor seguro (≥32 caracteres)
2. Usar HTTPS obligatorio
3. Configurar backup de `servidiesel.db` y carpeta `uploads/`
4. Revisar política de retención de audit logs
5. Designar responsable de protección de datos (Ley 19.628)


Cómo se usan las nuevas funciones

  Para el mecánico (admin):
  - Al subir cada foto, se calcula y guarda automáticamente el SHA-256
  - En PhotoManager cada miniatura muestra el hash corto (#a1b2c3d4...) y un botón "Verificar hash"
  - Si el hash calculado en tiempo real coincide con el almacenado → ✓ Íntegra; si no → ⚠ Alterada

  Para el cliente:
  - Ve el hash corto en cada miniatura como "huella digital" de la foto
  - Puede abrir el comparador lado a lado arrastrando el slider
  - Puede verificar la integridad de la foto desde el comparador

  Para disputas legales (Ley 19.628 + ISO 27001 A.8.24):
  - El hash SHA-256 sellado al momento de subir es prueba criptográfica de que la foto no fue manipulada después
  - Cada verificación queda auditada en audit_logs con IP, user agent y ambos hashes
  - Endpoint /photos/:id/integridad entrega resultado firmado con timestamp