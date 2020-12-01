module.exports = {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                presets: [ '@babel/preset-env' ],
                plugins: [ '@babel/plugin-proposal-class-properties' ],
              },
            },
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ]
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: 'raw-loader',
            }
          ]
        },
      ]
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js',
      library: 'FontFamilyTool',
      libraryTarget: 'umd'
    }
  };
  