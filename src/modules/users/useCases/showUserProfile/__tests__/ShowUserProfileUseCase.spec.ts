import { hash } from "bcryptjs";
import { User } from "../../../entities/User";
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "../ShowUserProfileError";
import { ShowUserProfileUseCase } from "../ShowUserProfileUseCase";

describe('Show user profile', () => {
  let usersRepository: InMemoryUsersRepository;
  let showUserProfile: ShowUserProfileUseCase;
  let user: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfile = new ShowUserProfileUseCase(usersRepository);

    user = await usersRepository.create({
      name: 'name',
      email: 'name@example.com',
      password: await hash('password', 8)});
  });

  it('should show a user profile', async () => {
    const id = user.id!;

    const userProfile = await showUserProfile.execute(id)

    expect(userProfile).toHaveProperty('id');
  });

  it('should not show a inexistent user\'s profile', async () => {
    const id = 'wrong-id';

    expect(async () => {
      await showUserProfile.execute(id)
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
});
