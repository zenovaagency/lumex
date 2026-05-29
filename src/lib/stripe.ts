export const stripe = {
  checkout: {
    sessions: {
      create: async () => ({
        url: "https://checkout.stripe.com/mock-session",
        id: "cs_mock_12345",
      }),
    },
  },
  webhooks: {
    constructEvent: () => ({
      type: "checkout.session.completed",
      data: { object: {} },
    }),
  },
};
