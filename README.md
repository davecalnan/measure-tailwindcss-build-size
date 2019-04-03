# Easily Measure Tailwind CSS Build Sizes

## Usage

Add any number of tailwind config files to the `configs` directory and run:

```
npm install
npm run measure
```

## Output

```
Building...
Finished.
┌───────────────────┬──────────┬──────────┬─────────┐
│ Config            │ Original │ Minified │ Gzipped │
├───────────────────┼──────────┼──────────┼─────────┤
│ default.config.js │ 472.5K   │ 347.7K   │ 58.1K   │
├───────────────────┼──────────┼──────────┼─────────┤
│ extend.config.js  │ 474.9K   │ 349.4K   │ 58.5K   │
├───────────────────┼──────────┼──────────┼─────────┤
│ replace.config.js │ 224.0K   │ 155.0K   │ 21.9K   │
└───────────────────┴──────────┴──────────┴─────────┘
```