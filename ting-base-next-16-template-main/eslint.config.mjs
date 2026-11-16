import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
	{
		ignores: ["node_modules", ".next", "dist", "build", "out"],
	},

	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		plugins: {
			react: reactPlugin,
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			/* === base configs === */
			...js.configs.recommended.rules,
			...reactPlugin.configs.recommended.rules,
			...tsPlugin.configs.recommended.rules,
			...prettierConfig.rules,

			/* === SAFE non-formatting rules === */
			semi: ["error", "always"],
			"no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],

			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variable",
					format: ["camelCase", "PascalCase"],
				},
				{
					selector: "function",
					format: ["camelCase", "PascalCase"],
					leadingUnderscore: "allow",
				},
			],

			"react/prop-types": "off",
			"react/react-in-jsx-scope": "off",

			"react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],

			"no-restricted-syntax": [
				"error",
				{
					selector: "Identifier[name='NEXT_PUBLIC_AUTH_TOKEN']",
					message:
						"Do NOT use NEXT_PUBLIC_AUTH_TOKEN. Public env vars must never contain auth tokens.",
				},
			],
		},
	},
];
