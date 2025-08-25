import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File
    const thumbnail = formData.get('thumbnail') as File | null
    const section = formData.get('section') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
    const fileExtension = path.extname(file.name).toLowerCase()
    const validExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
    
    console.log('Upload video - Type:', file.type, 'Extension:', fileExtension, 'Size:', file.size)
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Type de fichier non supporté. Type reçu: ${file.type}, Extension: ${fileExtension}` },
        { status: 400 }
      )
    }

    // Limiter la taille du fichier (100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale: 100MB' },
        { status: 400 }
      )
    }

    // Créer le dossier de destination si nécessaire
    const uploadDir = path.join(process.cwd(), 'public', 'videos', 'sections')
    console.log('Upload directory:', uploadDir)
    console.log('Directory exists:', existsSync(uploadDir))
    
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
        console.log('Directory created successfully')
      }
    } catch (mkdirError) {
      console.error('Error creating directory:', mkdirError)
      return NextResponse.json(
        { error: 'Impossible de créer le dossier de destination' },
        { status: 500 }
      )
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const sanitizedSection = section.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const extension = path.extname(file.name)
    const filename = `${sanitizedSection}_${timestamp}${extension}`
    const filepath = path.join(uploadDir, filename)

    // Convertir le fichier en buffer et l'écrire
    console.log('Writing file to:', filepath)
    
    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)
      console.log('File written successfully, size:', buffer.length)
    } catch (writeError) {
      console.error('Error writing file:', writeError)
      return NextResponse.json(
        { error: 'Impossible d\'écrire le fichier sur le disque' },
        { status: 500 }
      )
    }

    // Vérifier que le fichier a bien été créé
    if (!existsSync(filepath)) {
      console.error('File was not created:', filepath)
      return NextResponse.json(
        { error: 'Le fichier n\'a pas pu être créé' },
        { status: 500 }
      )
    }

    // Traiter la miniature si elle existe
    let thumbnailPath = null
    if (thumbnail) {
      try {
        const thumbnailFilename = `${sanitizedSection}_${timestamp}_thumbnail.jpg`
        const thumbnailFilepath = path.join(uploadDir, thumbnailFilename)
        
        const thumbnailBytes = await thumbnail.arrayBuffer()
        const thumbnailBuffer = Buffer.from(thumbnailBytes)
        await writeFile(thumbnailFilepath, thumbnailBuffer)
        
        thumbnailPath = `/videos/sections/${thumbnailFilename}`
        console.log('Thumbnail saved:', thumbnailPath)
      } catch (thumbnailError) {
        console.error('Error saving thumbnail:', thumbnailError)
      }
    }

    // Retourner le chemin relatif pour l'accès public
    const publicPath = `/videos/sections/${filename}`
    console.log('Upload successful, public path:', publicPath)

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename,
      thumbnailPath: thumbnailPath,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Erreur lors de l\'upload de la vidéo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de la vidéo' },
      { status: 500 }
    )
  }
}