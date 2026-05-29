import { CanDeactivateFn } from "@angular/router";

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/**
 * Deactivation guard — asks for confirmation when a component
 * reports unsaved changes (e.g. an open modal with edited form fields).
 */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = component => {
  if (component?.hasUnsavedChanges?.()) {
    return confirm('You have unsaved changes. Are you sure you want to leave?');
  }
  return true;
};

