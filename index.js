const PostgisOperatorsPlugin = require("./src/PgConnectionArgFilterPostgisOperatorsPlugin.js");

module.exports = function PostGraphileConnectionFilterPostgisPlugin(
  builder,
  options
) {
  builder.hook("build", build => {
    const pkg = require("./package.json");

    // Check dependencies
    if (!build.versions) {
      throw new Error(
        `Plugin ${pkg.name}@${pkg.version} requires graphile-build@^4.1.0 in order to check dependencies (current version: ${build.graphileBuildVersion})`
      );
    }
    const depends = (name, range) => {
      if (!build.hasVersion(name, range)) {
        throw new Error(
          `Plugin ${pkg.name}@${pkg.version} requires ${name}@${range} (${
            build.versions[name]
              ? `current version: ${build.versions[name]}`
              : "not found"
          })`
        );
      }
    };
    depends("graphile-build-pg", "^4.4.0");
    depends("postgraphile-plugin-connection-filter", ">=1 <3");
    //depends("@graphile/postgis", "0.1.0");

    // Register this plugin
    build.versions = build.extend(build.versions, { [pkg.name]: pkg.version });

    return build;
  });

  PostgisOperatorsPlugin(builder, options);
};
