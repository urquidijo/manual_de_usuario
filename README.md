# Manuales de Usuario — Sistema IoT de Diagnóstico Vehicular Preventivo OBD-II con IA (UAGRM)

Portal web desarrollado a puro frontend (HTML5, CSS3, JavaScript Vanilla) para visualizar y exportar a PDF los manuales oficiales de usuario del sistema de diagnóstico y gestión de flota vehicular de la UAGRM.

## 📁 Ubicación
`c:\Users\josue\OneDrive\Documentos\Auniversidad\taller\manual_de_usuario\`

## 🚀 Cómo abrir la aplicación
1. Haz doble clic en `index.html` para abrirlo en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Firefox, Brave).
2. O bien ábrelo desde PowerShell con:
   ```powershell
   Start-Process .\index.html
   ```

## 👥 Actores y Manuales de Usuario del Sistema IoT
1. **Parte 0 · Introducción y acceso a la plataforma (Común a todos los roles):**
   - Fundamentos de OBD-II, ECUs y clasificación de Códigos de Falla (DTCs: Powertrain P, Body B, Chassis C, Network U).
   - Tipos de códigos (Confirmados Modo 03, Pendientes Modo 07, Permanentes Modo 0A).
   - Requisitos de hardware (adaptador ELM327 Bluetooth Classic v1.5, smartphone Android 5.0 a 15) y software.
   - Acceso, credenciales de desarrollo y demostración (`taller123`).
   - Semáforo de salud de flota (`OK`, `ALERT`, `CRITICAL`) y glosario técnico vehicular.

2. **Parte 1 · Manual del Administrador de Flota (Dashboard Web):**
   - Panel de control y supervisión del estado global de la flota.
   - Catálogo maestro de vehículos: alta, edición de VIN, placas, modelos y asignación de inspector responsable.
   - Gestión y ciclo de vida de Órdenes de Trabajo: asignación a mecánicos, cambio de prioridad y cierre formal.
   - Expediente 360° del vehículo con historial acumulado de escaneos y fallas.
   - Gestión de usuarios y permisos (RBAC: `user:manage`, `vehicle:write`, `order:close`).
   - Exportación de reportes ejecutivos en PDF para Decanaturas y Dirección de Transporte.
   - Checklist operativo diario/semanal y preguntas frecuentes del Administrador.

3. **Parte 2 · Manual del Mecánico de Taller (Dashboard Web + App Móvil):**
   - Flujo de trabajo en taller: autoasignación de órdenes abiertas (`OPEN`), paso a `IN_PROGRESS`.
   - **Interpretación de la Hipótesis Técnica asistida por Inteligencia Artificial (Claude API)**:
     - Identificación de causas probables y nivel de confianza (ALTA, MEDIA, BAJA).
     - Pasos de verificación física y mediciones eléctricas sugeridas (bujías, bobinas, inyectores, sensores).
     - Correlación entre fallas simultáneas (ej. P0300 y P0301).
   - Registro de notas de taller y bitácora técnica de reparación.
   - Cierre de la orden (`COMPLETED` o `CANCELLED`) con firma de responsabilidad técnica.
   - Preguntas frecuentes del Mecánico (códigos permanentes, autoría de órdenes).

4. **Parte 3 · Manual del Inspector de Flota (App Móvil Flutter para Android):**
   - Preparación del adaptador ELM327 y localización del puerto OBD-II de 16 pines.
   - Emparejamiento por Bluetooth Classic en Android (PIN 1234/0000).
   - Procedimiento de escaneo paso a paso:
     1. Selección del vehículo por placa o código.
     2. Inicialización de protocolo AT y lectura de voltaje de batería (ej. 13.3V).
     3. Comprobación de monitores de emisiones (Readiness Mode 01 PID 01).
     4. Lectura de DTCs y envío seguro a la nube.
   - Uso del **Monitor en Vivo** local (RPM, temperatura del motor °C, velocidad km/h, voltaje alternador V).
   - Modo Simulador integrado para capacitación y pruebas sin vehículo físico.
   - Preguntas frecuentes del Inspector (fallo de conexión BT, sospecha de reseteo de batería).

## 🖨️ Exportación a PDF
- Para exportar el manual de un rol en particular, selecciónalo en la barra superior (ej. *Parte 3: Inspector*) y pulsa el botón **"Descargar / Imprimir PDF"** (o `Ctrl + P`).
- Para exportar el libro manual completo unificado, selecciona la pestaña **"Manual Completo"** y pulsa **"Descargar / Imprimir PDF"**.
- El diseño cuenta con estilos optimizados `@media print` para generar páginas A4 limpias, profesionales y numeradas, sin barras ni botones superfluos.
