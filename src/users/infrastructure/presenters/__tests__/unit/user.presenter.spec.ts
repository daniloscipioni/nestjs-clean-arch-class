import { instanceToPlain } from 'class-transformer'
import { UserPresenter } from '../../user.presenter'

describe('UserPresenter unit tests', () => {
  const createdAt = new Date()
  const props = {
    id: 'e8ab21ed-ef10-447a-92d6-4cdc399497e3',
    name: 'test name',
    email: 'a@a.com',
    password: 'fake',
    createdAt,
  }
  let sut: UserPresenter
  beforeEach(() => {
    sut = new UserPresenter(props)
  })

  describe('constructor', () => {
    it('should be defined', () => {
      const sut = new UserPresenter(props)
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
    })

    it('should presenter data', () => {
      const output = instanceToPlain(sut)
      expect(output).toStrictEqual({
        id: 'e8ab21ed-ef10-447a-92d6-4cdc399497e3',
        name: 'test name',
        email: 'a@a.com',
        createdAt: createdAt.toISOString(),
      })
    })
  })
})
