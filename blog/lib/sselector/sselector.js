/**
 * DOM:
 * <div class="sselector">
 *   <div class="sselector-option" value="1">Option1</div>
 *   <div class="sselector-option" value="2">Option2</div>
 * </div>
 */

/**
 * Event:
 * 1. when select changed, sselector receive select-changed event
 *  eg. document.querySelector('.sselector').addEventListener('select-changed', e => {})
 * 2. when receive clear-selected, selector clear selected
 *  eg. document.querySelector('.sselector').dispatchEvent('clear-selected')
 */

document.querySelectorAll('.sselector-option').forEach(option => {
    option.onclick = e => {
        let option = e.target
        while (option && !option.classList.contains('sselector-option')) {
            option = option.parentElement
        }
        allOptions = option.parentElement.children
        for (let i = 0; i < allOptions.length; i++) {
            let option = allOptions[i]
            if (option.classList.contains('sselector-option') &&
                option.classList.contains('sselector-option-selected')) {
                option.classList.remove('sselector-option-selected')
            }
        }
        option.classList.add('sselector-option-selected')

        let selector = option.parentElement
        while (selector && !selector.classList.contains('sselector')) {
            selector = selector.parentElement
        }
        let changedEvent = new Event('select-changed')
        changedEvent.value = option.getAttribute('value')
        selector.dispatchEvent(changedEvent)
    }
})

document.querySelectorAll('.sselector').forEach(selector => {
    selector.addEventListener('clear-selected', e => {
        let allOptions = e.target.children
        for (let i = 0; i < allOptions.length; i++) {
            let option = allOptions[i]
            if (option.classList.contains('sselector-option') &&
                option.classList.contains('sselector-option-selected')) {
                option.classList.remove('sselector-option-selected')
            }
        }
        let changedEvent = new Event('select-changed')
        selector.dispatchEvent(changedEvent)
    })
    selector.addEventListener('show-count', e => {
        let allOptions = e.target.children
        let count = Number(e.value)
        for (let i = 0; i < allOptions.length; i++) {
            let option = allOptions[i]
            option.style.display = i < count ? "block" : "none"
        }
    })
})