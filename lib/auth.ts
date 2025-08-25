// Shared users storage to sync between login and register routes
export const users = new Map<string, {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}>()

// Initialize with test users
users.set('test@example.com', {
  id: '1',
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  createdAt: new Date().toISOString()
})

users.set('admin@alizstrategy.com', {
  id: '2',
  email: 'admin@alizstrategy.com',
  password: 'admin123',
  name: 'Administrateur',
  createdAt: new Date().toISOString()
})