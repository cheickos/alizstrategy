import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'logo', 'favicon', 'document', or 'image'
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type based on upload type
    let allowedTypes: string[]
    let folder: string
    
    // Déterminer si c'est une image (thumbnail) basé sur le type MIME
    const isImage = file.type.startsWith('image/')
    
    if (type === 'logo' || type === 'favicon' || isImage) {
      allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'image/gif',
        'image/webp'
      ]
      folder = 'images'
    } else if (file.type.startsWith('video/')) {
      allowedTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska'
      ]
      folder = 'videos'
    } else if (type === 'audio' || file.type.startsWith('audio/')) {
      allowedTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/ogg',
        'audio/webm',
        'audio/m4a',
        'audio/x-m4a',
        'audio/mp4'
      ]
      folder = 'podcasts'
    } else {
      allowedTypes = [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed'
      ]
      folder = 'documents'
    }

    if (!allowedTypes.includes(file.type)) {
      const errorMessage = isImage
        ? 'Type de fichier non autorisé. Formats acceptés: PNG, JPG, GIF, WebP, SVG'
        : file.type.startsWith('video/')
        ? 'Type de fichier non autorisé. Formats acceptés: MP4, WebM, OGG, MPEG, QuickTime, AVI, MKV'
        : file.type.startsWith('audio/') || type === 'audio'
        ? 'Type de fichier non autorisé. Formats acceptés: MP3, WAV, OGG, M4A'
        : 'Type de fichier non autorisé. Formats acceptés: PDF, Excel, Word, PowerPoint, ZIP'
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Create unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Ensure safe filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = `${uniqueSuffix}-${originalName}`
    
    // Ensure directory exists
    // En Next.js App Router, le chemin public est déjà à la racine du projet Next
    const publicPath = path.join(process.cwd(), 'public')
    const dirPath = path.join(publicPath, folder)
    
    console.log('Current working directory:', process.cwd())
    console.log('Target directory:', dirPath)
    
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
      console.log(`Created directory: ${dirPath}`)
    }
    
    // Save to appropriate directory
    const filepath = path.join(dirPath, filename)
    
    try {
      await writeFile(filepath, buffer)
      console.log(`File saved successfully: ${filepath}`)
    } catch (writeError) {
      console.error('Error writing file:', writeError)
      throw new Error(`Impossible d'écrire le fichier: ${writeError}`)
    }
    
    // Return the file URL
    const fileUrl = `/${folder}/${filename}`
    
    console.log(`Upload successful: ${fileUrl}`)
    
    return NextResponse.json({ 
      success: true,
      fileUrl,
      filename: originalName
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: `Erreur lors du téléchargement: ${errorMessage}` },
      { status: 500 }
    )
  }
}