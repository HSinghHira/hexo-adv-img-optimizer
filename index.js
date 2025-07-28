const { full_url_for, unescapeHTML } = require("hexo-util");
const { stringify } = require("querystring");
const { parse } = require("url");
const htmlTag = require("html-tag");

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
  const postConfig = data.cdn || {};
  return {
    height: postConfig.height || config.height || null,
    dpr:
      postConfig.device_pixel_ratio ||
      postConfig.dpr ||
      config.device_pixel_ratio ||
      config.dpr ||
      null,
    fit: postConfig.fit || config.fit || null,
    align:
      postConfig.alignment ||
      postConfig.a ||
      config.alignment ||
      config.a ||
      null,
    fpx:
      postConfig.focal_point_x ||
      postConfig.fpx ||
      config.focal_point_x ||
      config.fpx ||
      null,
    fpy:
      postConfig.focal_point_y ||
      postConfig.fpy ||
      config.focal_point_y ||
      config.fpy ||
      null,
    crop: postConfig.crop || postConfig.c || config.crop || config.c || null,
    precrop: postConfig.precrop || config.precrop || null,
    trim: postConfig.trim || config.trim || null,
    mask: postConfig.mask || config.mask || null,
    mtrim:
      postConfig.mask_trim ||
      postConfig.mtrim ||
      config.mask_trim ||
      config.mtrim ||
      null,
    mbg:
      postConfig.mask_background ||
      postConfig.mbg ||
      config.mask_background ||
      config.mbg ||
      null,
    quality:
      postConfig.quality || postConfig.q || config.quality || config.q || null,
    compression:
      postConfig.compression ||
      postConfig.l ||
      config.compression ||
      config.l ||
      null,
    lossless:
      postConfig.lossless ||
      postConfig.ll ||
      config.lossless ||
      config.ll ||
      null,
    bg:
      postConfig.background ||
      postConfig.bg ||
      config.background ||
      config.bg ||
      null,
    rbg:
      postConfig.rotation_background ||
      postConfig.rbg ||
      config.rotation_background ||
      config.rbg ||
      null,
    blur: postConfig.blur || config.blur || null,
    sharp:
      postConfig.sharpen ||
      postConfig.sharp ||
      config.sharpen ||
      config.sharp ||
      null,
    sharpf:
      postConfig.sharpen_flat ||
      postConfig.sharpf ||
      config.sharpen_flat ||
      config.sharpf ||
      null,
    sharpj:
      postConfig.sharpen_jagged ||
      postConfig.sharpj ||
      config.sharpen_jagged ||
      config.sharpj ||
      null,
    con:
      postConfig.contrast ||
      postConfig.con ||
      config.contrast ||
      config.con ||
      null,
    bri:
      postConfig.brightness ||
      postConfig.bri ||
      config.brightness ||
      config.bri ||
      null,
    gam:
      postConfig.gamma || postConfig.gam || config.gamma || config.gam || null,
    sat:
      postConfig.saturation ||
      postConfig.sat ||
      config.saturation ||
      config.sat ||
      null,
    hue: postConfig.hue || config.hue || null,
    mod:
      postConfig.modulate ||
      postConfig.mod ||
      config.modulate ||
      config.mod ||
      null,
    tint: postConfig.tint || config.tint || null,
    filt:
      postConfig.filter ||
      postConfig.filt ||
      config.filter ||
      config.filt ||
      null,
    start:
      postConfig.filter_start ||
      postConfig.start ||
      config.filter_start ||
      config.start ||
      null,
    stop:
      postConfig.filter_stop ||
      postConfig.stop ||
      config.filter_stop ||
      config.stop ||
      null,
    ro:
      postConfig.rotation ||
      postConfig.ro ||
      config.rotation ||
      config.ro ||
      null,
    flip: postConfig.flip || config.flip || null,
    flop: postConfig.flop || config.flop || null,
    output:
      postConfig.output_format ||
      postConfig.output ||
      config.output_format ||
      config.output ||
      null,
    encoding: postConfig.encoding || config.encoding || null,
    we:
      postConfig.without_enlargement ||
      postConfig.we ||
      config.without_enlargement ||
      config.we ||
      null,
    af:
      postConfig.adaptive_filter ||
      postConfig.af ||
      config.adaptive_filter ||
      config.af ||
      null,
    il:
      postConfig.interlace ||
      postConfig.il ||
      config.interlace ||
      config.il ||
      null,
    maxage:
      postConfig.max_age ||
      postConfig.maxage ||
      config.max_age ||
      config.maxage ||
      null,
    page: postConfig.page || config.page || null,
    n: postConfig.n || config.n || null,
    filename:
      postConfig.filename ||
      config.filename ||
      (data.title ? slugify(data.title) : null),
    default:
      postConfig.default_image ||
      postConfig.default ||
      config.default_image ||
      config.default ||
      "https://dynamic-og-image-generator.vercel.app/api/generate?title=Image+is+enjoying+vacation...&author=Harman+Singh+Hira&websiteUrl=%2F%2Fme.hsinghhira.me&avatar=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F11346694&theme=github",
  };
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
  if (postOptions.height) params.h = postOptions.height;
  if (postOptions.dpr) params.dpr = postOptions.dpr;
  if (postOptions.fit) params.fit = postOptions.fit;
  if (postOptions.align) {
    params.a = postOptions.align;
    if (postOptions.align === "focal") {
      if (postOptions.fpx) params.fpx = postOptions.fpx;
      if (postOptions.fpy) params.fpy = postOptions.fpy;
    }
  }
  if (postOptions.crop) {
    params.c =
      Array.isArray(postOptions.crop) && postOptions.crop.length === 4
        ? postOptions.crop.join(",")
        : postOptions.crop;
  }
  if (postOptions.precrop) {
    params.precrop =
      Array.isArray(postOptions.precrop) && postOptions.precrop.length === 4
        ? postOptions.precrop.join(",")
        : postOptions.precrop;
  }
  if (postOptions.trim !== null) {
    params.trim = postOptions.trim === true ? "" : postOptions.trim;
  }
  if (postOptions.mask) params.mask = postOptions.mask;
  if (postOptions.mtrim) params.mtrim = postOptions.mtrim;
  if (postOptions.mbg) params.mbg = postOptions.mbg;
  if (postOptions.quality) params.q = postOptions.quality;
  if (postOptions.compression) params.l = postOptions.compression;
  if (postOptions.lossless) params.ll = postOptions.lossless;
  if (postOptions.bg) params.bg = postOptions.bg;
  if (postOptions.rbg) params.rbg = postOptions.rbg;
  if (postOptions.blur) params.blur = postOptions.blur;
  if (postOptions.sharp) params.sharp = postOptions.sharp;
  if (postOptions.sharpf) params.sharpf = postOptions.sharpf;
  if (postOptions.sharpj) params.sharpj = postOptions.sharpj;
  if (postOptions.con) params.con = postOptions.con;
  if (postOptions.bri) params.bri = postOptions.bri;
  if (postOptions.gam) params.gam = postOptions.gam;
  if (postOptions.sat) params.sat = postOptions.sat;
  if (postOptions.hue) params.hue = postOptions.hue;
  if (postOptions.mod) {
    params.mod = Array.isArray(postOptions.mod)
      ? postOptions.mod.join(",")
      : postOptions.mod;
  }
  if (postOptions.tint) params.tint = postOptions.tint;
  if (postOptions.filt) params.filt = postOptions.filt;
  if (postOptions.start) params.start = postOptions.start;
  if (postOptions.stop) params.stop = postOptions.stop;
  if (postOptions.ro) params.ro = postOptions.ro;
  if (postOptions.flip) params.flip = postOptions.flip;
  if (postOptions.flop) params.flop = postOptions.flop;
  if (postOptions.output) params.output = postOptions.output;
  if (postOptions.encoding) params.encoding = postOptions.encoding;
  if (postOptions.we) params.we = postOptions.we;
  if (postOptions.af) params.af = postOptions.af;
  if (postOptions.il) params.il = postOptions.il;
  if (postOptions.maxage) params.maxage = postOptions.maxage;
  if (postOptions.page) params.page = postOptions.page;
  if (postOptions.n) params.n = postOptions.n;
  if (postOptions.filename) params.filename = postOptions.filename;
  if (postOptions.default) params.default = postOptions.default;
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
    const params = { url: full_url_for(src), default: full_url_for(src) };
    if (width) {
      params.w = width;
      if (!custom.we && custom.we !== false) params.we = "";
    }
    if (height) params.h = height;
    if (format) params.output = format;
    return prefix + stringify({ ...params, ...createParams(custom) });
  }
  let opts = "";
  if (width) opts += `,fit=scale-down,w=${width}`;
  if (height) opts += `,h=${height}`;
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
  if (data.cover)
    data.cover = transformUrl(data.cover, null, null, null, postOptions);
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
  (html) => {
    return html.replace(
      /<img(.*?)(data\-)?src="(.*?)"(.*?)>/gi,
      (str, attr1, _, src, attr2) => {
        if (/webp-comp/gi.test(attr1)) return str;
        let url = src;
        if (!src.startsWith(prefix)) {
          const newUrl = transformUrl(src);
          if (newUrl === src) return str;
          str = str.replace(src, newUrl);
          url = newUrl;
        }
        if (enableWebp || widths.length > 1) {
          const original = extractUrl(url);
          let sources = "";
          if (enableWebp) {
            sources += generateSource(original, "webp");
            const ext = original.split(".").pop().toLowerCase();
            sources += ["jpg", "jpeg", "png", "gif"].includes(ext)
              ? generateSource(original, ext)
              : generateSource(original);
          } else {
            sources += generateSource(original);
          }
          return `<picture>${sources}<img${attr1} webp-comp data-zoom-src="${url}"${attr2}></picture>`;
        }
        return str;
      }
    );
  },
  -1
);
