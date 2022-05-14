import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import {
  CreatePostDto,
  EditPostDto,
} from 'src/post/dto';
import { DraftStatus } from '@prisma/client';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3000',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      username: 'sebasptsch',
      password: '123',
    };

    describe('Signup', () => {
      it('should throw if username empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: '123',
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: 'sebasptsch',
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if username empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: '123',
          })
          .expectStatus(401);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            username: 'sebasptsch',
          })
          .expectStatus(401);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(401);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          name: 'Sebastian',
          username: 'sebasptsch1',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.username);
      });
    });
  });
  describe('Posts', () => {
    describe('Get empty posts', () => {
      it('should get posts without auth', () => {
        return pactum
          .spec()
          .get('/posts')
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create post', () => {
      const dto: CreatePostDto = {
        title: 'first post',
        summary: 'first summary',
        content: {
          node: {
            value: 'hello',
          },
        },
      };
      it('should create post', () => {
        return pactum
          .spec()
          .post('/posts')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('postId', 'id');
      });
      it('should create post without auth', () => {
        return pactum
          .spec()
          .post('/posts')
          .withBody(dto)
          .expectStatus(401);
      });
    });
    describe('Get posts', () => {
      it('should get without auth posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .expectStatus(200)
          .expectJsonLength(0);
      });
      it('should publish post', () => {
        const dto: EditPostDto = {
          status: DraftStatus.PUBLISHED,
        };
        return pactum
          .spec()
          .patch('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('PUBLISHED');
      });
      it('should get with auth posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get post by id', () => {
      it('should get post by id with auth', () => {
        return pactum
          .spec()
          .get('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{postId}');
      });

      it('should get post by id without auth', () => {
        return pactum
          .spec()
          .get('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .expectStatus(200)
          .expectBodyContains('$S{postId}');
      });
    });
    describe('Edit post by id', () => {
      it('should edit post by id without auth', () => {
        return pactum
          .spec()
          .patch('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .expectStatus(401);
      });
      it('should edit post by id with auth', () => {
        const dto: EditPostDto = {
          title: 'Renamed Post',
        };
        return pactum
          .spec()
          .patch('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('Renamed Post');
      });
      it('should edit post by id without auth', () => {
        const dto: EditPostDto = {
          title: 'Renamed Post',
        };
        return pactum
          .spec()
          .patch('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withBody(dto)
          .expectStatus(401);
      });
    });
    describe('Delete post', () => {
      it('should delete post with auth', () => {
        return pactum
          .spec()
          .delete('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          });
      });
      it('should delete post without auth', () => {
        return pactum
          .spec()
          .delete('/posts/{id}')
          .withPathParams('id', '$S{postId}');
      });
      it('should get without auth empty posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .expectStatus(200)
          .expectJsonLength(0);
      });
      it('should get with auth empty posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
