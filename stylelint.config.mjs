export default {
  extends: ["stylelint-config-recommended"],
  ignoreFiles: ["node_modules/**", "playwright-report/**", "test-results/**"],
  rules: {
    "no-descending-specificity": null,
    "property-no-deprecated": null,
  },
};
