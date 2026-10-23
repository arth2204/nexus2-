param([string]$Root, [int]$Port = 8080)
$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css'; '.js'='application/javascript'; '.json'='application/json';
  '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp'; '.svg'='image/svg+xml';
  '.mp4'='video/mp4'; '.woff2'='font/woff2'; '.woff'='font/woff'; '.ttf'='font/ttf'; '.ico'='image/x-icon' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Serving $Root on http://localhost:$Port/"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  try {
    $p = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    # POST /upload/<nome>.png  (corpo = data URL base64) -> salva em images/banners/
    if ($ctx.Request.HttpMethod -eq 'POST' -and $p -match '^upload/([a-z0-9-]+\.png)$') {
      $name = $Matches[1]
      $body = (New-Object IO.StreamReader($ctx.Request.InputStream)).ReadToEnd()
      $b64 = $body.Substring($body.IndexOf(',') + 1)
      $dir = Join-Path $Root 'images\banners'
      New-Item -ItemType Directory -Force $dir | Out-Null
      [IO.File]::WriteAllBytes((Join-Path $dir $name), [Convert]::FromBase64String($b64))
      $ok = [Text.Encoding]::UTF8.GetBytes("saved $name")
      $ctx.Response.OutputStream.Write($ok, 0, $ok.Length)
      $ctx.Response.Close(); continue
    }
    if ($p -eq '' -or $p.EndsWith('/')) { $p += 'index.html' }
    $f = [IO.Path]::GetFullPath((Join-Path $Root $p))
    if ($f.StartsWith([IO.Path]::GetFullPath($Root)) -and (Test-Path $f -PathType Leaf)) {
      $b = [IO.File]::ReadAllBytes($f)
      $ext = [IO.Path]::GetExtension($f).ToLower()
      $ctx.Response.ContentType = $(if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' })
      $ctx.Response.Headers.Add('Cache-Control', 'no-store')
      $ctx.Response.OutputStream.Write($b, 0, $b.Length)
    } else { $ctx.Response.StatusCode = 404 }
  } catch { $ctx.Response.StatusCode = 500 }
  $ctx.Response.Close()
}
