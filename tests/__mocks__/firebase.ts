export default {
    firestore: () => ({
      collection: () => ({
        doc: () => ({
          set: jest.fn().mockResolvedValue(undefined),
        }),
      }),
    }),
  };