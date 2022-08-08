import { Injectable } from '@nestjs/common';
import { DraftStatus } from '@prisma/client';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from 'node_modules/@casl/ability/index';
import { Action } from 'src/action';
import { UserDto } from 'src/auth/dto/User.dto';
import { PostDto } from 'src/post/dto/Post.dto';

type Subjects =
  | InferSubjects<typeof PostDto | typeof UserDto>
  | 'all';

export type AppAbility = Ability<
  [Action, Subjects]
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDto) {
    const { can, cannot, build } =
      new AbilityBuilder<
        Ability<[Action, Subjects]>
      >(Ability as AbilityClass<AppAbility>);

    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, PostDto, {
      userId: user.id, // update access if owner
    });
    cannot(Action.Read, PostDto);
    can(Action.Read, PostDto, {
      status: DraftStatus.PUBLISHED,
    });
    can(Action.Read, PostDto, {
      userId: user.id,
      status: DraftStatus.DRAFT,
    });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
