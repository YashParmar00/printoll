"use client";

import { useState } from "react";

export default function CategorySelector({ categories, initialCategory }: { categories: string[]; initialCategory: string }) {
  const [adding, setAdding] = useState(!categories.includes(initialCategory));
  const [selected, setSelected] = useState(initialCategory);
  return <div className="mt-1 space-y-2">
    <select name={adding ? undefined : "category"} value={adding ? "__new__" : selected} onChange={(event) => { if (event.target.value === "__new__") setAdding(true); else setSelected(event.target.value); }} className="field">
      {categories.map((category) => <option key={category} value={category}>{category}</option>)}
      <option value="__new__">+ Add new category</option>
    </select>
    {adding && <div className="flex gap-2"><input name="category" required autoFocus defaultValue={categories.includes(initialCategory) ? "" : initialCategory} placeholder="New category name" className="field" /><button type="button" onClick={() => setAdding(false)} className="btn-secondary shrink-0 px-4 py-2 text-sm">Cancel</button></div>}
  </div>;
}
