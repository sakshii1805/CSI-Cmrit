Add-Type -AssemblyName System.Drawing

$sourcePath = "e:\CSI\public\images\college-logo.png"
$bytes = [System.IO.File]::ReadAllBytes($sourcePath)
$ms = New-Object System.IO.MemoryStream($bytes, 0, $bytes.Length)
$origBmp = [System.Drawing.Bitmap]::FromStream($ms)

$outSize = 512
$targetBmp = New-Object System.Drawing.Bitmap($outSize, $outSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($targetBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Draw white circle fill
$padding = 8
$diameter = $outSize - (2 * $padding)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillEllipse($brush, $padding, $padding, $diameter, $diameter)
$brush.Dispose()

# Create circular clip
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse($padding, $padding, $diameter, $diameter)
$g.SetClip($path)

# Fit image inside circle with comfortable padding so the text CMR and top petals aren't cut off
$innerPad = 48
$destW = $outSize - (2 * $innerPad)
$destH = [int]($destW * ($origBmp.Height / $origBmp.Width))
$destX = $innerPad
$destY = [int](($outSize - $destH) / 2)

$destRect = New-Object System.Drawing.Rectangle($destX, $destY, $destW, $destH)
$srcRect = New-Object System.Drawing.Rectangle(0, 0, $origBmp.Width, $origBmp.Height)
$g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$g.ResetClip()

# Subtle outer border ring
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 15, 52, 96), 2.0)
$pen.Alignment = [System.Drawing.Drawing2D.PenAlignment]::Inset
$g.DrawEllipse($pen, $padding, $padding, $diameter, $diameter)
$pen.Dispose()

$g.Dispose()
$origBmp.Dispose()
$ms.Dispose()

$tempPath = "e:\CSI\public\images\college-logo-circle.png"
$targetBmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$targetBmp.Dispose()

Move-Item -Force $tempPath $sourcePath
Write-Host "Circular college logo successfully saved to $sourcePath"
