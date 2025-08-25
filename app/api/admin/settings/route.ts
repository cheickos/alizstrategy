import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface Settings {
  logoUrl: string
  faviconUrl: string
  siteName: string
  siteDescription: string
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

// Valeurs par défaut
const defaultSettings: Settings = {
  logoUrl: '',
  faviconUrl: '/favicon.ico',
  siteName: 'ALIZ STRATEGY',
  siteDescription: 'Votre Allié Stratégique pour une Croissance Durable'
}

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function loadSettings(): Promise<Settings> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    // Si le fichier n'existe pas, retourner les valeurs par défaut
    return defaultSettings
  }
}

async function saveSettings(settings: Settings): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

export async function GET() {
  const settings = await loadSettings()
  return NextResponse.json({ settings })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const currentSettings = await loadSettings()
    
    // Mettre à jour les paramètres
    const updatedSettings = {
      ...currentSettings,
      ...body
    }
    
    // Sauvegarder dans le fichier
    await saveSettings(updatedSettings)
    
    return NextResponse.json({ 
      success: true, 
      settings: updatedSettings 
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    )
  }
}