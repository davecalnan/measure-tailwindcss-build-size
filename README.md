# Easily Measure Tailwind CSS Build Sizes

## Usage

Add any number of tailwind config files to the `configs` directory and run:

```
npm install
npm run measure
```

## Output

```
Calculating...
Finished.
┌───────────────────────────────┬──────────┬──────────┬───────┬────────┬─────────┬──────────────┐
│ Config                        │ Original │ Minified │ Gzip  │ Brotli │ Classes │ Declarations │
├───────────────────────────────┼──────────┼──────────┼───────┼────────┼─────────┼──────────────┤
│ 1-screen.config.js            │ 185.6K   │ 137.2K   │ 24.4K │ 13.4K  │ 3312    │ 3371         │
├───────────────────────────────┼──────────┼──────────┼───────┼────────┼─────────┼──────────────┤
│ 2-screens.config.js           │ 281.2K   │ 207.4K   │ 35.7K │ 14.9K  │ 4965    │ 5026         │
├───────────────────────────────┼──────────┼──────────┼───────┼────────┼─────────┼──────────────┤
│ 25-colors.config.js           │ 288.0K   │ 204.5K   │ 37.4K │ 11.9K  │ 5211    │ 5276         │
├───────────────────────────────┼──────────┼──────────┼───────┼────────┼─────────┼──────────────┤
│ 3-screens.config.js           │ 376.9K   │ 277.5K   │ 47.1K │ 16.1K  │ 6618    │ 6681         │
├───────────────────────────────┼──────────┼──────────┼───────┼────────┼─────────┼──────────────┤
│ 35-colors-3-screens.config.js │ 252.3K   │ 180.5K   │ 32.6K │ 11.7K  │ 4530    │ 4593         │
├───────────────────────────────┼──────────┼──────────┼───────┼────────┼─────────┼──────────────┤
│ 50-colors.config.js           │ 356.3K   │ 257.5K   │ 45.1K │ 13.7K  │ 6336    │ 6401         │
├───────────────────────────────┼──────────┼──────────┼───────┼────────┼─────────┼──────────────┤
│ default.config.js             │ 472.5K   │ 347.7K   │ 58.4K │ 17.3K  │ 8271    │ 8336         │
└───────────────────────────────┴──────────┴──────────┴───────┴────────┴─────────┴──────────────┘
```

The difference between classes and declarations should always be 65, the styled added by normalize.css via `@tailwind base;`.