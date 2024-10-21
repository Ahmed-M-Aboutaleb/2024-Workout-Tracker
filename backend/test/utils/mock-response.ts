export const mockRequestFactory = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
});
