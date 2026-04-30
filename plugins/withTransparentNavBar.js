const { withAppBuildGradle } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

//? This plugin modifies the Android styles.xml to set enforceNavigationBarContrast to false, allowing for a transparent navigation bar on Android 10 and above.

module.exports = function withTransparentNavBar(config) {
  return withAppBuildGradle(config, (config) => {
    const stringsPath = path.join(
      config.modRequest.projectRoot,
      "android/app/src/main/res/values/styles.xml",
    );

    if (fs.existsSync(stringsPath)) {
      let content = fs.readFileSync(stringsPath, "utf-8");

      content = content.replace(
        /<item name="android:enforceNavigationBarContrast"[^>]*>true<\/item>/g,
        '<item name="android:enforceNavigationBarContrast" tools:targetApi="29">false</item>',
      );

      fs.writeFileSync(stringsPath, content, "utf-8");
    }

    return config;
  });
};
