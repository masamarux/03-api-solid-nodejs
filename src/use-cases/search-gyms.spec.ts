import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-respository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javacript Academy',
      description: null,
      latitude: -9.7188798,
      longitude: -35.815424,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Javacript Academy 2',
      description: null,
      latitude: -9.7188798,
      longitude: -35.815424,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Typescript Academy',
      description: null,
      latitude: -9.7188798,
      longitude: -35.815424,
      phone: null,
    })
    const { gyms } = await sut.execute({
      query: 'Javacript',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Javacript Academy',
      }),
      expect.objectContaining({
        title: 'Javacript Academy 2',
      }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javacript Academy ${i}`,
        description: null,
        latitude: -9.7188798,
        longitude: -35.815424,
        phone: null,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javacript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Javacript Academy 21',
      }),
      expect.objectContaining({
        title: 'Javacript Academy 22',
      }),
    ])
  })
})
