import { babel } from "@rollup/plugin-babel"
import pkg from "./package.json"

const src = "src/follow-on-hover.js"
const baseOutput = {
	name: "followOnHover",
	file: pkg.browser,
	format: "umd"
}
const plugins = [babel({ babelHelpers: 'bundled' })]

export default [
	{
		input: src,
		output: baseOutput,
		plugins
	},
	// For docs
	{
		input: src,
		output: {
			...baseOutput,
			file: `docs/${pkg.browser}`
		},
		plugins
	}
]
