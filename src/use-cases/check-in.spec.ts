import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-respository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 01',
      latitude: -9.7188798,
      longitude: -35.815424,
      description: null,
      phone: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.7188798,
      userLongitude: -35.815424,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // tdd = red test, green test, refactor
  it('shouldn`t be able to check in twice in same day', async () => {
    vi.setSystemTime(new Date(2023, 11, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.7188798,
      userLongitude: -35.815424,
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -9.7188798,
        userLongitude: -35.815424,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different dates', async () => {
    vi.setSystemTime(new Date(2023, 11, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.7188798,
      userLongitude: -35.815424,
    })

    vi.setSystemTime(new Date(2023, 11, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.7188798,
      userLongitude: -35.815424,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('shouln`t be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia 02',
      latitude: new Decimal(-9.6508326),
      longitude: new Decimal(-35.710445),
      description: '',
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -9.7188798,
        userLongitude: -35.815424,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
