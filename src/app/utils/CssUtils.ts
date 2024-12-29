export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function getMainBodyCss() {
    return "mx-auto p-6 h-screen flex-grow bg-gradient-to-b from-green-100 to-white"
    // return "mx-auto p-6 h-screen flex-grow bg-gradient-to-t from-green-100 to-white"
}

export function getPrimaryColorName() {
    return "green"
}

export function getSecondaryColorName() {
    return "white"
}

export function getPrimaryColor(property: string, boldness: number, prefix?: string) {
    if (prefix) {
        return `${prefix}:${property}-${getPrimaryColorName()}-${boldness}`;
    } else {
        return `${property}-${getPrimaryColorName()}-${boldness}`;
    }
}

export function getPrimaryTextColor(isHover: boolean = false, boldness: number = 600) {
    if (isHover) {
        //hover:text-green-600
        return `hover:text-${getPrimaryColorName()}-${boldness}`
    } else {
        //text-green-600
        return `text-${getPrimaryColorName()}-${boldness}`
    }
}

export function getSecondaryTextColor(isHover: boolean = false, boldness: number = 600) {
    if (isHover) {
        //hover:text-green-600
        return `hover:text-${getSecondaryColorName()}-${boldness}`
    } else {
        //text-green-600
        return `text-${getSecondaryColorName()}-${boldness}`
    }
}

export function getPrimaryBgColor(isHover: boolean = false, boldness: number = 600) {
    if (isHover) {
        //hover:bg-green-600
        return `hover:bg-${getPrimaryColorName()}-${boldness}`
    } else {
        //bg-green-600
        return `bg-${getPrimaryColorName()}-${boldness}`
    }
}

export function getInputBoxFocusOutlineColor(isFocusVisible: boolean = false, boldness: number = 600): string {
    if (isFocusVisible) {
        //focus-visible:outline-green-600
        return `focus-visible:outline-${getPrimaryColorName()}-${boldness}`
    } else {
        //focus:outline-green-600
        return `focus:outline-${getPrimaryColorName()}-${boldness}`
    }
}

export function getInputFieldCss(): string {
    return "rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
}

export function getCheckBoxFieldCss(): string {
    return "appearance-none rounded border border-gray-300 bg-white checked:border-green-600 checked:bg-green-600 indeterminate:border-green-600 indeterminate:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
}

export function getLinkTextCss(): string {
    return "text-sm/6 font-semibold text-green-600 hover:text-green-500"
}

export function getPrimaryButtonCss(): string {
    return "rounded-md bg-green-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
}