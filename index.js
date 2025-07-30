const { full_url_for, unescapeHTML } = require("hexo-util");
const { stringify } = require("querystring");
const { parse } = require("url");
const htmlTag = require("html-tag");

// Store post-specific CDN options
const postCdnOptions = new Map();

function slugify(str) {
  return str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
    : "default-image";
}

function getCdnOptions(data) {
  const config = hexo.config.cdn || {};
  const postConfig = data && data.cdn ? data.cdn : {};
  const options = {
    height: postConfig.height ?? config.height,
    dpr:
      postConfig.device_pixel_ratio ??
      postConfig.dpr ??
      config.device_pixel_ratio ??
      config.dpr,
    fit: postConfig.fit ?? config.fit,
    align: postConfig.alignment ?? postConfig.a ?? config.alignment ?? config.a,
    fpx:
      postConfig.focal_point_x ??
      postConfig.fpx ??
      config.focal_point_x ??
      config.fpx,
    fpy:
      postConfig.focal_point_y ??
      postConfig.fpy ??
      config.focal_point_y ??
      config.fpy,
    crop: postConfig.crop ?? postConfig.c ?? config.crop ?? config.c,
    precrop: postConfig.precrop ?? config.precrop,
    trim: postConfig.trim ?? config.trim,
    mask: postConfig.mask ?? config.mask,
    mtrim:
      postConfig.mask_trim ??
      postConfig.mtrim ??
      config.mask_trim ??
      config.mtrim,
    mbg:
      postConfig.mask_background ??
      postConfig.mbg ??
      config.mask_background ??
      config.mbg,
    quality: postConfig.quality ?? postConfig.q ?? config.quality ?? config.q,
    compression:
      postConfig.compression ?? postConfig.l ?? config.compression ?? config.l,
    lossless:
      postConfig.lossless ?? postConfig.ll ?? config.lossless ?? config.ll,
    bg:
      postConfig.background ?? postConfig.bg ?? config.background ?? config.bg,
    rbg:
      postConfig.rotation_background ??
      postConfig.rbg ??
      config.rotation_background ??
      config.rbg,
    blur: postConfig.blur ?? config.blur,
    sharp:
      postConfig.sharpen ?? postConfig.sharp ?? config.sharpen ?? config.sharp,
    sharpf:
      postConfig.sharpen_flat ??
      postConfig.sharpf ??
      config.sharpen_flat ??
      config.sharpf,
    sharpj:
      postConfig.sharpen_jagged ??
      postConfig.sharpj ??
      config.sharpen_jagged ??
      config.sharpj,
    con: postConfig.contrast ?? postConfig.con ?? config.contrast ?? config.con,
    bri:
      postConfig.brightness ??
      postConfig.bri ??
      config.brightness ??
      config.bri,
    gam: postConfig.gamma ?? postConfig.gam ?? config.gamma ?? config.gam,
    sat:
      postConfig.saturation ??
      postConfig.sat ??
      config.saturation ??
      config.sat,
    hue: postConfig.hue ?? config.hue,
    mod: postConfig.modulate ?? postConfig.mod ?? config.modulate ?? config.mod,
    tint: postConfig.tint ?? config.tint,
    filt: postConfig.filter ?? postConfig.filt ?? config.filter ?? config.filt,
    start:
      postConfig.filter_start ??
      postConfig.start ??
      config.filter_start ??
      config.start,
    stop:
      postConfig.filter_stop ??
      postConfig.stop ??
      config.filter_stop ??
      config.stop,
    ro: postConfig.rotation ?? postConfig.ro ?? config.rotation ?? config.ro,
    flip: postConfig.flip ?? config.flip,
    flop: postConfig.flop ?? config.flop,
    output:
      postConfig.output_format ??
      postConfig.output ??
      config.output_format ??
      config.output,
    encoding: postConfig.encoding ?? config.encoding,
    we:
      postConfig.without_enlargement ??
      postConfig.we ??
      config.without_enlargement ??
      config.we,
    af:
      postConfig.adaptive_filter ??
      postConfig.af ??
      config.adaptive_filter ??
      config.af,
    il: postConfig.interlace ?? postConfig.il ?? config.interlace ?? config.il,
    maxage:
      postConfig.max_age ??
      postConfig.maxage ??
      config.max_age ??
      config.maxage,
    page: postConfig.page ?? config.page,
    n: postConfig.n ?? config.n,
    filename:
      postConfig.filename ??
      config.filename ??
      (data && data.title ? slugify(data.title) : null),
    default:
      postConfig.default_image ??
      postConfig.default ??
      config.default_image ??
      config.default ??
      "https://dynamic-og-image-generator.vercel.app/api/generate?title=Image+is+enjoying+vacation...&author=Harman+Singh+Hira&websiteUrl=%2F%2Fme.hsinghhira.me&avatar=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F11346694&theme=github",
  };
  console.log("CDN Options (Global):", JSON.stringify(config, null, 2));
  console.log("CDN Options (Post):", JSON.stringify(postConfig, null, 2));
  console.log("CDN Options (Merged):", JSON.stringify(options, null, 2));
  return options;
}

const config = hexo.config.cdn || {};
const server = config.cdn_server || config.server || "https://images.weserv.nl";
const isNative = config.native || false;
const prefix = isNative ? "/cdn-cgi/image/" : `${server}/?`;
const enableWebp =
  (!isNative && (config.cdn_use_webp || config.use_webp)) || false;
const widths = config.max_width
  ? typeof config.max_width === "number"
    ? [config.max_width]
    : config.max_width.sort((a, b) => b - a)
  : [];
widths.push(null);
const exclude = config.exclude_domains;

function createParams(base = {}, postOptions = {}) {
  const params = { ...base };
  if (postOptions.height != null) params.h = postOptions.height;
  if (postOptions.dpr != null) params.dpr = postOptions.dpr;
  if (postOptions.fit != null) params.fit = postOptions.fit;
  if (postOptions.align != null) {
    params.a = postOptions.align;
    if (postOptions.align === "focal") {
      if (postOptions.fpx != null) params.fpx = postOptions.fpx;
      if (postOptions.fpy != null) params.fpy = postOptions.fpy;
    }
  }
  if (postOptions.crop != null) {
    params.c =
      Array.isArray(postOptions.crop) && postOptions.crop.length === 4
        ? postOptions.crop.join(",")
        : postOptions.crop;
  }
  if (postOptions.precrop != null) {
    params.precrop =
      Array.isArray(postOptions.precrop) && postOptions.precrop.length === 4
        ? postOptions.precrop.join(",")
        : postOptions.precrop;
  }
  if (postOptions.trim != null) {
    params.trim = postOptions.trim === true ? "" : postOptions.trim;
  }
  if (postOptions.mask != null) params.mask = postOptions.mask;
  if (postOptions.mtrim != null) params.mtrim = postOptions.mtrim;
  if (postOptions.mbg != null) params.mbg = postOptions.mbg;
  if (postOptions.quality != null) params.q = postOptions.quality;
  if (postOptions.compression != null) params.l = postOptions.compression;
  if (postOptions.lossless != null) params.ll = postOptions.lossless;
  if (postOptions.bg != null) params.bg = postOptions.bg;
  if (postOptions.rbg != null) params.rbg = postOptions.rbg;
  if (postOptions.blur != null) params.blur = postOptions.blur;
  if (postOptions.sharp != null) params.sharp = postOptions.sharp;
  if (postOptions.sharpf != null) params.sharpf = postOptions.sharpf;
  if (postOptions.sharpj != null) params.sharpj = postOptions.sharpj;
  if (postOptions.con != null) params.con = postOptions.con;
  if (postOptions.bri != null) params.bri = postOptions.bri;
  if (postOptions.gam != null) params.gam = postOptions.gam;
  if (postOptions.sat != null) params.sat = postOptions.sat;
  if (postOptions.hue != null) params.hue = postOptions.hue;
  if (postOptions.mod != null) {
    params.mod = Array.isArray(postOptions.mod)
      ? postOptions.mod.join(",")
      : postOptions.mod;
  }
  if (postOptions.tint != null) params.tint = postOptions.tint;
  if (postOptions.filt != null) params.filt = postOptions.filt;
  if (postOptions.start != null) params.start = postOptions.start;
  if (postOptions.stop != null) params.stop = postOptions.stop;
  if (postOptions.ro != null) params.ro = postOptions.ro;
  if (postOptions.flip != null) params.flip = postOptions.flip;
  if (postOptions.flop != null) params.flop = postOptions.flop;
  if (postOptions.output != null) params.output = postOptions.output;
  if (postOptions.encoding != null) params.encoding = postOptions.encoding;
  if (postOptions.we != null) params.we = postOptions.we;
  if (postOptions.af != null) params.af = postOptions.af;
  if (postOptions.il != null) params.il = postOptions.il;
  if (postOptions.maxage != null) params.maxage = postOptions.maxage;
  if (postOptions.page != null) params.page = postOptions.page;
  if (postOptions.n != null) params.n = postOptions.n;
  if (postOptions.filename != null) params.filename = postOptions.filename;
  if (postOptions.default != null) params.default = postOptions.default;
  console.log("URL Parameters:", JSON.stringify(params, null, 2));
  return params;
}

function transformUrl(
  src,
  format = null,
  width = null,
  height = null,
  custom = {}
) {
  src = unescapeHTML(src);
  if (exclude && exclude.some((domain) => src.startsWith(domain))) return src;
  if (src.endsWith(".svg")) return src;

  if (!isNative) {
    const params = { url: full_url_for.call(hexo, src) };
    if (custom.default != null)
      params.default = full_url_for.call(hexo, custom.default);
    if (width != null) {
      params.w = width;
      if (custom.we == null && !isNative) params.we = "";
    }
    if (height != null) params.h = height;
    if (format != null) params.output = format;
    const finalParams = { ...params, ...createParams({}, custom) };
    const url = prefix + stringify(finalParams);
    console.log("Generated URL:", url);
    return url;
  }
  let opts = "";
  if (width != null) opts += `,fit=scale-down,w=${width}`;
  if (height != null) opts += `,h=${height}`;
  return `/cdn-cgi/image/onerror=redirect,f=auto${opts}/${src}`;
}

function extractUrl(src) {
  return isNative
    ? src.replace("/cdn-cgi/image/onerror=redirect,f=auto/", "")
    : parse(src, true).query.url;
}

function generateSource(src, format = null, custom = {}) {
  const attrs = {
    srcset: widths
      .map((w) => {
        const url = transformUrl(src, format, w, null, custom);
        return w ? `${url} ${w}w` : url;
      })
      .join(", "),
  };
  if (format) attrs.type = `image/${format}`;
  return htmlTag("source", attrs);
}

if (!isNative) {
  hexo.extend.injector.register(
    "head_end",
    `<link rel="preconnect" href="${server}">`
  );
}

hexo.extend.filter.register("before_post_render", (data) => {
  const postOptions = getCdnOptions(data);
  // Store post-specific options with post path as key
  if (data.path) {
    postCdnOptions.set(data.path, postOptions);
  }
  if (data.cover) {
    data.cover = transformUrl(data.cover, null, null, null, postOptions);
  }
  data.content = data.content.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (str, alt, src) =>
      `![${alt}](${transformUrl(src, null, null, null, postOptions)})`
  );
  return data;
});

hexo.extend.filter.register("after_post_render", (data) => {
  const postOptions = getCdnOptions(data);
  data.content = data.content.replace(
    /background\-image:(\s*?)url\((.*?)\)/g,
    (str, space, src) => {
      const clean = src.replace(/['"]/g, "");
      return `background-image:${space}url(${transformUrl(
        clean,
        null,
        null,
        null,
        postOptions
      )})`;
    }
  );
  return data;
});

hexo.extend.filter.register(
  "after_post_render",
  (data) => {
    const postOptions = getCdnOptions(data);
    data.content = data.content.replace(
      /<object(.*?)data="(.*?)"(.*?)>/gi,
      (str, attr1, src, attr2) =>
        `<img${attr1}src="${transformUrl(
          src,
          null,
          null,
          null,
          postOptions
        )}"${attr2}>`
    );
    return data;
  },
  -2
);

hexo.extend.filter.register(
  "after_render:html",
  (html, data) => {
    return html.replace(
      /<img(.*?)(data\-)?src="(.*?)"(.*?)>/gi,
      (str, attr1, _, src, attr2) => {
        if (/webp-comp/gi.test(attr1)) return str;
        let url = src;
        // Try to find post-specific options based on post path
        let postOptions = getCdnOptions({});
        if (data && data.path) {
          postOptions = postCdnOptions.get(data.path) || postOptions;
        }
        if (!src.startsWith(prefix)) {
          const newUrl = transformUrl(src, null, null, null, postOptions);
          if (newUrl === src) return str;
          str = str.replace(src, newUrl);
          url = newUrl;
        }
        if (enableWebp || widths.length > 1) {
          const original = extractUrl(url);
          let sources = "";
          if (enableWebp) {
            sources += generateSource(original, "webp", postOptions);
            const ext = original.split(".").pop().toLowerCase();
            sources += ["jpg", "jpeg", "png", "gif"].includes(ext)
              ? generateSource(original, ext, postOptions)
              : generateSource(original, null, postOptions);
          } else {
            sources += generateSource(original, null, postOptions);
          }
          return `<picture>${sources}<img${attr1} webp-comp data-zoom-src="${url}"${attr2}></picture>`;
        }
        return str;
      }
    );
  },
  -1
);
