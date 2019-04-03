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
┌───────────────────┬──────────┬──────────┬─────────┬─────────┬──────────────┐
│ Config            │ Original │ Minified │ Gzipped │ Classes │ Declarations │
├───────────────────┼──────────┼──────────┼─────────┼─────────┼──────────────┤
│ default.config.js │ 472.5K   │ 347.7K   │ 58.1K   │ 8271    │ 8336         │
├───────────────────┼──────────┼──────────┼─────────┼─────────┼──────────────┤
│ extend.config.js  │ 474.9K   │ 349.4K   │ 58.5K   │ 8316    │ 8381         │
├───────────────────┼──────────┼──────────┼─────────┼─────────┼──────────────┤
│ replace.config.js │ 224.0K   │ 155.0K   │ 21.9K   │ 4131    │ 4196         │
└───────────────────┴──────────┴──────────┴─────────┴─────────┴──────────────┘
```

The difference between classes and declarations should always be 65, the styled added by normalize.css via `@tailwind base;`.