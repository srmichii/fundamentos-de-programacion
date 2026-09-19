# ==============================================================================
# CYBERFREIGHT // Local Web Server (PowerShell Native HttpListener)
# ==============================================================================
$Port = 8080
$RootPath = $PSScriptRoot
if (-not $RootPath) { $RootPath = Get-Location }

$Listener = New-Object System.Net.HttpListener
$Prefix = "http://localhost:$Port/"
$Listener.Prefixes.Add($Prefix)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " [CYBERFREIGHT // NEURAL LOGISTICS SERVER]" -ForegroundColor Yellow
Write-Host " Servidor local activo en: $Prefix" -ForegroundColor Green
Write-Host " Directorio raíz: $RootPath" -ForegroundColor DarkGray
Write-Host " Presiona Ctrl+C para detener el servidor." -ForegroundColor DarkGray
Write-Host "========================================================" -ForegroundColor Cyan

try {
    $Listener.Start()
} catch {
    Write-Warning "El puerto $Port está ocupado. Intentando en el puerto 8888..."
    $Port = 8888
    $Prefix = "http://localhost:$Port/"
    $Listener = New-Object System.Net.HttpListener
    $Listener.Prefixes.Add($Prefix)
    $Listener.Start()
}

# Auto-open browser
Start-Process $Prefix

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
}

while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $UrlPath = $Request.Url.LocalPath
        if ($UrlPath -eq "/" -or [string]::IsNullOrWhiteSpace($UrlPath)) {
            $UrlPath = "/index.html"
        }

        # Normalize relative file path
        $RelativeFilePath = $UrlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
        $FilePath = [System.IO.Path]::Combine($RootPath, $RelativeFilePath)

        if ([System.IO.File]::Exists($FilePath)) {
            $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = $MimeTypes[$Extension]
            if (-not $ContentType) { $ContentType = "application/octet-stream" }

            $Response.ContentType = $ContentType
            $Response.StatusCode = 200
            $Response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentLength64 = $Bytes.Length
            if ($Request.HttpMethod -ne "HEAD") {
                $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
            }
        } else {
            $Response.StatusCode = 404
            $NotFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 - Recurso no encontrado: $UrlPath")
            $Response.ContentType = "text/plain; charset=utf-8"
            $Response.ContentLength64 = $NotFoundMsg.Length
            if ($Request.HttpMethod -ne "HEAD") {
                $Response.OutputStream.Write($NotFoundMsg, 0, $NotFoundMsg.Length)
            }
        }
    } catch {
        # Catch and continue on client abort
    } finally {
        if ($Response) {
            try { $Response.Close() } catch {}
        }
    }
}
