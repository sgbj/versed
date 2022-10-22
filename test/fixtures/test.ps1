



function convert{
    [cmdletbinding()]
    param(
        $Uri,
        $Path,
        $Format,
        $OutPath = "",
        [switch]$Ocr
    )
    Write-Host "processing $Path into $Format"
    if ( $OutPath -ne "" -And  !(Test-Path $OutPath -PathType Container)) 
    {
        New-Item -ItemType Directory -Path $OutPath
    }

    $form = @{
        format  = $Format;
        file    = Get-Item -Path $Path;
    }
    if ($Ocr) {
        $form.ocr = $true
    }

    $outfile = "tmpfile.$Format"
    try {
        $res = Invoke-WebRequest -Uri $Uri -Method Post -Form $form -Outfile $outfile -PassThru
        [string]$attachmentName = $res.Headers.'Content-Disposition' -replace '.*\bfilename=(.+)(?: |$)', '$1'
        
            # Write-Host $res.Headers
            # Write-Host $attachmentName.GetType() $attachmentName
        
        $to = Join-Path -Path $OutPath -ChildPath $attachmentName
        Write-Verbose "Move-Item $outfile $to"
        Move-Item $outfile $to -Force   
    }
    catch {
        $_.Exception.StatusCode
        $_.Exception.Message
    }
}


$uri = "http://localhost:3000/convert"


# something using soffice
convert $uri "file-sample_100kB.docx" pdf ".\out" -Verbose
# something using ffmpeg
convert $uri "sample_640x360.mkv" png ".\out" -Verbose
# something using imagemagick
convert $uri "sample_640×426.bmp" jpg ".\out" -Verbose
# something using tesseract
convert $uri "sample_text.png" txt ".\out" -Ocr -Verbose