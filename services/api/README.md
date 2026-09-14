# Brasaland API

API FastAPI centralizada de Brasaland. Esta es la entrada unica para los servicios backend de la compania y esta preparada para incorporar routers por dominio sin dividir el sistema en microservicios innecesarios.

## Objetivo

Proporcionar una base backend minima y ejecutable para Brasaland. La primera capacidad disponible es una ruta de salud para comprobar que la API esta funcionando.

## Tecnologia

- Python 3.
- FastAPI.
- Uvicorn.

## Estructura

```text
services/api/
├── main.py                 # Aplicacion FastAPI y registro de routers
├── routers/
│   └── health.py           # Ruta GET /health
├── requirements.txt
└── README.md
```

Los futuros modulos de dominio deben incorporarse como routers dentro de `routers/` y registrarse desde `main.py`.

## Ejecucion

Desde la raiz del repositorio:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r services/api/requirements.txt
uvicorn services.api.main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000`. La comprobacion de salud es:

```bash
curl http://127.0.0.1:8000/health
```

Respuesta esperada:

```json
{"status":"ok","service":"brasaland-api"}
```
