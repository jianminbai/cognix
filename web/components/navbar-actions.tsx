"use client";

import { SitePreferences } from "@/components/site-preferences";
import { SearchDialog } from "@/components/search-dialog";

// The right side of the navbar needs to be a client island because the search
// trigger toggles dialog state and listens for ⌘K / Esc globally. Mounting it
// here (instead of inline in `app/layout.tsx`) keeps the rest of the navbar as
// a server component.
export function NavbarActions() {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <SearchDialog />
      <SitePreferences />
    </div>
  );
}
