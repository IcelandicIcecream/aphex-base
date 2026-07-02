const load = async ({ locals }) => {
  const { databaseAdapter } = locals.aphexCMS;
  const instanceSettings = await databaseAdapter.getInstanceSettings();
  return {
    instanceSettings
  };
};
export {
  load
};
