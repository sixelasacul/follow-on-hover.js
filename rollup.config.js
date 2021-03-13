import pkg from "./package.json"

const src = "src/follow-on-hover.js"
const baseOutput = {
  name: "followOnHover",
  file: pkg.browser,
  format: "umd"
}

export default [
	{
		input: src,
		output: baseOutput
	},
  // For docs
	{
		input: src,
		output: {
			...baseOutput,
      file: `docs/${pkg.browser}`
		}
	}
]
