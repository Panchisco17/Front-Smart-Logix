# SmartLogix - Frontend (React + Vite)

Interfaz web de SmartLogix: consume el `api-gateway` del backend
(`Back-Smart-Logix`) para ofrecer una tienda con carrito, checkout con pago
real vía Transbank Webpay Plus, cupones de descuento, y paneles
administrativos de inventario, órdenes, envíos, cupones y usuarios.

## Requisitos

- Docker Desktop (forma recomendada de levantar el frontend, ver abajo)
- Node.js 18+ y npm (solo si se quiere correr en modo desarrollo con hot-reload)
- El backend (`Back-Smart-Logix`) corriendo, con `api-gateway` expuesto en
  `http://localhost:8080` (ver README de ese repositorio para levantarlo con
  `.\run-docker.ps1`)

## Ejecución (recomendado: Docker)

```powershell
.\run-frontend.ps1
```

Esto construye la app (`npm run build`) y la sirve con nginx dentro de un
contenedor Docker, en `http://localhost` (puerto 80). Es la forma estable de
probar la plataforma completa: no depende de una ventana de terminal abierta
ni de un proceso de desarrollo que se pueda caer solo — se comporta igual que
el resto de los microservicios del backend. El costo es que **no tiene
hot-reload**: si cambias código, hay que volver a correr `.\run-frontend.ps1`
para reconstruir la imagen.

Para detenerlo:

```powershell
docker compose down
```

## Ejecución (alternativa: modo desarrollo con hot-reload)

Útil solo si estás editando código activamente y quieres ver los cambios al
instante, sin reconstruir. No se recomienda para simplemente "probar la app".

```powershell
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`. Ten en cuenta que
`payment-service` (backend) redirige después del pago a la URL configurada en
`app.frontend.*` de su `application.yml`, que por defecto apunta al frontend
dockerizado (`http://localhost`, puerto 80) — si pruebas el flujo de pago
completo en modo desarrollo, exporta las variables de entorno
`FRONTEND_SUCCESS_URL` / `FRONTEND_FAILURE_URL` / `FRONTEND_PENDING_URL`
apuntando a `http://localhost:5173/...` antes de levantar `payment-service`,
o simplemente prueba el pago contra la versión dockerizada.

El cliente HTTP (`src/api/httpClient.js`) apunta de forma fija a
`http://localhost:8080` (el `api-gateway`); si el backend corre en otro
host/puerto, actualizar `API_URL_BASE` en ese archivo.

## Linter

```powershell
npm run lint
```

## Cómo probar el flujo completo

No hay un backend de pruebas separado: se prueba contra los usuarios
sembrados (seed) que ya trae `auth-service` al levantar el backend por
primera vez.

1. Levantar el backend completo (`.\run-docker.ps1` en `Back-Smart-Logix`) y
   luego el frontend (`.\run-frontend.ps1` en este repositorio).
2. Ir a `http://localhost` e iniciar sesión con uno de los usuarios seed:

   | Usuario | Password | Rol |
   |---|---|---|
   | `admin` | `admin123` | `ROLE_ADMIN` |
   | `usuario` | `user123` | `ROLE_USER` |
   | `bodeguero` | `bodega123` | `ROLE_WAREHOUSE_MANAGER` |

3. Como `usuario`: entrar a **Tienda**, agregar productos al carrito,
   aplicar un cupón (`2X1`, `DUOC25` o `SMART5000`, ver condiciones en
   `Back-Smart-Logix/docs/PAGOS-Y-CUPONES.md`) y pagar. El botón de pago
   redirige al sitio real de Transbank (ambiente de integración/sandbox);
   usar la tarjeta de prueba VISA `4051885600446623` (cualquier CVV y fecha
   futura) para aprobar el pago, o la Mastercard `5186059559590568` para
   simular un rechazo. Verificar el resultado en **Mis Pedidos**.
4. Como `admin`: revisar **Cupones** (crear/editar/activar-desactivar) y
   **Usuarios** (cambiar rol o suspender una cuenta — no aplica sobre la
   propia sesión).
5. Como `admin` o `bodeguero`: revisar **Inventario**, **Órdenes** y
   **Envíos**.
6. Para confirmar que la corrección de seguridad de roles funciona: iniciar
   sesión como `usuario`, abrir las DevTools → Application → Local Storage y
   editar el campo `role` del objeto `user` a `"ROLE_ADMIN"`. Al recargar la
   página **no** deben aparecer los menús de administrador — el rol mostrado
   en la interfaz y validado en cada llamada al backend se obtiene del JWT
   firmado (`src/service/authService.js`), no de ese objeto editable.

## Pantallas (rutas internas por hash, sin librería de routing)

Definidas en `src/App.jsx` (`PRIVATE_ROUTER`), cada una visible solo para los
roles indicados en el menú lateral:

| Pantalla | Ruta | Componente | Roles con acceso |
|---|---|---|---|
| Inicio de sesión | — | `src/pages/Login.jsx` | Pública (sin sesión) |
| Registro | — | `src/pages/Register.jsx` | Pública (sin sesión) |
| Tienda (catálogo, carrito, cupón, checkout) | `#/products` | `src/pages/Products.jsx` | `ROLE_USER`, `ROLE_ADMIN` |
| Mis Pedidos | `#/my-orders` | `src/pages/MyOrders.jsx` | `ROLE_USER`, `ROLE_ADMIN` |
| Inventario | `#/inventory` | `src/pages/Inventory.jsx` | `ROLE_ADMIN`, `ROLE_WAREHOUSE_MANAGER` |
| Órdenes | `#/order` | `src/pages/Order.jsx` | `ROLE_ADMIN`, `ROLE_WAREHOUSE_MANAGER` |
| Envíos | `#/shipment` | `src/pages/Shipments.jsx` | `ROLE_ADMIN`, `ROLE_WAREHOUSE_MANAGER` |
| Gestión de Cupones | `#/coupons` | `src/pages/Coupons.jsx` | `ROLE_ADMIN` |
| Gestión de Usuarios | `#/users` | `src/pages/Users.jsx` | `ROLE_ADMIN` |

La pasarela de pago (formulario de tarjeta y confirmación) no es una pantalla
de esta SPA: es una página real servida por Transbank a la que el navegador
es redirigido desde **Tienda**, y que al finalizar redirige de vuelta a
**Mis Pedidos** con el resultado del pago.

## Estructura relevante del código fuente

```
src/
├── api/            # funciones fetch por dominio (authApi, httpClient, etc.)
├── service/        # reglas de negocio del front (authService: login, JWT, sesión)
├── pages/          # una pantalla por archivo (ver tabla de pantallas)
├── assets/         # imágenes estáticas (ej. logo RedCompra)
└── App.jsx         # layout, menú lateral por rol y enrutamiento por hash
```

## Notas de seguridad

El rol y el nombre de usuario que la interfaz usa para decidir qué mostrar
se leen siempre del **JWT decodificado** (`getSaveUser()` en
`src/service/authService.js`), nunca del objeto `user` guardado en
`localStorage` en texto plano. Esto evita que editar ese objeto desde las
DevTools otorgue acceso visual a pantallas de administrador — y aunque lo
hiciera, cada llamada sensible al backend está protegida de forma
independiente con `@PreAuthorize` por rol (ver README de
`Back-Smart-Logix`), así que la UI nunca es la única barrera.
