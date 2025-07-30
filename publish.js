const fs = require("fs");
const { execSync } = require("child_process");

const originalPackageJson = fs.readFileSync("package.json", "utf-8");
const originalPkg = JSON.parse(originalPackageJson);
const version = originalPkg.version;

function publishVariant(name, registry) {
  const pkg = {
    ...originalPkg,
    name,
    version,
    publishConfig: {
      registry,
      access: "public",
    },
  };

  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  console.log(`\n📦 Publishing ${name}@${version} to ${registry}`);

  try {
    execSync(`npm publish --registry=${registry}`, { stdio: "inherit" });
    console.log(`✅ Published ${name}@${version} to ${registry}`);
  } catch (err) {
    console.error(`❌ Failed to publish ${name}:`, err.message);
  }
}

// Step 1: Publish unscoped to npmjs
publishVariant("hexo-adv-img-optimizer", "https://registry.npmjs.org/");

// Step 2: Publish scoped to GitHub Packages
publishVariant(
  "@hsinghhira/hexo-adv-img-optimizer",
  "https://npm.pkg.github.com/"
);

// Step 3: Restore original package.json
fs.writeFileSync("package.json", originalPackageJson);
console.log("\n🔄 package.json restored to original state.");
