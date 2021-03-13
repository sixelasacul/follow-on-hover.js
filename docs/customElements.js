class FollowOnHoverButton extends HTMLButtonElement {
	listeners = {
		runAnimation: null,
		reset: null
	}

	setStyle() {}

	setListeners() {
		const runAnimation = prepareAnimation(this)

		this.listeners.runAnimation = runAnimation
		this.listeners.reset = resetMargins

		this.addEventListener("mousemove", runAnimation)
		this.addEventListener("mouseleave", resetMargins)
		this.addEventListener("touchmove", runAnimation)
		this.addEventListener("touchend", resetMargins)
	}

	resetListeners() {
		this.removeEventListener("mousemove", this.listeners.runAnimation)
		this.removeEventListener("mouseleave", this.listeners.reset)
		this.removeEventListener("touchmove", this.listeners.runAnimation)
		this.removeEventListener("touchend", this.listeners.reset)

		this.listeners.runAnimation = null
		this.listeners.reset = null
	}

	connectedCallback() {
		if (this.isConnected) {
			/**
			 * Animation uses base margins, so they have to be set before adding the
			 * listeners.
			 */
			this.setStyle()
			this.setListeners()
		}
	}

	disconnectedCallback() {
		this.resetListeners()
	}
}

customElements.define("follow-button", FollowOnHoverButton, {
	extends: "button"
})

class ClassicButton extends FollowOnHoverButton {
	setStyle() {
		this.classList.add("classic")
	}
}

customElements.define("classic-follow-button", ClassicButton, {
	extends: "button"
})

class IrregularButton extends FollowOnHoverButton {
	static get observedAttributes() {
		return ["irregularity-type"]
	}

	static get irregularityTypes() {
		return [1, 2]
	}

	static get irregularityClass() {
		return "irregular"
	}

	updateClassList(oldValue, newValue) {
		oldValue &&
			this.classList.remove(IrregularButton.irregularityClass + oldValue)

		if (
			newValue &&
			IrregularButton.irregularityTypes.includes(Number(newValue))
		) {
			oldValue &&
				this.classList.remove(IrregularButton.irregularityClass + oldValue)
			this.classList.add(IrregularButton.irregularityClass + newValue)
			/**
			 * This lifecycle is called before the component is actually connected to
			 * the DOM, so we need to prevent loading listeners in this case.
			 */
			if (this.isConnected) {
				/**
				 * If the type changes, it will generate new styles, thus we need to
				 * update the listeners.
				 */
				this.resetListeners()
				this.setListeners()
			}
		}
	}

	/**
	 * Called twice when updating an attribute:
	 * - Once to propagate the old value;
	 * - Once to propagate the new value.
	 * More importantly, this is called before `connectedCallback`.
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "irregularity-type") {
			this.updateClassList(oldValue, newValue)
		}
	}
}

customElements.define("irregular-follow-button", IrregularButton, {
	extends: "button"
})
