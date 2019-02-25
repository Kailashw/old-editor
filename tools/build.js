/*eslint-disable no-console */
import webpack from 'webpack';  
import webpackConfig from '../webpack.config.prod';  

process.env.NODE_ENV = 'production'; 

webpack(webpackConfig).run((err, stats) => {  
  if (err) { // so a fatal error occurred. Stop here.
    return 1;
  }
  return 0;
});