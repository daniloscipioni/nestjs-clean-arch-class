import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider'

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider
  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })
  it('Should return encrypted password', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    await expect(hash).toBeDefined()
  })

  it('Should return false on invalid password and hash comparision', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash('fake', hash)
    await expect(result).toBeFalsy()
  })
  it('Should return false on invalid password and hash comparision', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash(password, hash)
    await expect(result).toBeTruthy()
  })
})
