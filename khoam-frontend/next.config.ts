import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    rules: {
      '*.svg': [
        {
          condition: { query: /[?&]url(?=&|$)/ },
          type: 'asset'
        },
        {
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: { overrides: { removeViewBox: false } }
                    },
                    'prefixIds'
                  ]
                }
              }
            }
          ],
          as: '*.js'
        }
      ]
    }
  }
};

export default nextConfig;
