### Available Configuration Options

Below is a list of all available configuration options, which can be set in `_config.yml` or post front-matter. Most options support both full names (e.g., `brightness`) and aliases (e.g., `bri`) for compatibility with the CDN’s query parameters.

| Option                | Alias          | Type                 | Description                                                                                     | Example                              |
| --------------------- | -------------- | -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------ |
| `cdn_server`          | `server`       | String               | CDN server URL (default: `https://images.weserv.nl`).                                           | `https://images.weserv.nl`           |
| `native`              |                | Boolean              | Use Cloudflare native resize instead of `images.weserv.nl` (default: `false`).                  | `true`                               |
| `use_webp`            | `cdn_use_webp` | Boolean              | Enable WebP format in ``elements (default:`false`).                                             | `true`                               |
| `max_width`           |                | Number or Array      | Maximum width(s) for responsive images (e.g., `[1200, 800, 400]`).                              | `1200` or `[1200, 800]`              |
| `exclude_domains`     |                | Array                | Domains to exclude from CDN processing.                                                         | `["example.com", "cdn.com"]`         |
| `height`              | `h`            | Number               | Image height in pixels.                                                                         | `600`                                |
| `device_pixel_ratio`  | `dpr`          | Number               | Device pixel ratio for high-DPI displays.                                                       | `2`                                  |
| `fit`                 |                | String               | Image fit mode (`inside`, `outside`, `cover`, `fill`, `contain`).                               | `cover`                              |
| `alignment`           | `a`            | String               | Image alignment (`center`, `top`, `right`, `bottom`, `left`, `focal`).                          | `center`                             |
| `focal_point_x`       | `fpx`          | Number (0.0-1.0)     | X-coordinate for focal point (used with `alignment: focal`).                                    | `0.5`                                |
| `focal_point_y`       | `fpy`          | Number (0.0-1.0)     | Y-coordinate for focal point (used with `alignment: focal`).                                    | `0.5`                                |
| `crop`                | `c`            | String or Array      | Crop coordinates `[x,y,w,h]` or string.                                                         | `[10,20,100,100]` or `10,20,100,100` |
| `precrop`             |                | String or Array      | Pre-resize crop coordinates `[x,y,w,h]` or string.                                              | `[10,20,100,100]`                    |
| `trim`                |                | Boolean or Number    | Trim boring pixels (`true` for default 10, or 1-254).                                           | `true` or `20`                       |
| `mask`                |                | String               | Mask shape (`circle`, `ellipse`, `triangle`, `pentagon`, `hexagon`, `square`, `star`, `heart`). | `circle`                             |
| `mask_trim`           | `mtrim`        | Boolean              | Remove whitespace from mask.                                                                    | `true`                               |
| `mask_background`     | `mbg`          | String               | Mask background color (hex without `#`).                                                        | `ffffff`                             |
| `quality`             | `q`            | Number (0-100)       | Image quality.                                                                                  | `80`                                 |
| `compression`         | `l`            | Number (0-9)         | Compression level.                                                                              | `6`                                  |
| `lossless`            | `ll`           | Boolean              | Use lossless WebP compression (requires WebP output).                                           | `true`                               |
| `background`          | `bg`           | String               | Background color (hex without `#`).                                                             | `000000`                             |
| `rotation_background` | `rbg`          | String               | Background color for rotation (hex without `#`).                                                | `ffffff`                             |
| `blur`                |                | Number (0.3-1000)    | Apply blur effect.                                                                              | `5`                                  |
| `sharpen`             | `sharp`        | Number (0-10)        | Sharpen effect.                                                                                 | `3`                                  |
| `sharpen_flat`        | `sharpf`       | Number (0-1000000)   | Sharpen flat areas.                                                                             | `100`                                |
| `sharpen_jagged`      | `sharpj`       | Number (0-1000000)   | Sharpen jagged areas.                                                                           | `100`                                |
| `contrast`            | `con`          | Number (-100 to 100) | Adjust contrast.                                                                                | `10`                                 |
| `brightness`          | `bri`          | Number (-100 to 100) | Adjust brightness.                                                                              | `20`                                 |
| `gamma`               | `gam`          | Number (1.0-3.0)     | Adjust gamma.                                                                                   | `1.5`                                |
| `saturation`          | `sat`          | Number               | Saturation multiplier.                                                                          | `1.2`                                |
| `hue`                 |                | Number               | Hue rotation in degrees.                                                                        | `90`                                 |
| `modulate`            | `mod`          | String or Array      | Brightness, saturation, hue adjustments `[b,s,h]` or string.                                    | `[1.1,1.2,90]` or `1.1,1.2,90`       |
| `tint`                |                | String               | Tint color (hex without `#`).                                                                   | `ff0000`                             |
| `filter`              | `filt`         | String               | Apply filter (`greyscale`, `sepia`, `duotone`, `negate`).                                       | `greyscale`                          |
| `filter_start`        | `start`        | String               | Duotone start color (hex without `#`).                                                          | `000000`                             |
| `filter_stop`         | `stop`         | String               | Duotone stop color (hex without `#`).                                                           | `ffffff`                             |
| `rotation`            | `ro`           | String or Number     | Rotation angle (0-360 or `auto`).                                                               | `90`                                 |
| `flip`                |                | Boolean              | Mirror vertically (up-down).                                                                    | `true`                               |
| `flop`                |                | Boolean              | Mirror horizontally (left-right).                                                               | `true`                               |
| `output_format`       | `output`       | String               | Output format (`jpg`, `png`, `gif`, `webp`).                                                    | `webp`                               |
| `encoding`            |                | String               | Encoding type (e.g., `base64` for data URL).                                                    | `base64`                             |
| `without_enlargement` | `we`           | Boolean              | Prevent image enlargement.                                                                      | `true`                               |
| `adaptive_filter`     | `af`           | Boolean              | Use adaptive filter.                                                                            | `true`                               |
| `interlace`           | `il`           | Boolean              | Enable progressive/interlaced rendering.                                                        | `true`                               |
| `max_age`             | `maxage`       | String               | Cache control duration (e.g., `1d`, `1y`).                                                      | `1d`                                 |
| `page`                |                | Number               | Page number for multi-page images (e.g., PDFs).                                                 | `1`                                  |
| `n`                   |                | Number               | Number of pages to process (-1 for all).                                                        | `-1`                                 |
| `filename`            |                | String               | Custom filename for downloads (default: page title, e.g., `hello-example`).                     | `custom-image`                       |
| `default_image`       | `default`      | String               | Fallback image URL if the original fails.                                                       | `https://example.com/fallback.jpg`   |
