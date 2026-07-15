import type {Category} from "@/payload-types";

export type CategoryCustome = Pick<Category, "id" | "alt" | "slug" | "color" | "subcategories">
