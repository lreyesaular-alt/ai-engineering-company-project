# Propuesta de Arquitectura de Backend - Brasaland

## 1. Patrón arquitectónico

Se propone una arquitectura por capas dentro de un monolito modular.

La arquitectura separará las responsabilidades principales del backend en
las siguientes capas:

- **API:** recibe las peticiones HTTP y devuelve las respuestas.
- **Servicios:** contiene la lógica de negocio y coordina las operaciones.
- **Dominio:** contiene las entidades y reglas principales del negocio.
- **Persistencia:** se encarga del acceso y almacenamiento de los datos.

Esta arquitectura se considera adecuada para Brasaland porque la empresa
cuenta actualmente con 14 restaurantes distribuidos entre Colombia y
Estados Unidos y necesita una plataforma digital que pueda crecer de forma
organizada.

El uso de un monolito modular permite mantener el sistema relativamente
sencillo de desarrollar y desplegar, mientras que la separación por capas
evita mezclar la lógica de negocio con los endpoints o el acceso a los
datos.

La arquitectura también permite incorporar progresivamente nuevas
funcionalidades relacionadas con clientes, fidelización, restaurantes,
inventario, proveedores y compras.
## 2. Estructura de carpetas y módulos

Se propone organizar el backend de la siguiente manera:

```text
services/
└── backend/
    ├── app/
    │   ├── api/
    │   │   └── routers/
    │   ├── services/
    │   ├── domain/
    │   ├── repositories/
    │   ├── models/
    │   ├── config/
    │   └── main.py
    └── README.md
```
- **models/:** contiene los modelos utilizados para representar y validar los
  datos que maneja la API.
- **config/:** contiene la configuración de la aplicación y los valores que
  pueden variar según el entorno.

## 3. Endpoints y routers de FastAPI

Los endpoints se organizarán mediante routers independientes para separar las
funcionalidades de la aplicación.

Se propone la siguiente organización:

```text
app/
└── api/
    └── routers/
        ├── customers.py
        ├── restaurants.py
        ├── loyalty.py
        ├── inventory.py
        ├── suppliers.py
        └── purchases.py
```
## 4. Convenciones de FastAPI

El backend utilizará FastAPI como framework para construir la API.

Se propone seguir estas convenciones:

- Utilizar `APIRouter` para organizar los endpoints por dominio.
- Mantener los routers enfocados en recibir peticiones y devolver respuestas.
- Utilizar modelos de datos para validar la información recibida por la API.
- Delegar la lógica de negocio a la capa de servicios.
- Mantener el acceso a los datos separado mediante repositorios.
- Utilizar códigos de estado HTTP adecuados para representar el resultado de
  cada operación.
- Definir una estructura clara de URLs y utilizar métodos HTTP según la
  operación realizada.

Esta organización busca que el código sea fácil de mantener y que las
responsabilidades de cada componente estén claramente separadas.

## 5. Comunicación entre frontend y backend

El frontend se comunicará con el backend mediante una API HTTP construida con
FastAPI.

La comunicación seguirá un modelo cliente-servidor:

1. El usuario interactúa con el frontend.
2. El frontend realiza una petición HTTP al endpoint correspondiente.
3. El router de FastAPI recibe la petición.
4. El router delega la operación a la capa de servicios.
5. El servicio ejecuta la lógica de negocio y utiliza los repositorios cuando
   necesita acceder a los datos.
6. El backend devuelve una respuesta HTTP al frontend.

Las respuestas de la API utilizarán datos estructurados, por ejemplo en formato
JSON, para facilitar su consumo desde el frontend.

Al tratarse de sistemas separados, el frontend y el backend deberán tener una
configuración clara para comunicarse mediante la API. La URL del backend y
otros valores que puedan cambiar según el entorno se gestionarán mediante
variables de entorno, evitando incluir estos valores directamente en el código.

También será necesario configurar CORS en el backend para controlar qué
orígenes pueden realizar peticiones a la API desde el frontend.

El backend deberá gestionar además aspectos como la validación de datos y los
errores HTTP, proporcionando respuestas claras al frontend cuando una
operación no pueda realizarse correctamente.

## 6. Riesgos y puntos de atención

Durante el desarrollo del backend se deberán considerar los siguientes aspectos:

- **Seguridad:** proteger los datos de los clientes y controlar el acceso a las
  funcionalidades internas.
- **Validación de datos:** validar la información recibida desde el frontend
  antes de procesarla.
- **Manejo de errores:** proporcionar respuestas HTTP claras cuando una
  operación no pueda realizarse correctamente.
- **Escalabilidad:** diseñar los módulos de forma que puedan crecer sin
  introducir dependencias innecesarias entre ellos.
- **Integración entre frontend y backend:** mantener contratos claros sobre los
  datos que reciben y devuelven los endpoints.
- **Datos de diferentes países:** considerar que Brasaland opera en Colombia y
  Estados Unidos, por lo que algunos datos y funcionalidades pueden requerir
  configuraciones específicas por país.
- **Mantenimiento:** evitar colocar lógica de negocio directamente en los
  routers para mantener una estructura fácil de modificar y probar.

## 7. Organización por dominios de negocio

La estructura propuesta permitirá organizar las funcionalidades del backend
según los principales dominios de Brasaland.

Los dominios considerados inicialmente son:

- **Clientes:** registro y gestión de información de clientes.
- **Restaurantes:** gestión de ubicaciones y datos de los restaurantes.
- **Brasa Points:** gestión de las funcionalidades relacionadas con el programa
  de fidelización.
- **Inventario:** gestión de existencias y necesidades de abastecimiento.
- **Proveedores:** gestión de información y relaciones con proveedores.
- **Compras:** gestión de las operaciones relacionadas con adquisiciones.

Esta organización permite que cada área tenga responsabilidades claramente
definidas y facilita la incorporación de nuevas funcionalidades en el futuro.

## 8. Ejemplos de endpoints

La API utilizará rutas organizadas por recurso y métodos HTTP según la
operación que se quiera realizar.

Algunos ejemplos de endpoints serían:

| Método | Endpoint | Propósito |
|---|---|---|
| GET | `/api/restaurants` | Obtener los restaurantes |
| GET | `/api/restaurants/{id}` | Obtener un restaurante específico |
| POST | `/api/customers` | Registrar un cliente |
| GET | `/api/customers/{id}` | Obtener información de un cliente |
| POST | `/api/loyalty/members` | Registrar un miembro de Brasa Points |
| GET | `/api/inventory` | Consultar inventario |
| GET | `/api/suppliers` | Consultar proveedores |
| POST | `/api/purchases` | Registrar una compra |

Estos endpoints son ejemplos de la organización propuesta y podrán ajustarse
durante la implementación según los requisitos definitivos de cada
funcionalidad.

## 9. Conclusión

La arquitectura propuesta para Brasaland utiliza un monolito modular organizado
por capas, con FastAPI como framework para la construcción de la API.

La separación entre API, servicios, dominio y persistencia permite mantener
responsabilidades claras y facilita el mantenimiento del sistema.

La organización mediante routers y dominios de negocio también permite
incorporar progresivamente funcionalidades relacionadas con clientes,
restaurantes, fidelización, inventario, proveedores y compras.

Esta propuesta busca proporcionar una base técnica organizada que pueda
evolucionar junto con las necesidades digitales de Brasaland.