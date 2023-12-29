import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the history of check ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -9.7188798,
        longitude: -35.815424,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          gym_id: gym.id,
        },
        {
          user_id: user.id,
          gym_id: gym.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.checkIns).toHaveLength(2)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        user_id: user.id,
        gym_id: gym.id,
      }),
      expect.objectContaining({
        user_id: user.id,
        gym_id: gym.id,
      }),
    ])
  })
})
