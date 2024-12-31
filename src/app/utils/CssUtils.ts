export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
}

// Primary and Secondary Color Names
export const getPrimaryColorName = (): string => "green";
export const getSecondaryColorName = (): string => "white";
export const getPrimaryTextColorName = (): string => "black";
export const getSecondaryTextColorName = (): string => "white";
export const getAccentTextColorName = (): string => getPrimaryColorName();

// Generic Function for Dynamic Colors
export function getDynamicColor(property: string, color: string, boldness: number, prefix?: string): string {
    return `${prefix ? `${prefix}:` : ""}${property}-${color}-${boldness}`;
}

// Primary and Secondary Text Colors
export function getTextColor(isHover = false, color = getPrimaryTextColorName(), boldness = 600): string {
    return `${isHover ? "hover:" : ""}text-${color}-${boldness}`;
}

// Primary and Secondary Background Colors
export function getBgColor(isHover = false, color = getPrimaryColorName(), boldness = 600): string {
    return `${isHover ? "hover:" : ""}bg-${color}-${boldness}`;
}

// Outline Colors for Input Fields
export function getInputBoxFocusOutlineColor(isFocusVisible = false, boldness = 600): string {
    return `${isFocusVisible ? "focus-visible:" : "focus:"}outline-${getPrimaryColorName()}-${boldness}`;
}

// Input Field Styles
export function getInputFieldCss(): string {
    return classNames(
        "rounded-md bg-white px-3.5 py-2 text-base text-gray-900",
        "outline outline-1 -outline-offset-1 outline-gray-300",
        "placeholder:text-gray-400",
        getInputBoxFocusOutlineColor(true)
    );
}

// Checkbox Field Styles
export function getCheckBoxFieldCss(): string {
    return classNames(
        "appearance-none rounded border border-gray-300 bg-white",
        `checked:border-${getPrimaryColorName()}-600 checked:bg-${getPrimaryColorName()}-600`,
        `indeterminate:border-${getPrimaryColorName()}-600 indeterminate:bg-${getPrimaryColorName()}-600`,
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
        "disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100",
        "forced-colors:appearance-auto"
    );
}

// Link Text Styles
export function getLinkTextCss(): string {
    return classNames(
        "text-sm/6 font-semibold",
        getTextColor(false, getAccentTextColorName(), 600),
        getTextColor(true, getAccentTextColorName(), 500)
    );
}

// Primary Button Styles
export function getPrimaryButtonCss(): string {
    return classNames(
        "rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm",
        getBgColor(false),
        getBgColor(true, getPrimaryColorName(), 500),
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    );
}

// Main Body Styles
export function getMainBodyCss(): string {
    return classNames(
        "mx-auto p-6 h-screen flex-grow",
        "bg-gradient-to-b",
        `from-${getPrimaryColorName()}-100`,
        `to-${getSecondaryColorName()}`
    );
}
