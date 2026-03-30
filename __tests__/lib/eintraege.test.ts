// __tests__/lib/eintraege.test.ts
import { listEintraege, getEintrag, createEintrag, updateEintrag, deleteEintrag } from '@/lib/eintraege'

// Mock the Supabase client
const mockFrom = jest.fn()
jest.mock('@/lib/supabase', () => ({
  createSupabaseClient: () => ({ from: mockFrom }),
}))

const mockEintrag = {
  id: 'abc-123',
  abschnitt: 'Kapitel 1',
  eigener_text: 'Mein Text',
  prompt: 'Korrigiere diesen Text',
  ki_ausgabe: 'Korrigierter Text',
  erstellt_am: '2026-03-30T10:00:00Z',
}

describe('listEintraege', () => {
  it('returns data from supabase ordered by erstellt_am desc', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: [mockEintrag], error: null })
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    const result = await listEintraege()

    expect(mockFrom).toHaveBeenCalledWith('eintraege')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockOrder).toHaveBeenCalledWith('erstellt_am', { ascending: false })
    expect(result).toEqual([mockEintrag])
  })

  it('throws when supabase returns an error', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    await expect(listEintraege()).rejects.toThrow('DB error')
  })
})

describe('getEintrag', () => {
  it('returns single entry by id', async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: mockEintrag, error: null })
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle })
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ select: mockSelect })

    const result = await getEintrag('abc-123')

    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123')
    expect(result).toEqual(mockEintrag)
  })
})

describe('createEintrag', () => {
  it('inserts a new entry and returns it', async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: mockEintrag, error: null })
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect })
    mockFrom.mockReturnValue({ insert: mockInsert })

    const input = {
      abschnitt: 'Kapitel 1',
      eigener_text: 'Mein Text',
      prompt: 'Korrigiere diesen Text',
      ki_ausgabe: 'Korrigierter Text',
    }
    const result = await createEintrag(input)

    expect(mockInsert).toHaveBeenCalledWith([input])
    expect(result).toEqual(mockEintrag)
  })
})

describe('updateEintrag', () => {
  it('updates entry by id', async () => {
    const mockSingle = jest.fn().mockResolvedValue({ data: mockEintrag, error: null })
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
    const mockEq = jest.fn().mockReturnValue({ select: mockSelect })
    const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ update: mockUpdate })

    const result = await updateEintrag('abc-123', { abschnitt: 'Kapitel 2' })

    expect(mockUpdate).toHaveBeenCalledWith({ abschnitt: 'Kapitel 2' })
    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123')
    expect(result).toEqual(mockEintrag)
  })
})

describe('deleteEintrag', () => {
  it('deletes entry by id', async () => {
    const mockEq = jest.fn().mockResolvedValue({ error: null })
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ delete: mockDelete })

    await deleteEintrag('abc-123')

    expect(mockDelete).toHaveBeenCalled()
    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123')
  })

  it('throws when supabase returns an error', async () => {
    const mockEq = jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } })
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ delete: mockDelete })

    await expect(deleteEintrag('abc-123')).rejects.toThrow('Delete failed')
  })
})
