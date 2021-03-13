document.querySelectorAll("[data-animate-hover]").forEach((el) => {
	el.addEventListener("mousemove", prepareAnimation(el))
	el.addEventListener("mouseleave", resetMargins)
	el.addEventListener("touchmove", prepareAnimation(el))
	el.addEventListener("touchend", resetMargins)
})

const debugContainers = document.querySelectorAll("[data-debug]")
debugContainers[0].classList.contains
const toggleDebugging = (e, debugs) => {
	debugs.forEach((debug) => {
		debug.classList.toggle("border")
	})
}
document.querySelector("#toggle-debugging").addEventListener("click", (e) => {
	toggleDebugging(e, debugContainers)
})

const irregularCustomElements = document.querySelectorAll(
	'[is="irregular-follow-button"]'
)
const toggleIrregularity = (e, elements) => {
	elements.forEach((element) => {
		if (element.getAttribute("irregularity-type") === "1") {
			element.setAttribute("irregularity-type", 2)
		} else {
			element.setAttribute("irregularity-type", 1)
		}
	})
}
document
	.querySelector("#toggle-irregularity")
	.addEventListener("click", (e) =>
		toggleIrregularity(e, irregularCustomElements)
	)
