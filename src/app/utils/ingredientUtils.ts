import {Ingredients} from "@/app/data/DataInterface";

/**
 * Turn the free-text amount from the form ("1.5 cups", "2", "a pinch", "½ tsp")
 * into the stored {quantity, unit} shape. A leading plain number becomes
 * `quantity`; everything else stays in `unit` exactly as typed, so fractions
 * like "½" or "1/2" display the way the user wrote them.
 */
export function splitAmount(amount: string): {quantity: number; unit: string} {
    const text = amount.trim();
    const match = text.match(/^(\d+(?:\.\d+)?)(?:\s+(.*))?$/);
    if (match) {
        return {quantity: Number(match[1]), unit: (match[2] ?? "").trim()};
    }
    return {quantity: 0, unit: text};
}

/** Inverse of splitAmount, for pre-filling the edit form. */
export function joinAmount(ingredient: Pick<Ingredients, "quantity" | "unit">): string {
    const qty = ingredient.quantity > 0 ? String(ingredient.quantity) : "";
    return [qty, ingredient.unit ?? ""].filter(Boolean).join(" ");
}

export function rowsToIngredients(rows: {qty: string; name: string}[]): Ingredients[] {
    return rows
        .filter(r => r.name.trim())
        .map(r => ({name: r.name.trim(), ...splitAmount(r.qty)}));
}
