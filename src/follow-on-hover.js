const MARGIN_NUMBER_REGEX = /\d+/
const MARGIN_UNIT_REGEX = /[^\d\.]+/
const MATCH_UPPERCASE = /[A-Z]/

const marginsKey = ["marginTop", "marginRight", "marginBottom", "marginLeft"]

const nullMargins = {
	marginTop: null,
	marginRight: null,
	marginBottom: null,
	marginLeft: null
}

const getClientPosition = (
	{ clientX, clientY, touches },
	{ top, right, bottom, left }
) => {
	const platformAsgnosticClientX = clientX || touches[0].clientX
	const platformAsgnosticClientY = clientY || touches[0].clientY

	return {
		clientX:
			platformAsgnosticClientX < left
				? left
				: platformAsgnosticClientX > right
				? right
				: platformAsgnosticClientX,
		clientY:
			platformAsgnosticClientY < top
				? top
				: platformAsgnosticClientY > bottom
				? bottom
				: platformAsgnosticClientY
	}
}

const getCursorPosition = (e) => {
	const { target } = e
	const rect = target.getBoundingClientRect()
	const { top, left, width, height } = rect
	const { clientX, clientY } = getClientPosition(e, rect)
	const maxXFromCenter = width / 2
	const maxYFromCenter = height / 2
	// Distance from center to edge as a quotient between 0 to 1
	const quotientOfDistanceX = (clientX - left - maxXFromCenter) / maxXFromCenter
	const quotientOfDistanceY = (clientY - top - maxYFromCenter) / maxYFromCenter

	return {
		quotientOfDistanceX,
		quotientOfDistanceY,
		isLeftEmphasized: quotientOfDistanceX < 0,
		isRightEmphasized: quotientOfDistanceX > 0,
		isTopEmphasized: quotientOfDistanceY < 0,
		isBottomEmphasized: quotientOfDistanceY > 0
	}
}

const getMargins = (element) => {
	const styles = getComputedStyle(element)
	const margins = marginsKey.reduce((acc, margin) => {
		acc[margin] = Number(MARGIN_NUMBER_REGEX.exec(styles[margin])[0])
		return acc
	}, {})
	return {
		...margins,
		unit: MARGIN_UNIT_REGEX.exec(styles.marginTop)[0]
	}
}

const lowerCaseMargin = (margin) =>
	margin.replace(MATCH_UPPERCASE, (match) => "-" + match.toLowerCase())

const formatMargins = (margins, unit) => {
	return marginsKey.reduce((acc, margin) => {
		acc[lowerCaseMargin(margin)] = margins[margin] && margins[margin] + unit
		return acc
	}, {})
}

const computeNewMargins = (
	{
		isLeftEmphasized,
		isRightEmphasized,
		isTopEmphasized,
		isBottomEmphasized,
		quotientOfDistanceX,
		quotientOfDistanceY
	},
	{ marginLeft, marginRight, marginTop, marginBottom }
) => {
	const leftSideQuotient = marginLeft * Math.abs(quotientOfDistanceX)
	const rightSideQuotient = marginRight * Math.abs(quotientOfDistanceX)
	const topSideQuotient = marginTop * Math.abs(quotientOfDistanceY)
	const bottomSideQuotient = marginBottom * Math.abs(quotientOfDistanceY)

	return {
		marginLeft: isLeftEmphasized
			? marginLeft - leftSideQuotient
			: marginLeft + rightSideQuotient,
		marginRight: isRightEmphasized
			? marginRight - rightSideQuotient
			: marginRight + leftSideQuotient,
		marginTop: isTopEmphasized
			? marginTop - topSideQuotient
			: marginTop + bottomSideQuotient,
		marginBottom: isBottomEmphasized
			? marginBottom - bottomSideQuotient
			: marginBottom + topSideQuotient
	}
}

const setMargins = (element, margins) => {
	const { unit: _, ...marginProperties } = margins
	for (const margin in marginProperties) {
		element.style.setProperty(margin, marginProperties[margin])
	}
}

const animate = (e, originalMargins) => {
	const position = getCursorPosition(e)
	const newMargins = computeNewMargins(position, originalMargins)
	setMargins(e.target, formatMargins(newMargins, originalMargins.unit))
}

export const prepareAnimation = (element) => {
	const originalMargins = getMargins(element)
	return (e) => animate(e, originalMargins)
}

export const resetMargins = (e) => setMargins(e.target, formatMargins(nullMargins, ""))
