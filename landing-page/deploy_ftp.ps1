$ftpHost = "ftp.competidora.com.br"
$ftpUser = "ellen@competidora.com.br"
$ftpPass = "Eao@031626"
$remotePath = "/www/"

$localDir = "out"

if (-Not (Test-Path $localDir)) {
    Write-Error "Diretorio '$localDir' nao encontrado. Execute 'npm run build' primeiro."
    exit
}

Write-Host "Iniciando deploy estatico para $ftpHost$remotePath..." -ForegroundColor Cyan

function Upload-File {
    param ([string]$localPath, [string]$remotePath)
    $uriFixed = "ftp://" + $ftpHost + ($remotePath -replace "//", "/")
    $request = [System.Net.FtpWebRequest]::Create($uriFixed)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $request.UseBinary = $true
    $request.UsePassive = $true
    $request.KeepAlive = $false

    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($localPath)
        $request.ContentLength = $fileBytes.Length
        $requestStream = $request.GetRequestStream()
        $requestStream.Write($fileBytes, 0, $fileBytes.Length)
        $requestStream.Close()
        $requestStream.Dispose()
        Write-Host "Enviado: ${remotePath}" -ForegroundColor Green
    }
    catch {
        Write-Host "Erro ao enviar ${localPath} -> ${remotePath}: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Create-FtpDirectory {
    param ([string]$remoteDirPath)
    $uriFixed = "ftp://" + $ftpHost + ($remoteDirPath -replace "//", "/")
    $request = [System.Net.FtpWebRequest]::Create($uriFixed)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    try {
        $response = $request.GetResponse()
        $response.Close()
    } catch { }
}

function Process-Directory {
    param ([string]$currentLocalDir, [string]$currentRemoteDir)
    if (-not $currentRemoteDir.EndsWith("/")) { $currentRemoteDir += "/" }
    if ($currentRemoteDir -ne "/") {
        Create-FtpDirectory -remoteDirPath $currentRemoteDir
    }

    $items = Get-ChildItem -Path $currentLocalDir
    foreach ($item in $items) {
        $localItemPath = $item.FullName
        $remoteItemPath = $currentRemoteDir + $item.Name

        if ($item.PSIsContainer) {
            Process-Directory -currentLocalDir $localItemPath -currentRemoteDir $remoteItemPath
        } else {
            Upload-File -localPath $localItemPath -remotePath $remoteItemPath
        }
    }
}

$fullLocalDir = (Resolve-Path $localDir).Path
Process-Directory -currentLocalDir $fullLocalDir -currentRemoteDir $remotePath

Write-Host "Deploy finalizado!" -ForegroundColor Cyan
