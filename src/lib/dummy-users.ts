export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  joinedAt: string
  status: 'active' | 'blocked'
}

export const dummyUsers: User[] = [
  {
    id: 'user-1',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '081234567890',
    joinedAt: '2024-01-15T10:30:00Z',
    status: 'active',
  },
  {
    id: 'user-2',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    phone: '081234567891',
    joinedAt: '2024-02-20T14:20:00Z',
    status: 'active',
  },
  {
    id: 'user-3',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@email.com',
    phone: '081234567892',
    joinedAt: '2024-03-10T09:15:00Z',
    status: 'active',
  },
  {
    id: 'user-4',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    phone: '081234567893',
    joinedAt: '2024-03-25T16:45:00Z',
    status: 'active',
  },
  {
    id: 'user-5',
    name: 'Rudi Hartono',
    email: 'rudi.hartono@email.com',
    phone: '081234567894',
    joinedAt: '2024-04-05T11:00:00Z',
    status: 'active',
  },
]
