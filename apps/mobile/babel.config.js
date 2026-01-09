module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            // Only compile files in the mobile app, not workspace packages
            sources: (filename) => {
              // Exclude node_modules and packages directory
              if (filename.includes('node_modules') || filename.includes('packages')) {
                return false;
              }
              // Only compile files in apps/mobile
              return filename.includes('apps/mobile') || filename.includes('apps\\mobile');
            },
          },
        },
      ],
    ],
  };
};
