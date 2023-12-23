import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-respository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JS Academia',
      description: null,
      latitude: -9.7188798,
      longitude: -35.815424,
      phone: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
