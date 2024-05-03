let groupLocation = {};

module.exports = {
  getGroupLocation: () => groupLocation,
  setGroupLocation: (newGroupLocation) => {
    groupLocation = newGroupLocation;
  },
};
