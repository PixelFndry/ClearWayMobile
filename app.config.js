export default ({ config }) => {
  return {
    ...config,
    extra: {
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
  };
};
