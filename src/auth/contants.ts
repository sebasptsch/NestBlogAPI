export const userInclude = {
  include: {
    _count: {
      select: { posts: true, images: true },
    },
    accounts: {
      select: {
        provider: true,
        uid: true,
      },
    },
  },
};

export const providerInclude = {
  include: {
    user: {
      ...userInclude,
    },
  },
};
