$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

try {
    docker info | Out-Null
} catch {
    Write-Error "Docker daemon no esta disponible. Abre Docker Desktop y vuelve a ejecutar."
    exit 1
}

Write-Host "Limpiando entorno previo..."
docker-compose down

Write-Host "Construyendo y levantando el Frontend en Docker..."
docker-compose up --build -d

Write-Host "Estado de los contenedores:"
docker ps --filter "name=frontend-app"

Write-Host "==========================================================="
Write-Host " Frontend SmartLogix desplegado correctamente."
Write-Host " Aplicacion web disponible en: http://localhost"
Write-Host " Para ver logs ejecuta: docker logs -f frontend-app"
Write-Host "==========================================================="