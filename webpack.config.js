const path = require('path')

module.exports = {
  entry: './src/index.ts', // Asegúrate de que este sea el punto de entrada correcto para tu proyecto
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2', // Esto es útil para entornos Lambda
  },
  target: 'node', // Especifica que el entorno de destino es Node.js
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader', // Asegúrate de que node-loader esté instalado y configurado correctamente
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node'],
  },
  externals: {
    'chrome-aws-lambda': 'chrome-aws-lambda', // Excluye chrome-aws-lambda del bundle
  },
  node: {
    __dirname: false,
    __filename: false,
  },
}
