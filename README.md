# EScriptor - Editor de Guiones Cinematográficos

Una aplicación web profesional para la escritura de guiones cinematográficos, clonando el comportamiento de Celtx, desarrollada con JavaScript vanilla, HTML5 y CSS3.

## Características

### 1. Interfaz Modular
- **Menú Lateral**: Listado dinámico de escenas y personajes
- **Barra Superior**: Selector de estilos, guardar, exportar
- **Zona Central**: Editor WYSIWYG con múltiples páginas
- **Barra Inferior**: Estadísticas en tiempo real

### 2. Sistema de Estilos Cinematográficos
- **Acto**: Texto centrado en mayúsculas
- **Título de escena**: INT./EXT. - LUGAR - HORA
- **Acción**: Descripción de escenas
- **Personaje**: Mayúsculas, centrado con sangría de 10cm
- **Diálogo**: Margen izquierdo 5cm, derecho 2.5cm
- **Acotaciones**: Margen izquierdo 8cm
- **Transición**: Mayúsculas, alineado a la derecha
- **Toma**: Mayúsculas
- **Texto**: Uso general

### 3. Máquina de Estados (Teclado)
**ENTER**: Crea nuevo bloque con transición automática de estilos
```
Título de escena → Acción
Personaje → Diálogo
Diálogo → Personaje
Acción → Acción
Acto → Título de escena
etc.
```

**TAB**: Cicla por estilos sin saltar de línea
```
Escena → Acción → Diálogo → Personaje → Acotaciones → etc.
```

### 4. Validación y Restricciones
- Máximo 5 líneas por párrafo (restrictivo)
- 4 líneas: Aviso amarillo
- 5 líneas: Aviso rojo
- Placeholders grises que desaparecen al escribir

### 5. Funcionalidades
- **Detección automática** de escenas y personajes
- **Menú lateral dinámico** que se actualiza en tiempo real
- **Estadísticas**: Páginas, palabras, tiempo estimado (1 min/página)
- **Exportación**: TXT, DOCX, FDX
- **Almacenamiento**: Servidor PHP

## Estructura de Archivos

```
EScriptor/
├── index.html
├── src/
│   ├── js/
│   │   ├── app.js                 # Lógica principal
│   │   ├── scriptManager.js       # Gestión de escenas/personajes
│   │   └── storage.js             # Guardar/cargar/exportar
│   ├── components/
│   │   ├── navbar.js              # Barra superior
│   │   ├── center.js              # Zona central (editor)
│   │   ├── footer.js              # Barra inferior
│   │   ├── sidebar.js             # Menú lateral
│   │   └── autocomplete.js        # Autocomplete de personajes
│   ├── php/
│   │   ├── save.php               # Guardar guiones
│   │   ├── load.php               # Cargar/listar guiones
│   │   └── export.php             # Exportar a formatos
│   └── styles/
│       └── app.css                # Estilos globales
├── scripts/                       # Carpeta para guiones guardados
└── README.md
```

## Cómo Usar

### Instalación
1. Clonar o descargar el repositorio
2. Servir con PHP (Apache, Nginx, etc.)
3. Acceder a `http://localhost/path/to/EScriptor`

### Creación de Guión
1. Rellenar título y autor en la portada
2. Escribir en el editor de la página 2
3. Usar ENTER para crear nuevo bloque
4. Usar TAB para cambiar estilos
5. Usar el selector de estilos para cambios manuales

### Guardar y Exportar
- **Guardar**: Guarda en servidor PHP
- **Guardar como**: Guarda con nombre personalizado
- **Exportar**: Descarga en TXT, DOCX o FDX

## Requisitos
- PHP 8.3+
- Navegador moderno (ES6+)
- Acceso a escritura en servidor para carpeta `scripts/`

## Notas de Desarrollo
- No utiliza librerías externas (vanilla JavaScript)
- Preparado para integración con Apache/PHP 8.3
- Código modular y reutilizable
- Comentarios mínimos en código limpio

## Características Futuras
- Colaboración en tiempo real
- Historial de cambios
- Búsqueda y reemplazo
- Generación de reportes
- Soporte para fuentes personalizadas
