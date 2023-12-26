import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-respository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      latitude: -9.7188798,
      longitude: -35.815424,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      latitude: -9.5840468,
      longitude: -35.7767946,
      phone: null,
    })
    const { gyms } = await sut.execute({
      userLatitude: -9.7188798,
      userLongitude: -35.815424,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
