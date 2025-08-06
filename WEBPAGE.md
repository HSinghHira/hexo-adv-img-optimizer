## 🌟 Overview

The Hexo Advanced Image Optimizer Plugin enhances your Hexo site by leveraging the power of `wsrv.nl`, a high-performance image cache and resize service. Powered by Cloudflare’s CDN, it delivers images from over 300 global datacenters, ensuring lightning-fast load times and optimal performance. With support for advanced image processing using technologies like nginx and libvips, this plugin transforms and optimizes images on-the-fly. It’s open-source, free to use, and seamlessly integrates with Hexo to process markdown images, cover images, CSS background images, and `<object>` tags.

---

📦 Installation

Run the (any) following command in your Hexo project directory to install the plugin:

```bash
npm i hexo-adv-img-optimizer --save
```

```bash
bun i hexo-adv-img-optimizer --save
```

```bash
pnpm i hexo-adv-img-optimizer --save
```

---

🚀 Usage

After installing the plugin, all image urls will be converted to CDN urls automatically. For example, the origin markdown file is

```md
![Image Caption](https://wsrv.nl/lichtenstein.jpg)
```

Then it will be converted to

```md
![Image Caption](https://images.weserv.nl/?url=https://wsrv.nl/lichtenstein.jpg)
```

The local image urls will be also converted. For example, the original file is

```md
![Image Caption](/img/anti996.png)
```

It will be rendered as

```md
![Image Caption](https://images.weserv.nl/?url=https://example.com/img/anti996.png)
```

where `https://example.com` is the url of your blog that you set in `_config.yml`.

---

## 🔄 Configuration

The plugin can be configured globally in Hexo's `_config.yml` file under the `cdn` section or per post using front-matter in Markdown files. Front-matter settings override global settings for specific posts.

1. Open your Hexo project's `_config.yml` file.
2. Add a `cdn` section to configure global settings (see [Configuration](#configuration) below).
   Example:

```yaml
cdn:
  cdn_server: //wsrv.nl
  use_webp: true
  max_width: [1920, 1200, 800, 400]
```

### 🌍 Global Configuration (\_config.yml)

Add a `cdn` section to `_config.yml` to set default options for all images. All options are optional, and defaults are applied when not specified.

```yaml
cdn:
  cdn_server: //wsrv.nl
  native: false
  use_webp: true
  max_width: 1200
  filename: default-image
  brightness: 0
  quality: 75
  fit: cover
  .
  .
  .
```

### 📬 Per-Post Configuration (Front-Matter)

Add a `cdn` section to a post’s front-matter to override global settings for that post’s images (e.g., cover image, markdown images, background images). For example:

```yaml
---
title: My Post
cdn:
  brightness: 20
  filename: post-specific-image
  quality: 80
  fit: contain
  .
  .
  .
---
```

### 📀 Available Configuration Options

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

---

## 📝 Notes

- **Priority**: Front-matter options (`cdn: ...`) in a post override global settings in `_config.yml`. If neither is set, defaults like the page-title-based filename (`hello-example` for "Hello Example") or `null` are used.
- **Aliases**: Use either full names (e.g., `brightness`) or aliases (e.g., `bri`) in `_config.yml` or front-matter.
- **Validation**: Ensure values match the expected format (e.g., `crop` as `[10,20,100,100]`, `brightness` as a number between -100 and 100) to avoid errors.
- **SVG Exclusion**: SVG images are excluded from CDN processing to preserve their vector format.
- **CDN Support**: Verify that your CDN (e.g., `images.weserv.nl`) supports the specified options. Invalid values may be ignored.
- **Testing**: After configuration, run `hexo generate` and inspect the generated HTML to confirm CDN URLs include the desired parameters (e.g., `https://images.weserv.nl/?url=...&bri=20&filename=post-specific-image`).

---

## 🆘 Troubleshooting

- **Images Not Processed**: Ensure the plugin is installed correctly. Check for `exclude_domains` that might skip certain images.
- **Incorrect Filenames**: Verify the `filename` setting in `_config.yml` or front-matter. If using the page-title default, ensure posts have a `title` in their front-matter.
- **CDN Errors**: Confirm that the `cdn_server` supports the configured options (e.g., `images.weserv.nl` documentation: https://images.weserv.nl/).
- **WebP Not Working**: Set `use_webp: true` and ensure the browser supports WebP. Check if `output_format: webp` is set correctly for specific images.

For additional help or feature requests, please open an issue on the plugin’s repository or contact the maintainer.

---

## 🤝 Contributing

We welcome contributions! To get involved:

1. Visit the [GitHub Repository](https://github.com/HSinghHira/hexo-adv-img-optimizer).
2. Open an issue for bugs or feature requests.
3. Submit a pull request with your changes, following the repository’s guidelines.

---

## 😍 Special Thanks

- [Jinzhe Zeng](https://github.com/njzjz/hexo-image-cloudflare)
- [hexo-util](https://github.com/hexojs/hexo-util)
- [html-tag](https://github.com/jonschlinkert/html-tag)

---

## 📩 Contact me

Feel free to contact me related to anything:

👉 [Contact me](https://me.hsinghhira.me/contact/)

---
