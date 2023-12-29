import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Javascript Gym',
        description: 'The best gym to learn Javascript',
        latitude: -9.7188798,
        longitude: -35.815424,
        phone: '82999999999',
      })

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Typescript Gym',
        description: 'The best gym to learn Typescript',
        latitude: -9.7188798,
        longitude: -35.815424,
        phone: '82999999999',
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Javascript',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ])
  })
})
